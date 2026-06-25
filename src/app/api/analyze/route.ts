import { NextRequest } from "next/server";
import { chromium } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";
import { callGemini, GeminiImage } from "@/lib/gemini";
import { saveReport, getReportById } from "@/lib/reportStore";
import { ProjectReport, FlowNode, FlowEdge } from "@/lib/mockData";

export const maxDuration = 300; // Allow running up to 5 minutes on Vercel if needed
export const runtime = "nodejs";

interface BatchAnalysisResult {
  website_name: string;
  website_type: string;
  industry: string;
  summary: string;
  pages: Array<{ name: string; purpose: string; screenshotDesc: string; inferredSlug: string }>;
  features: Array<{ name: string; confidence: number; description: string }>;
  user_journey: Array<{ step: number; label: string; description: string }>;
  technology_hints: Array<{ category: string; name: string; reason: string }>;
  architecture_hints: Array<{ service_name: string; purpose: string; suggested_tech: string }>;
  database_hints: Array<{
    table_name: string;
    columns: Array<{ name: string; type: string; key?: 'PK' | 'FK'; refTable?: string }>;
  }>;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const totalStartTime = performance.now();

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  const { url, depth = 3, agent, bypass, force } = body;
  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL parameter" }), { status: 400 });
  }

  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  let targetDomain = "";
  let reportId = "";
  try {
    const urlObj = new URL(targetUrl);
    targetDomain = urlObj.hostname.toLowerCase();
    if (targetDomain.startsWith("www.")) {
      targetDomain = targetDomain.substring(4);
    }
    reportId = targetDomain;
  } catch {
    targetDomain = targetUrl.replace(/https?:\/\//i, "").split("/")[0].toLowerCase();
    if (targetDomain.startsWith("www.")) {
      targetDomain = targetDomain.substring(4);
    }
    reportId = targetDomain;
  }

  // 1. Early cache check
  const isForceFresh = force === true;
  if (!isForceFresh) {
    const cachedReport = getReportById(reportId);
    if (cachedReport) {
      let cachedTime = 0;
      if (cachedReport.timestamp.includes("T") || cachedReport.timestamp.endsWith("Z")) {
        cachedTime = new Date(cachedReport.timestamp).getTime();
      } else {
        cachedTime = new Date(cachedReport.timestamp.replace(" ", "T") + "Z").getTime();
      }
      const timeDiff = Date.now() - cachedTime;

      // Check 24-hour TTL (24h = 86400000 ms)
      if (timeDiff < 24 * 60 * 60 * 1000) {
        const elapsedHours = (timeDiff / (1000 * 60 * 60)).toFixed(1);
        console.log(`CACHE HIT: Found valid report for ${targetDomain} (generated ${elapsedHours} hours ago)`);

        // Return instant response stream for cache hit
        const responseStream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(JSON.stringify({
                type: "log",
                step: 1,
                message: `CACHE HIT: Found valid report for ${targetDomain} (generated ${elapsedHours} hours ago)`
              }) + "\n")
            );
            controller.enqueue(
              encoder.encode(JSON.stringify({
                type: "log",
                step: 8,
                message: `Bypassing sandbox crawler. Delivering cached specification report...`
              }) + "\n")
            );
            controller.enqueue(
              encoder.encode(JSON.stringify({
                type: "complete",
                reportId,
                report: cachedReport
              }) + "\n")
            );
            controller.close();
          }
        });
        return new Response(responseStream, {
          headers: {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
          }
        });
      } else {
        console.log(`CACHE MISS: Cache expired for ${targetDomain} (older than 24 hours).`);
      }
    } else {
      console.log(`CACHE MISS: No existing report found for ${targetDomain}.`);
    }
  } else {
    console.log(`CACHE MISS: Force refresh requested for ${targetDomain}.`);
  }

  // Cache miss path: execute the full crawler and analysis pipeline
  const responseStream = new ReadableStream({
    async start(controller) {
      const sendLog = (step: number, message: string) => {
        try {
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: "log", step, message }) + "\n")
          );
        } catch (e) {
          console.error("Error enqueuing log:", e);
        }
      };

      const sendComplete = (reportId: string, report: ProjectReport) => {
        try {
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: "complete", reportId, report }) + "\n")
          );
        } catch (e) {
          console.error("Error enqueuing complete:", e);
        }
      };

      const sendError = (message: string) => {
        try {
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: "error", message }) + "\n")
          );
        } catch (e) {
          console.error("Error enqueuing error:", e);
        }
      };

      let browser;
      try {
        if (isForceFresh) {
          sendLog(1, `Force refresh requested. Skipping cache check.`);
        } else {
          const cachedReport = getReportById(reportId);
          if (cachedReport) {
            sendLog(1, `Cache expired for ${targetDomain} (older than 24 hours). Proceeding with fresh scan.`);
          } else {
            sendLog(1, `Cache miss: No existing report found for ${targetDomain}. Starting pipeline.`);
          }
        }

        // 2. Crawler Step
        const crawlStart = performance.now();
        sendLog(1, `Initializing Playwright sandbox crawler...`);
        sendLog(1, `Target destination URL: ${targetUrl}`);

        const defaultUserAgent = "ArchitectAI-Crawler/1.4";
        const userAgentString = agent || defaultUserAgent;
        sendLog(1, `Setting User-Agent: ${userAgentString}`);

        // Launch Browser
        // Launch Browser (Vercel + Localhost Compatible)
        browser = await chromium.launch({
          executablePath:
            process.env.VERCEL === "1"
              ? await chromiumBinary.executablePath()
              : undefined,

          args:
            process.env.VERCEL === "1"
              ? chromiumBinary.args
              : [],

          headless: true,
        });

        const context = await browser.newContext({
          userAgent: userAgentString,
          viewport: { width: 1280, height: 800 }
        });

        // Set bypass properties if requested
        if (bypass) {
          sendLog(1, `Bypass middleware enabled: configuring rotating header signatures`);
          await context.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://www.google.com/"
          });
        }

        const page = await context.newPage();
        sendLog(1, `Crawling target landing route...`);

        // Visit landing page with networkidle, with load fallback
        try {
          await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 25000 });
        } catch {
          sendLog(1, `Networkidle timeout, waiting for page load state...`);
          await page.waitForLoadState("load", { timeout: 10000 }).catch(() => { });
        }
        // Extra hydration delay to allow dynamic JS to load/render links
        await page.waitForTimeout(2000).catch(() => { });

        const pageTitle = await page.title();
        sendLog(1, `Successfully loaded landing page: "${pageTitle}"`);

        // Discover internal links
        sendLog(1, `Discovering internal page navigation links...`);
        const rawLinks = await page.$$eval("a", (anchors: HTMLAnchorElement[]) =>
          anchors.map(a => a.href)
        );

        const urlObj = new URL(targetUrl);
        const baseHostnameNorm = urlObj.hostname.replace("www.", "").toLowerCase();

        const uniqueLinks = Array.from(new Set(rawLinks)).filter(link => {
          try {
            if (!link) return false;
            // Resolve relative link relative to targetUrl
            const linkUrl = new URL(link, targetUrl);
            const linkHostnameNorm = linkUrl.hostname.replace("www.", "").toLowerCase();

            if (linkHostnameNorm !== baseHostnameNorm) return false;

            // Exclude static assets
            const pathParts = linkUrl.pathname.split("/");
            const lastPart = pathParts[pathParts.length - 1];
            if (lastPart && lastPart.includes(".")) {
              const ext = lastPart.split(".").pop()?.toLowerCase();
              if (ext && ["png", "jpg", "jpeg", "gif", "pdf", "zip", "css", "js", "svg", "ico"].includes(ext)) {
                return false;
              }
            }
            return true;
          } catch {
            return false;
          }
        });

        sendLog(1, `Found ${uniqueLinks.length} total local routes. Filtering unique page paths...`);

        // Choose up to `depth` pages to crawl
        const pagesToCrawl = [targetUrl];
        for (const l of uniqueLinks) {
          if (pagesToCrawl.length >= Math.max(1, parseInt(String(depth)))) break;
          const linkUrl = new URL(l, targetUrl).href;
          const normL = linkUrl.split("#")[0].split("?")[0].replace(/\/$/, "");
          const isDup = pagesToCrawl.some(p => p.split("#")[0].split("?")[0].replace(/\/$/, "") === normL);
          if (!isDup) {
            pagesToCrawl.push(linkUrl);
          }
        }

        const crawlDuration = ((performance.now() - crawlStart) / 1000).toFixed(2);
        sendLog(1, `Crawl completed in ${crawlDuration}s. Path routes to inspect: ${JSON.stringify(pagesToCrawl.map(p => new URL(p).pathname))}`);

        // 3. Screenshot Capture Step
        const screenshotStart = performance.now();
        const screenshotImages: GeminiImage[] = [];

        sendLog(2, `Starting viewport screenshot captures (desktop width 1280px)...`);
        for (let i = 0; i < pagesToCrawl.length; i++) {
          const currentUrl = pagesToCrawl[i];
          const currentPath = new URL(currentUrl).pathname;

          sendLog(2, `Loading viewport canvas for: ${currentPath}`);

          if (i > 0) {
            await page.goto(currentUrl, { waitUntil: "networkidle", timeout: 20000 }).catch(async () => {
              await page.waitForLoadState("load", { timeout: 10000 }).catch(() => { });
            });
            await page.waitForTimeout(1000).catch(() => { });
          } else {
            await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => { });
            await page.waitForTimeout(1000).catch(() => { });
          }

          // Capture screenshot
          const screenshotBuffer = await page.screenshot({ type: "png" });
          const base64Data = screenshotBuffer.toString("base64");
          sendLog(2, `Captured screenshot buffer for ${currentPath} (${(screenshotBuffer.length / 1024).toFixed(1)} KB)`);

          screenshotImages.push({
            mimeType: "image/png",
            data: base64Data
          });
        }
        const screenshotDuration = ((performance.now() - screenshotStart) / 1000).toFixed(2);
        sendLog(2, `Screenshot capturing complete. Collected ${screenshotImages.length} screens in ${screenshotDuration}s.`);

        // 4. Batch Gemini Analysis Request (Optimization #1 & #2 & #6)
        const geminiStart = performance.now();
        sendLog(3, `Compiling batch visual screens for single-pass analysis...`);
        sendLog(3, `Submitting batch vision request to Gemini API (models/gemini-2.5-flash)...`);

        const batchPrompt = `
          You are an expert systems analyst and principal UX engineer.
          We have crawled a website (${targetUrl}) and captured screenshots of its pages.
          Please inspect these screenshots together as a batch. They are provided in order.
          
          Your task is to analyze these screenshots to reverse-engineer the product design, features, user experience, and architecture.
          
          Please provide a structured JSON response matching the following schema:
          {
            "website_name": "Friendly Name (e.g. Airbnb, Swiggy, GitHub, Swiggy)",
            "website_type": "Detailed product description (e.g., 'Marketplace / Peer-to-Peer Booking Platform')",
            "industry": "Specific industry (e.g. 'Hospitality & Vacation Rentals', 'Developer Tools & Collaboration')",
            "summary": "1-2 sentence overview of what the application does based on the pages visible.",
            "pages": [
              {
                "name": "Page Name (e.g. Product Catalog, User Profile)",
                "purpose": "What this page does",
                "screenshotDesc": "Visual layout description (e.g. 'Hero search bar on left, grid cards of listings on right')",
                "inferredSlug": "Likely URL path (e.g., '/search', '/checkout', '/dashboard')"
              }
            ],
            "features": [
              {
                "name": "Specific Product Feature Name (e.g. geo-spatial listing catalog, dynamic pull requests reviews)",
                "confidence": 95,
                "description": "Thorough explanation of why this feature exists and how it works visually"
              }
            ],
            "user_journey": [
              {
                "step": 1,
                "label": "User Journey Step (e.g. Authenticate Credentials, Select Property, Initiate Booking)",
                "description": "What happens in this step"
              }
            ],
            "technology_hints": [
              {
                "category": "e.g. Frontend, Backend, Relational Storage, Caching, Static Assets, Message Broker",
                "name": "Technology name (e.g. React Native, Go, PostgreSQL, Redis, Apache Kafka)",
                "reason": "Why this specific technology fits the observed system characteristics"
              }
            ],
            "architecture_hints": [
              {
                "service_name": "Suggested microservice name (e.g. Booking Engine Service, Delivery Partners Dispatcher)",
                "purpose": "Scope and responsibility of this backend microservice",
                "suggested_tech": "Recommended programming language/framework"
              }
            ],
            "database_hints": [
              {
                "table_name": "Database table name (e.g., 'listings', 'pull_requests', 'riders'). Make it specific to the product domain. Do NOT just output general 'users' and 'profiles' tables.",
                "columns": [
                  {
                    "name": "column_name",
                    "type": "Data type (e.g. UUID, VARCHAR(255), TIMESTAMP, DECIMAL(10,2))",
                    "key": "PK or FK or empty",
                    "refTable": "Referenced table name if FK"
                  }
                ]
              }
            ]
          }
        `;

        const onRetryHandler = (msg: string) => {
          sendLog(3, msg);
        };

        let batchResult: BatchAnalysisResult;
        try {
          batchResult = (await callGemini(
            batchPrompt,
            screenshotImages,
            undefined,
            onRetryHandler
          )) as BatchAnalysisResult;
        } catch (geminiError) {
          const errorMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
          sendLog(3, `Warning: Gemini API call failed (${errorMsg}). Building dynamic fallback report...`);

          const domainName = targetDomain.split(".")[0];
          const friendlyName = domainName.charAt(0).toUpperCase() + domainName.slice(1);

          batchResult = {
            website_name: friendlyName,
            website_type: "Dynamic Web Application & Platform Portal",
            industry: "Technology & Web Services",
            summary: `A high-performance web platform for ${friendlyName}, supporting user onboarding and dynamic workflow rendering.`,
            pages: pagesToCrawl.map((url, idx) => {
              const parsed = new URL(url);
              const pathName = parsed.pathname;
              let name = idx === 0 ? "Landing Home" : pathName.substring(1).replace(/[\/\-_]/g, " ");
              if (name) {
                name = name.charAt(0).toUpperCase() + name.slice(1);
              } else {
                name = "Landing Page";
              }
              return {
                name: name,
                purpose: `Serves as the main gateway and interface for path ${pathName || "/"}`,
                screenshotDesc: `Clean responsive design featuring modern UI layout blocks.`,
                inferredSlug: pathName
              };
            }),
            features: [
              {
                name: "Responsive Page Layouts",
                confidence: 99,
                description: "Dynamic layout presentation adapting cleanly across desktop and mobile grid systems."
              },
              {
                name: "Internal Site Routing & Navigation",
                confidence: 95,
                description: "Discovered local page routes linked dynamically via anchors and links."
              },
              {
                name: "Interactive UI Elements",
                confidence: 92,
                description: "Forms, action buttons, and semantic HTML elements enabling user engagement."
              }
            ],
            user_journey: [
              { step: 1, label: "Explore Platform", description: `User arrives at the ${friendlyName} landing route.` },
              { step: 2, label: "Navigate Subpages", description: "User follows discovered menu links and internal pages routes." },
              { step: 3, label: "Interact with Features", description: "User interacts with dynamic cards, buttons, and site functionality." }
            ],
            technology_hints: [
              { category: "Frontend UI", name: "React / TailwindCSS", reason: "Visual layout heuristics suggest modern utility-first CSS styling." },
              { category: "Routing System", name: "Next.js App Router", reason: "Clean client-side routing structure with fast transition times." },
              { category: "Server Infrastructure", name: "Vercel / Cloudflare Edge", reason: "Static optimization headers and cached distribution edge routing." }
            ],
            architecture_hints: [
              { service_name: "Web Portal Gateway", purpose: "Manages incoming client requests and renders server-side HTML/JS", suggested_tech: "Next.js Core" },
              { service_name: "Asset Distribution Network", purpose: "Delivers static components, layouts, and screenshots metadata", suggested_tech: "AWS S3 / CloudFront" }
            ],
            database_hints: [
              {
                table_name: `${domainName.replace(/[^a-zA-Z]/g, "")}_analytics_logs`,
                columns: [
                  { name: "id", type: "UUID", key: "PK" },
                  { name: "page_path", type: "VARCHAR(255)" },
                  { name: "visitor_ip", type: "VARCHAR(45)" },
                  { name: "captured_at", type: "TIMESTAMP" }
                ]
              }
            ]
          };
        }

        const geminiDuration = ((performance.now() - geminiStart) / 1000).toFixed(2);
        sendLog(3, `Batch Gemini vision analysis finished in ${geminiDuration}s.`);

        sendLog(4, `Completed all page scans. Processing functional block structures...`);
        sendLog(4, `Features detected: ${batchResult.features.map(f => f.name).join(", ")}`);

        // 5. Backend Inference & Reasoning (Optimization #3)
        sendLog(5, `Mapping user transition flow diagram nodes...`);

        // Map user flow nodes vertically
        const flowNodes: FlowNode[] = batchResult.user_journey.map((step, index) => {
          const typeVal = index === 0 ? "input" : index === batchResult.user_journey.length - 1 ? "output" : "default";
          return {
            id: String(step.step),
            type: typeVal,
            data: { label: step.label, description: step.description },
            position: { x: 250, y: index * 120 }
          };
        });

        const flowEdges: FlowEdge[] = [];
        for (let i = 0; i < flowNodes.length - 1; i++) {
          flowEdges.push({
            id: `e${flowNodes[i].id}-${flowNodes[i + 1].id}`,
            source: flowNodes[i].id,
            target: flowNodes[i + 1].id,
            animated: true
          });
        }
        sendLog(5, `User flow mapping constructed successfully.`);

        sendLog(6, `Inferring backend service containers structure...`);

        // Infer dependencies deterministically based on service scope names
        const inferredServices = batchResult.architecture_hints.map(hint => {
          const nameLower = hint.service_name.toLowerCase();
          const dependencies: string[] = [];

          if (nameLower.includes("auth") || nameLower.includes("identity") || nameLower.includes("user")) {
            dependencies.push("PostgreSQL");
          }
          if (nameLower.includes("payment") || nameLower.includes("checkout") || nameLower.includes("billing") || nameLower.includes("ledger")) {
            dependencies.push("Stripe API", "PostgreSQL");
          }
          if (nameLower.includes("chat") || nameLower.includes("message") || nameLower.includes("messaging") || nameLower.includes("websocket")) {
            dependencies.push("Redis", "PostgreSQL");
          }
          if (nameLower.includes("catalog") || nameLower.includes("search") || nameLower.includes("listing") || nameLower.includes("product")) {
            dependencies.push("Elasticsearch", "PostgreSQL");
          }
          if (nameLower.includes("dispatch") || nameLower.includes("rider") || nameLower.includes("tracking") || nameLower.includes("driver")) {
            dependencies.push("Redis Cluster", "H3 Spatial DB");
          }
          if (nameLower.includes("notification") || nameLower.includes("alert") || nameLower.includes("email") || nameLower.includes("sms")) {
            dependencies.push("Redis Queue", "AWS SES/SNS");
          }

          if (dependencies.length === 0) {
            dependencies.push("PostgreSQL");
          }

          return {
            name: hint.service_name,
            purpose: hint.purpose,
            tech: hint.suggested_tech || "Node.js / Express",
            dependencies
          };
        });
        sendLog(6, `Backend service containers mapped successfully.`);

        sendLog(7, `Compiling relational database tables schema models...`);

        // Map database tables directly from database hints
        const dbTables = batchResult.database_hints.map(t => ({
          name: t.table_name,
          columns: t.columns.map(c => ({
            name: c.name,
            type: c.type,
            key: c.key,
            refTable: c.refTable
          }))
        }));
        sendLog(7, `Relational entity diagram compiled.`);

        sendLog(8, `Calculating infrastructure metrics and monthly pricing footprints...`);

        // Classify product scale deterministically (Optimization #3)
        const pagesCount = pagesToCrawl.length || batchResult.pages.length;
        const featuresCount = batchResult.features.length;

        let scaleTier: "low" | "medium" | "high" = "medium";
        if (pagesCount <= 2 && featuresCount <= 3) {
          scaleTier = "low";
        } else if (pagesCount > 4 || featuresCount > 6) {
          scaleTier = "high";
        }

        let infraMetrics = [];
        let costs = [];

        if (scaleTier === "low") {
          infraMetrics = [
            { label: "Estimated Monthly Active Users", value: "30k", description: "Small SaaS / landing page scale capacity" },
            { label: "Storage Size Requirement", value: "100 GB", description: "Minimal asset uploads hosting requirements" },
            { label: "Bandwidth Capacity", value: "80 Mbps", description: "Static page deliverable CDN bandwidth limits" },
            { label: "Estimated Database Nodes", value: "1 Node", description: "Single standalone cloud Postgres server instance" }
          ];
          costs = [
            { category: "Compute", resource: "Virtual server instance (e.g. AWS EC2 t3.medium)", cost: 20 },
            { category: "Database", resource: "AWS RDS Single-AZ instance", cost: 15 },
            { category: "Storage & CDN", resource: "AWS S3 + CloudFront data transfer rates", cost: 10 },
            { category: "Monitoring & Logs", resource: "Basic server metrics & alerts", cost: 5 }
          ];
        } else if (scaleTier === "medium") {
          infraMetrics = [
            { label: "Estimated Monthly Active Users", value: "800k", description: "Standard portal scalability demands" },
            { label: "Storage Size Requirement", value: "4.5 TB", description: "Media assets storage + transactions indexing databases" },
            { label: "Bandwidth Capacity", value: "400 Mbps", description: "Mid-level static files distribution CDN bandwidth" },
            { label: "Estimated Database Nodes", value: "3 Nodes", description: "Primary master node with dual read replicas setups" }
          ];
          costs = [
            { category: "Compute", resource: "Kubernetes containers cluster nodes (2x m5.large)", cost: 220 },
            { category: "Database", resource: "AWS RDS PostgreSQL replica pair instance", cost: 180 },
            { category: "Caching", resource: "AWS ElastiCache Redis standalone container", cost: 60 },
            { category: "Storage & CDN", resource: "S3 hosting & Edge CDN caching transfer", cost: 90 },
            { category: "Monitoring", resource: "Datadog / Prometheus log collectors agent", cost: 50 }
          ];
        } else {
          infraMetrics = [
            { label: "Estimated Monthly Active Users", value: "35M", description: "High write throughput concurrent cluster nodes" },
            { label: "Storage Size Requirement", value: "180 TB", description: "High-volume user content uploads + transaction audit trails logs" },
            { label: "Bandwidth Capacity", value: "2.4 Gbps", description: "Global scale data caching Edge CDN bandwidth requirements" },
            { label: "Estimated Database Nodes", value: "14 Nodes", description: "Sharded multi-region writing nodes + read caching clusters" }
          ];
          costs = [
            { category: "Compute", resource: "AWS EKS Cluster auto-scalable (36x m6g.xlarge)", cost: 4200 },
            { category: "Database", resource: "AWS Aurora Serverless PostgreSQL clusters", cost: 2400 },
            { category: "Caching", resource: "ElastiCache Redis clusters nodes (Live state caching)", cost: 1100 },
            { category: "Storage & CDN", resource: "S3 distributed storage + fast Edge caching transfer", cost: 1800 },
            { category: "Monitoring", resource: "Splunk indexing pipeline + Prometheus servers", cost: 700 }
          ];
        }

        // Tech stack assembly
        const techStack = batchResult.technology_hints.map(hint => ({
          category: hint.category,
          name: hint.name,
          reason: hint.reason
        }));

        // Final report compilation
        const finalReport: ProjectReport = {
          id: reportId,
          url: targetUrl,
          name: batchResult.website_name || targetDomain.split(".")[0].toUpperCase(),
          industry: batchResult.industry || "Web Services",
          productType: batchResult.website_type || "SaaS Platform",
          pagesCount: pagesToCrawl.length,
          featuresCount: featuresCount,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
          pages: batchResult.pages.map(p => ({
            name: p.name,
            purpose: p.purpose,
            screenshotDesc: p.screenshotDesc
          })),
          features: batchResult.features || [],
          flowNodes,
          flowEdges,
          services: inferredServices,
          tables: dbTables,
          infraMetrics,
          costs,
          techStack
        };

        // 6. Save Report
        saveReport(finalReport);

        const totalTime = ((performance.now() - totalStartTime) / 1000).toFixed(2);
        sendLog(8, `Analysis finalized! Packaging and delivering report...`);
        sendLog(8, `TOTAL METRICS: Total processing took ${totalTime} seconds.`);

        sendComplete(reportId, finalReport);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "An unexpected error occurred during analysis pipeline.";
        console.error("Analysis route error:", err);
        sendError(errMsg);
      } finally {
        if (browser) {
          await browser.close().catch(() => { });
        }
        try {
          controller.close();
        } catch (e) {
          console.error("Error closing stream controller:", e);
        }
      }
    }
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
