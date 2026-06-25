export interface PageInfo {
  name: string;
  purpose: string;
  screenshotDesc: string;
}

export interface FeatureInfo {
  name: string;
  confidence: number; // 0 to 100
  description: string;
}

export interface FlowNode {
  id: string;
  type: string;
  data: { label: string; description?: string };
  position: { x: number; y: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

export interface ArchService {
  name: string;
  purpose: string;
  tech: string;
  dependencies: string[];
}

export interface DBColumn {
  name: string;
  type: string;
  key?: 'PK' | 'FK';
  refTable?: string;
}

export interface DBTable {
  name: string;
  columns: DBColumn[];
}

export interface InfraMetric {
  label: string;
  value: string;
  change?: string;
  description: string;
}

export interface CostItem {
  category: string;
  resource: string;
  cost: number;
}

export interface TechStackItem {
  category: string;
  name: string;
  reason: string;
}

export interface ProjectReport {
  id: string;
  url: string;
  name: string;
  industry: string;
  productType: string;
  pagesCount: number;
  featuresCount: number;
  timestamp: string;
  pages: PageInfo[];
  features: FeatureInfo[];
  flowNodes: FlowNode[];
  flowEdges: FlowEdge[];
  services: ArchService[];
  tables: DBTable[];
  infraMetrics: InfraMetric[];
  costs: CostItem[];
  techStack: TechStackItem[];
}

export const mockProjects: Record<string, ProjectReport> = {
  "airbnb.com": {
    id: "airbnb.com",
    url: "https://airbnb.com",
    name: "Airbnb",
    industry: "Hospitality & Vacation Rentals",
    productType: "Marketplace / Peer-to-Peer Booking Platform",
    pagesCount: 5,
    featuresCount: 8,
    timestamp: "2026-06-24 13:50:00",
    pages: [
      { name: "Home / Discover", purpose: "Landing, search bar, map filter controls, and categories filter", screenshotDesc: "Hero search panel overlaying card grid of listings" },
      { name: "Search & Filters", purpose: "Listing search results, dynamic split-map layout, and calendar pricing picker", screenshotDesc: "Interactive map on the right, listing list cards on the left" },
      { name: "Listing Detail Page", purpose: "Photos, reviews rating breakdown, host bio, pricing calculations, booking widget", screenshotDesc: "Listing image gallery, review modules, sticky booking panel" },
      { name: "Checkout & Booking", purpose: "House rules validation, payment options, booking summary, and guest message", screenshotDesc: "Split page with billing on left, trip summary card on right" },
      { name: "Guest Portal & Trips", purpose: "Trip itineraries, past receipts, review submission, host chat interface", screenshotDesc: "Conversational feed screen and check-in timeline" }
    ],
    features: [
      { name: "Authentication & Identity Verification", confidence: 98, description: "Multi-factor OAuth with passport/document scanning verification pipeline." },
      { name: "ElasticSearch Listing Catalog", confidence: 95, description: "Geo-spatial query indices supporting dynamic bounding box map queries." },
      { name: "Review & Rating Core", confidence: 99, description: "Double-blind review system preventing rating bias between guests and hosts." },
      { name: "Messaging & Real-time Chat", confidence: 92, description: "WebSocket channels for communication between guest and host with system filtering." },
      { name: "Multi-currency Stripe Ledger", confidence: 97, description: "Multi-party split payment system with automated guest escrow and host payout payouts." },
      { name: "Dynamic Pricing Engine", confidence: 89, description: "Machine learning adjustments based on seasonality, occupancy, and demand spikes." },
      { name: "Google Maps Integration", confidence: 96, description: "Polygonal boundaries search, reverse geocoding listing coordinates." },
      { name: "Booking State Machine", confidence: 99, description: "Strict transaction locks preventing double-booking of identical dates." }
    ],
    flowNodes: [
      { id: "1", type: "input", data: { label: "Landing & Discover Page", description: "Search query + date coordinates submitted" }, position: { x: 250, y: 0 } },
      { id: "2", type: "default", data: { label: "Search Results & Map Grid", description: "Listing selected by client" }, position: { x: 250, y: 100 } },
      { id: "3", type: "default", data: { label: "Listing Details Page", description: "Initial check-in constraints validated" }, position: { x: 250, y: 200 } },
      { id: "4", type: "default", data: { label: "Checkout & Billing Core", description: "Hold put on funds via Stripe escrow" }, position: { x: 250, y: 300 } },
      { id: "5", type: "default", data: { label: "Booking Request Queue", description: "Host notification dispatched" }, position: { x: 250, y: 400 } },
      { id: "6", type: "output", data: { label: "Booking Confirmed State", description: "Itinerary generated + receipts generated" }, position: { x: 250, y: 500 } }
    ],
    flowEdges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
      { id: "e4-5", source: "4", target: "5", animated: true },
      { id: "e5-6", source: "5", target: "6", animated: true }
    ],
    services: [
      { name: "API Gateway (Kong)", purpose: "Global request routing, rate limiting, and JWT authentication termination.", tech: "Kong / OpenResty", dependencies: [] },
      { name: "Auth & Identity Service", purpose: "User profile management, verification triggers, OAuth providers mapping.", tech: "Go / Auth0 API", dependencies: ["PostgreSQL"] },
      { name: "Listing Catalog Service", purpose: "Handles high-read listings query, geo-queries, and property configurations.", tech: "Node.js / Express", dependencies: ["ElasticSearch", "PostgreSQL"] },
      { name: "Booking Core Service", purpose: "Coordinates transactional state machine for checkout, dates lock, and availability.", tech: "Java / Spring Boot", dependencies: ["PostgreSQL", "Redis"] },
      { name: "Payments / Payout Ledger", purpose: "Triggers Stripe webhooks, schedules payouts, and logs double-entry balance sheets.", tech: "Ruby on Rails", dependencies: ["PostgreSQL", "RabbitMQ"] },
      { name: "Notification dispatcher", purpose: "Handles SMS, emails, and mobile push notifications for bookings and messages.", tech: "Python / FastAPI", dependencies: ["Redis", "AWS SES/SNS"] }
    ],
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "email", type: "VARCHAR(255)" },
          { name: "password_hash", type: "VARCHAR(255)" },
          { name: "full_name", type: "VARCHAR(128)" },
          { name: "is_host", type: "BOOLEAN" },
          { name: "created_at", type: "TIMESTAMP" }
        ]
      },
      {
        name: "properties",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "host_id", type: "UUID", key: "FK", refTable: "users" },
          { name: "title", type: "VARCHAR(255)" },
          { name: "description", type: "TEXT" },
          { name: "latitude", type: "DECIMAL(9,6)" },
          { name: "longitude", type: "DECIMAL(9,6)" },
          { name: "price_per_night", type: "DECIMAL(10,2)" }
        ]
      },
      {
        name: "bookings",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "property_id", type: "UUID", key: "FK", refTable: "properties" },
          { name: "guest_id", type: "UUID", key: "FK", refTable: "users" },
          { name: "check_in", type: "DATE" },
          { name: "check_out", type: "DATE" },
          { name: "status", type: "VARCHAR(50)" },
          { name: "total_amount", type: "DECIMAL(10,2)" }
        ]
      },
      {
        name: "reviews",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "booking_id", type: "UUID", key: "FK", refTable: "bookings" },
          { name: "reviewer_id", type: "UUID", key: "FK", refTable: "users" },
          { name: "rating", type: "INT" },
          { name: "comment", type: "TEXT" },
          { name: "created_at", type: "TIMESTAMP" }
        ]
      },
      {
        name: "messages",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "sender_id", type: "UUID", key: "FK", refTable: "users" },
          { name: "receiver_id", type: "UUID", key: "FK", refTable: "users" },
          { name: "content", type: "TEXT" },
          { name: "sent_at", type: "TIMESTAMP" }
        ]
      }
    ],
    infraMetrics: [
      { label: "Estimated Monthly Active Users", value: "85M", description: "SaaS baseline query capacity requirement" },
      { label: "Storage Size Requirement", value: "240 TB", description: "Image assets storage plus ledger databases" },
      { label: "Bandwidth Capacity", value: "1.2 Gbps", description: "Peak CDN delivery bandwidth" },
      { label: "Active Connections (WebSocket)", value: "320k", description: "Concurrent chat/push alerts channels" },
      { label: "Estimated Database Nodes", value: "12 Nodes", description: "Write masters, read replicas, caching clusters" }
    ],
    costs: [
      { category: "Compute", resource: "EKS Cluster (30x m5.xlarge instances)", cost: 4200 },
      { category: "Database", resource: "AWS RDS PostgreSQL (Multi-AZ Cluster + Replicas)", cost: 2800 },
      { category: "Caching", resource: "Elasticache for Redis Cluster", cost: 1100 },
      { category: "Storage & CDN", resource: "AWS S3 + CloudFront Data Transfer", cost: 3400 },
      { category: "Monitoring & Logs", resource: "Datadog / OpenTelemetry Cloud", cost: 1500 }
    ],
    techStack: [
      { category: "Frontend Core", name: "Next.js 15 (React 19, TypeScript)", reason: "Server-side rendering for optimal SEO crawling and highly responsive routing." },
      { category: "Backend Architecture", name: "FastAPI / Python & Java Spring Boot", reason: "FastAPI provides quick scripting endpoints; Spring Boot handles complex double-booking locks and safety." },
      { category: "Relational Storage", name: "PostgreSQL Cluster (TimescaleDB extension)", reason: "ACID compliance for monetary ledgers and chronological logs." },
      { category: "Speed & Cache Layer", name: "Redis Enterprise Node", reason: "Caches hot listing configurations, active sessions, and active booking availability locks." },
      { category: "Static Assets Sizing", name: "AWS S3 + CloudFront CDN", reason: "Aggressively caches listing photographs globally with dynamic image optimization." },
      { category: "Message Broker", name: "RabbitMQ Queue", reason: "Asynchronous task worker dispatching for bookings confirmation notifications, review syncs, and payouts." }
    ]
  },
  "swiggy.com": {
    id: "swiggy.com",
    url: "https://swiggy.com",
    name: "Swiggy",
    industry: "Food Delivery & Hyperlocal Commerce",
    productType: "On-demand Hyperlocal Delivery & Marketplace",
    pagesCount: 6,
    featuresCount: 7,
    timestamp: "2026-06-24 13:51:12",
    pages: [
      { name: "Home / Location Picker", purpose: "Saves client geo-coordinates, searches available restaurants and quick commerce items", screenshotDesc: "Interactive address entry modal with banner sliders" },
      { name: "Restaurant Menu", purpose: "Lists food categorized by menu, deals picker, custom preparation notes input", screenshotDesc: "Veg/Non-Veg filter switches next to long item listing cards" },
      { name: "Cart & Offers", purpose: "Applies promo codes, delivery tips calculation, order summary layout", screenshotDesc: "Order review pane with map route prediction widget" },
      { name: "Live Order Tracking", purpose: "Real-time delivery partner coordinates on maps, order progress timeline", screenshotDesc: "Full screen map with bike icon traversing routes" },
      { name: "User Accounts & Orders", purpose: "Lists past orders, lets users toggle refund balances, updates preferences", screenshotDesc: "List of order cards with 'Reorder' CTA" }
    ],
    features: [
      { name: "Hyperlocal Search Query Routing", confidence: 97, description: "Finds nearby restaurants within 5-10km radius using geohashes (Uber H3 index)." },
      { name: "Live Route Tracking (GPS)", confidence: 94, description: "WebSockets and HTTP long-polling dispatching coordinate logs from rider apps to clients." },
      { name: "High Concurrency Payment Processing", confidence: 99, description: "Concurrent locks handling millions of active carts during lunch/dinner surges." },
      { name: "Rider Dispatching Algorithm", confidence: 91, description: "Assigns orders automatically to riders based on proximity, load, and routing optimization." },
      { name: "Instamart Cart Sync", confidence: 95, description: "Real-time inventory lookup preventing order of out-of-stock items in warehouses." },
      { name: "Loyalty Membership Engine", confidence: 93, description: "Applies free delivery logic across partners dynamically checking subscriber status." },
      { name: "Dynamic Delivery Pricing", confidence: 88, description: "Surge pricing scaling during rainy seasons or heavy traffic periods." }
    ],
    flowNodes: [
      { id: "1", type: "input", data: { label: "Geo-Location Selected", description: "Local restaurant catalog rendered" }, position: { x: 250, y: 0 } },
      { id: "2", type: "default", data: { label: "Restaurant Menu Interaction", description: "Cart compiled with local lock check" }, position: { x: 250, y: 100 } },
      { id: "3", type: "default", data: { label: "Checkout & Payment Page", description: "Order queued in broker on success" }, position: { x: 250, y: 200 } },
      { id: "4", type: "default", data: { label: "Rider Matching Engine", description: "Closest available rider claims trip" }, position: { x: 250, y: 300 } },
      { id: "5", type: "default", data: { label: "Kitchen Preparation State", description: "Rider heads to restaurant node" }, position: { x: 250, y: 400 } },
      { id: "6", type: "output", data: { label: "Out for Delivery & Completed", description: "Order complete metadata pushed" }, position: { x: 250, y: 500 } }
    ],
    flowEdges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
      { id: "e4-5", source: "4", target: "5", animated: true },
      { id: "e5-6", source: "5", target: "6", animated: true }
    ],
    services: [
      { name: "Hyperlocal Catalog Service", purpose: "Serves nearby restaurant details, coordinates, menus, and item stocks.", tech: "Java / Spring Boot", dependencies: ["Redis", "MongoDB"] },
      { name: "Order Intake Engine", purpose: "Highly resilient service caching pending carts, checkout requests, and bills.", tech: "Go / Fiber", dependencies: ["Kafka", "PostgreSQL"] },
      { name: "Rider Dispatcher Engine", purpose: "Calculates driver distance, manages partner states, and matches rides.", tech: "Python / PyPy", dependencies: ["H3 Spatial DB", "Redis"] },
      { name: "Tracking Broker", purpose: "Exposes lightweight WebSocket channels to broadcast rider GPS to customers.", tech: "Node.js / Socket.io", dependencies: ["Redis Streams"] },
      { name: "Promo & Rewards Service", purpose: "Evaluates coupon rules, calculates cashbacks, and updates user loyalty status.", tech: "Kotlin", dependencies: ["PostgreSQL"] }
    ],
    tables: [
      {
        name: "restaurants",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "name", type: "VARCHAR(128)" },
          { name: "geohash", type: "VARCHAR(12)" },
          { name: "address", type: "TEXT" },
          { name: "is_active", type: "BOOLEAN" }
        ]
      },
      {
        name: "riders",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "phone_number", type: "VARCHAR(20)" },
          { name: "current_lat", type: "DECIMAL(9,6)" },
          { name: "current_lng", type: "DECIMAL(9,6)" },
          { name: "status", type: "VARCHAR(32)" }
        ]
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "restaurant_id", type: "UUID", key: "FK", refTable: "restaurants" },
          { name: "rider_id", type: "UUID", key: "FK", refTable: "riders" },
          { name: "total_price", type: "DECIMAL(10,2)" },
          { name: "order_status", type: "VARCHAR(64)" }
        ]
      }
    ],
    infraMetrics: [
      { label: "Estimated Daily Orders", value: "2.4M", description: "High write pressure at specific times" },
      { label: "Storage Size Requirement", value: "80 TB", description: "Focuses on transaction archives" },
      { label: "Bandwidth Capacity", value: "850 Mbps", description: "Constant coordinate payloads routing" },
      { label: "Active Connections (WebSocket)", value: "980k", description: "High volume rider/client tracking syncs" },
      { label: "Estimated Database Nodes", value: "18 Nodes", description: "NoSQL shards, geo-spatial nodes" }
    ],
    costs: [
      { category: "Compute", resource: "EKS Cluster (45x c5.xlarge instances)", cost: 5800 },
      { category: "Database", resource: "AWS DynamoDB + Aurora PostgreSQL", cost: 3500 },
      { category: "Caching", resource: "Redis Cluster (Live GPS Tracking Store)", cost: 2300 },
      { category: "Maps Integration", resource: "Google Maps API fees (Usage-based)", cost: 4800 },
      { category: "Monitoring & Alerts", resource: "Grafana & Prometheus Enterprise", cost: 1100 }
    ],
    techStack: [
      { category: "Frontend Core", name: "React Native & Next.js", reason: "React Native for mobile rider/customer apps, Next.js for high-speed web ordering." },
      { category: "Backend Architecture", name: "Go (Golang) / Spring Boot", reason: "Go handles high-throughput coordinate updates; Spring Boot handles complex state logic." },
      { category: "Relational Storage", name: "Aurora PostgreSQL & MongoDB", reason: "Aurora handles transactions; MongoDB hosts complex, nested restaurant menus." },
      { category: "Speed & Cache Layer", name: "Redis & Apache Kafka", reason: "Kafka queues orders dynamically; Redis holds active driver locations." },
      { category: "Static Assets Sizing", name: "S3 + Fastly CDN", reason: "Fastly handles high-speed image loads of meals for close-proximity requests." },
      { category: "Message Broker", name: "Kafka Streams", reason: "Maintains real-time state changes as orders flow from user to kitchen to rider." }
    ]
  },
  "notion.so": {
    id: "notion.so",
    url: "https://notion.so",
    name: "Notion",
    industry: "Productivity & Collaboration Software",
    productType: "Block-Based Rich Document Editor & Collaboration App",
    pagesCount: 4,
    featuresCount: 6,
    timestamp: "2026-06-24 13:52:45",
    pages: [
      { name: "Workspace Workspace", purpose: "Collapsible document directory, favorites picker, search access, customizable widgets", screenshotDesc: "Left side navbar with hierarchical pages, central rich text editor" },
      { name: "Document Editor", purpose: "Block-based editing engine, inline actions, drag-drop block handles, slash commands menu", screenshotDesc: "Editor with markdown style paragraphs, code blocks, bullet points" },
      { name: "Database View", purpose: "Renders rows in tables, boards, galleries, calendars; customizable filters and sorts", screenshotDesc: "Kanban board showing cards grouped by Status columns" },
      { name: "Settings & Share Modals", purpose: "Invites email guests, handles permission roles (admin, edit, view), manages billing", screenshotDesc: "Workspace permission modal overlaying settings panel" }
    ],
    features: [
      { name: "Block-Based Editor Engine", confidence: 99, description: "Treats paragraphs, images, videos, tables, and databases as unique block IDs." },
      { name: "Real-time CRDT Sync", confidence: 96, description: "Conflict-Free Replicated Data Types merging concurrent keystrokes from multiple users." },
      { name: "Hierarchical Page Tree", confidence: 98, description: "A recursive document model mapping sub-pages inside parent workspaces." },
      { name: "Dynamic Relational DB", confidence: 95, description: "Inline spreadsheet databases with columns mapping to text, numbers, formulas, and relationships." },
      { name: "Fast Full-Text Search", confidence: 92, description: "Elasticsearch index scanning across nested documents and tables instantly." },
      { name: "Access Controls Matrix", confidence: 97, description: "Deeply nested workspace settings allowing role-based overrides." }
    ],
    flowNodes: [
      { id: "1", type: "input", data: { label: "Workspace Rendered", description: "Tree hierarchy fetched from storage" }, position: { x: 250, y: 0 } },
      { id: "2", type: "default", data: { label: "Page Selected & Opened", description: "Individual block hierarchy streamed" }, position: { x: 250, y: 100 } },
      { id: "3", type: "default", data: { label: "Real-time Block Edited", description: "CRDT mutation sent to server" }, position: { x: 250, y: 200 } },
      { id: "4", type: "default", data: { label: "Sync Engine Resolution", description: "Changes broadcasted via WebSockets" }, position: { x: 250, y: 300 } },
      { id: "5", type: "output", data: { label: "Offline Storage Cache", description: "Local IndexDB update executed" }, position: { x: 250, y: 400 } }
    ],
    flowEdges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
      { id: "e4-5", source: "4", target: "5", animated: true }
    ],
    services: [
      { name: "Workspace Hierarchy Service", purpose: "Maintains document folders, titles, nesting rules, and fast sidebar renders.", tech: "TypeScript / Node.js", dependencies: ["PostgreSQL"] },
      { name: "Block Sync Engine", purpose: "Resolves concurrent block alterations using CRDT algorithms; manages mutations.", tech: "Rust / Actix-web", dependencies: ["Redis", "PostgreSQL"] },
      { name: "Collab Gateway", purpose: "Manages active user sessions on specific documents via WebSocket connections.", tech: "Go / WebSockets", dependencies: ["Redis"] },
      { name: "Search Engine", purpose: "Indexes document titles and block content to provide fast global search results.", tech: "Java / Elasticsearch", dependencies: ["Elasticsearch"] },
      { name: "Asset Upload Service", purpose: "Validates files, processes images, and generates secure presigned AWS S3 keys.", tech: "TypeScript", dependencies: ["AWS S3"] }
    ],
    tables: [
      {
        name: "workspaces",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "name", type: "VARCHAR(128)" },
          { name: "created_at", type: "TIMESTAMP" }
        ]
      },
      {
        name: "pages",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "workspace_id", type: "UUID", key: "FK", refTable: "workspaces" },
          { name: "parent_page_id", type: "UUID", key: "FK", refTable: "pages" },
          { name: "title", type: "VARCHAR(255)" },
          { name: "icon", type: "VARCHAR(32)" }
        ]
      },
      {
        name: "blocks",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "page_id", type: "UUID", key: "FK", refTable: "pages" },
          { name: "parent_block_id", type: "UUID" },
          { name: "block_type", type: "VARCHAR(50)" },
          { name: "content", type: "JSONB" },
          { name: "sort_order", type: "INT" }
        ]
      }
    ],
    infraMetrics: [
      { label: "Estimated Daily Users", value: "12M", description: "High WebSocket active subscriber load" },
      { label: "Storage Size Requirement", value: "310 TB", description: "Substantial database size due to rich history" },
      { label: "Bandwidth Capacity", value: "550 Mbps", description: "Constant small synchronization events" },
      { label: "Active Connections (WebSocket)", value: "1.8M", description: "Synchronizing state across teams" },
      { label: "Estimated Database Nodes", value: "10 Nodes", description: "PostgreSQL master-slave setups" }
    ],
    costs: [
      { category: "Compute", resource: "EKS Cluster (25x c6g.xlarge ARM instances)", cost: 3100 },
      { category: "Database", resource: "AWS Aurora PostgreSQL (optimised JSONB queries)", cost: 4200 },
      { category: "Caching", resource: "ElastiCache Redis Cluster", cost: 1500 },
      { category: "Storage & CDN", resource: "AWS S3 + CloudFront CDN", cost: 2600 },
      { category: "APIs & Search", resource: "Elasticsearch Hosted Cluster", cost: 1800 }
    ],
    techStack: [
      { category: "Frontend Core", name: "React 19 / TypeScript / Vite", reason: "Utilizes complex Client-side state engines (MobX or Zustand) to render block updates in real-time." },
      { category: "Backend Architecture", name: "Rust / Node.js Microservices", reason: "Rust handles CPU-intensive text merging (CRDT), while Node.js manages business APIs." },
      { category: "Relational Storage", name: "PostgreSQL with JSONB indexing", reason: "Excellent support for relational integrity combined with flexibility for custom block schemas." },
      { category: "Speed & Cache Layer", name: "Redis Core", reason: "Maintains short-term WebSocket connection states and lock flags for editors." },
      { category: "Static Assets Sizing", name: "S3 + CloudFront", reason: "Hosts images and files embedded within user workspace pages." },
      { category: "Message Broker", name: "Kafka Pipeline", reason: "Processes changes and streams them to Elasticsearch indices and activity logs." }
    ]
  },
  "stripe.com": {
    id: "stripe.com",
    url: "https://stripe.com",
    name: "Stripe",
    industry: "Financial Infrastructure & Payments",
    productType: "Global Financial APIs & Payment Processing Gateway",
    pagesCount: 5,
    featuresCount: 8,
    timestamp: "2026-06-24 13:53:10",
    pages: [
      { name: "Payment Intents API", purpose: "Programmatic gateway for secure credit card checkout, 3D secure, and authorization flows", screenshotDesc: "API JSON request/response schema terminal panel" },
      { name: "Merchant Dashboard", purpose: "Aggregated charts of daily revenue, customer disputes, payouts, and API error rates", screenshotDesc: "Dark dashboard showing line charts of transactions and success metrics" },
      { name: "Customers & Cards List", purpose: "Manages saved tokens, active payment cards, subscriptions billing schedules", screenshotDesc: "Tables listing customers with labels and active subscriptions" },
      { name: "Developers / Webhooks Console", purpose: "Lists API keys, webhook endpoint logs, retry states, and developer events", screenshotDesc: "Console listing API request histories with HTTP statuses (e.g., 200 OK)" },
      { name: "Disputes & Refunds UI", purpose: "Lets managers submit dispute evidence, issue refunds, and trigger balance payouts", screenshotDesc: "Document upload panel and dispute status pipeline" }
    ],
    features: [
      { name: "PCI-Compliant Tokenization", confidence: 99, description: "Locks card data in separate HSM servers, returning secure tokens for billing APIs." },
      { name: "Payment Intents Routing", confidence: 99, description: "State machine checking billing credentials against dozens of global banking networks." },
      { name: "Subscription Billing Engine", confidence: 97, description: "Coordinates recurring billing schedules, smart retries, and tax calculations." },
      { name: "Fraud Detection (Radar AI)", confidence: 95, description: "Evaluates card fraud risk scoring during transactions based on device fingerprinting." },
      { name: "Idempotency Lock Controller", confidence: 98, description: "Prevents double-charges by validating unique Idempotency-Key headers." },
      { name: "Webhook Dispatcher Engine", confidence: 96, description: "Retries delivery of transaction status webhooks with exponential backoff rules." }
    ],
    flowNodes: [
      { id: "1", type: "input", data: { label: "Payment Request (API/JS)", description: "Tokenized payload + Idempotency check" }, position: { x: 250, y: 0 } },
      { id: "2", type: "default", data: { label: "Fraud Check (Radar)", description: "Transaction score evaluated in 80ms" }, position: { x: 250, y: 100 } },
      { id: "3", type: "default", data: { label: "Acquiring Bank Dispatch", description: "Routed to optimal network gateway" }, position: { x: 250, y: 200 } },
      { id: "4", type: "default", data: { label: "Ledger Balance Updated", description: "Internal double-entry journal post" }, position: { x: 250, y: 300 } },
      { id: "5", type: "output", data: { label: "Webhook Event Queued", description: "Client systems notified via API callback" }, position: { x: 250, y: 400 } }
    ],
    flowEdges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
      { id: "e4-5", source: "4", target: "5", animated: true }
    ],
    services: [
      { name: "API Ingestion Gateway", purpose: "Validates API keys, enforces rate limits, checks idempotency keys, parses payloads.", tech: "Ruby / C++ Core", dependencies: ["Redis"] },
      { name: "Fraud Evaluation (Radar)", purpose: "Evaluates risk factors using real-time machine learning models.", tech: "Python / TensorFlow", dependencies: ["Redis"] },
      { name: "Payment Processor Core", purpose: "Coordinates routing with visa/mastercard network connections.", tech: "Java / Spring Boot", dependencies: ["PostgreSQL"] },
      { name: "Double-Entry Ledger Service", purpose: "Ensures accounting accuracy and handles money transfers.", tech: "Go / CockroachDB", dependencies: ["CockroachDB"] },
      { name: "Webhook Delivery Service", purpose: "Sends HTTP POST events to clients with exponential retry strategies.", tech: "Go / RabbitMQ", dependencies: ["RabbitMQ", "PostgreSQL"] }
    ],
    tables: [
      {
        name: "accounts",
        columns: [
          { name: "id", type: "VARCHAR(64)", key: "PK" },
          { name: "email", type: "VARCHAR(255)" },
          { name: "country", type: "VARCHAR(8)" },
          { name: "balance_cents", type: "BIGINT" },
          { name: "created_at", type: "TIMESTAMP" }
        ]
      },
      {
        name: "charges",
        columns: [
          { name: "id", type: "VARCHAR(64)", key: "PK" },
          { name: "account_id", type: "VARCHAR(64)", key: "FK", refTable: "accounts" },
          { name: "amount_cents", type: "BIGINT" },
          { name: "currency", type: "VARCHAR(4)" },
          { name: "status", type: "VARCHAR(32)" },
          { name: "card_token", type: "VARCHAR(128)" },
          { name: "idempotency_key", type: "VARCHAR(255)" }
        ]
      },
      {
        name: "refunds",
        columns: [
          { name: "id", type: "VARCHAR(64)", key: "PK" },
          { name: "charge_id", type: "VARCHAR(64)", key: "FK", refTable: "charges" },
          { name: "amount_cents", type: "BIGINT" },
          { name: "reason", type: "TEXT" },
          { name: "processed_at", type: "TIMESTAMP" }
        ]
      }
    ],
    infraMetrics: [
      { label: "API Availability", value: "99.999%", description: "Highly strict SLA requirements" },
      { label: "Storage Size Requirement", value: "480 TB", description: "Audit trail log records" },
      { label: "Average Latency", value: "110 ms", description: "Goal request processing window" },
      { label: "Active Connections", value: "50k", description: "Synchronized API integrations" },
      { label: "Estimated Database Nodes", value: "24 Nodes", description: "CockroachDB distributed setup" }
    ],
    costs: [
      { category: "Compute", resource: "Secure Private Cloud Infrastructure", cost: 12000 },
      { category: "Database", resource: "CockroachDB Multi-Region Enterprise", cost: 8500 },
      { category: "HSM Cryptography", resource: "Hardware Security Modules (Card Protection)", cost: 4000 },
      { category: "APIs & Network", resource: "Anycast Edge Routing & Cloudflare Magic Transit", cost: 3500 },
      { category: "Monitoring", resource: "Splunk Enterprise & Datadog Core", cost: 4500 }
    ],
    techStack: [
      { category: "Frontend Dashboard", name: "React 19 / TypeScript", reason: "Standard single page applications containing extensive chart networks and ledger summaries." },
      { category: "Backend Architecture", name: "Ruby, Go, and Java Core", reason: "Ruby handles product APIs; Go handles high-speed HTTP processing; Java handles processing transactions." },
      { category: "Relational Storage", name: "CockroachDB / Distributed SQL", reason: "Ensures ACID accuracy across global server clusters, preventing double spending." },
      { category: "Speed & Cache Layer", name: "Redis Core Cluster", reason: "Checks duplicate request idempotency keys instantly." },
      { category: "Static Assets Sizing", name: "Fastly Edge Router", reason: "Ensures payment forms load in milliseconds anywhere on earth." },
      { category: "Message Broker", name: "Apache Kafka Queue", reason: "Processes analytics metrics and buffers downstream webhook events." }
    ]
  }
};

export function getOrCreateProjectReport(targetDomain: string, targetUrl: string): ProjectReport {
  const cleanDomain = targetDomain.toLowerCase().replace("www.", "");
  if (mockProjects[cleanDomain]) {
    return mockProjects[cleanDomain];
  }

  // Capitalize name
  const nameParts = cleanDomain.split(".");
  const name = nameParts[0] || "custom";
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

  let industry = "General SaaS & Web Services";
  let productType = "Cloud System / Web Portal";
  
  let pages = [
    { name: "Home Dashboard", purpose: "Main customer console showing metrics, charts, main resources", screenshotDesc: "Dense grid layout showing user data feeds" },
    { name: "Auth Portal", purpose: "Sign-in, registration, password recovery, MFA validation", screenshotDesc: "Centered credentials login card" },
    { name: "Settings Console", purpose: "User profile editing, security keys, account options", screenshotDesc: "Tabbed configuration sheets" }
  ];
  
  let features = [
    { name: "Authentication Core", confidence: 99, description: "Secure credential authentication, session tokens management." },
    { name: "Resource Controller", confidence: 95, description: "Displays dynamic items, searches list items filters." },
    { name: "Settings Management", confidence: 97, description: "Manages user profiles, credentials keys setup." }
  ];
  
  let flowNodes = [
    { id: "1", type: "input", data: { label: "Landing / Discover", description: "Visitor lands on home route" }, position: { x: 250, y: 0 } },
    { id: "2", type: "default", data: { label: "Auth Portal", description: "User credentials validation" }, position: { x: 250, y: 100 } },
    { id: "3", type: "default", data: { label: "Main Console", description: "Main platform cockpit panels" }, position: { x: 250, y: 200 } },
    { id: "4", type: "output", data: { label: "Settings Desk", description: "Manage operator parameters" }, position: { x: 250, y: 300 } }
  ];
  
  let flowEdges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3", animated: true },
    { id: "e3-4", source: "3", target: "4", animated: true }
  ];
  
  let services = [
    { name: "API Gateway Proxy", purpose: "Routes incoming API calls to core backend endpoints.", tech: "Kong Gateway", dependencies: [] },
    { name: "Auth Core Service", purpose: "Validates JWT tokens, manages active user accounts.", tech: "Go / Fiber", dependencies: ["PostgreSQL"] },
    { name: "Application Core", purpose: "Handles primary application actions, runs business algorithms.", tech: "Python / FastAPI", dependencies: ["PostgreSQL", "Redis"] }
  ];
  
  let tables: DBTable[] = [
    {
      name: "users",
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "username", type: "VARCHAR(64)" },
        { name: "password_hash", type: "VARCHAR(255)" },
        { name: "created_at", type: "TIMESTAMP" }
      ]
    },
    {
      name: "profiles",
      columns: [
        { name: "id", type: "UUID", key: "PK" },
        { name: "user_id", type: "UUID", key: "FK", refTable: "users" },
        { name: "full_name", type: "VARCHAR(128)" }
      ]
    }
  ];

  if (cleanDomain.includes("github")) {
    industry = "Developer Tools & Version Control";
    productType = "Code Hosting & Collaborative Development Platform";
    pages = [
      { name: "Repository Code view", purpose: "Code file browser, branch switcher, README Markdown compiler, clone actions", screenshotDesc: "Breadcrumb navigation bar above folder table list" },
      { name: "Pull Requests panel", purpose: "Lists review states, commit timelines, inline code change diff files", screenshotDesc: "Conversational feed threads indicating review approvals" },
      { name: "Actions CI/CD Console", purpose: "Runs workflow steps, displays build log terminal output lists", screenshotDesc: "Vertical pipeline logs grid showing step runtimes" },
      { name: "Issues Board", purpose: "Tracks bugs, organizes project boards, registers comment threads", screenshotDesc: "List of open/closed issues with tag badges" }
    ];
    features = [
      { name: "Git Repo Hosting", confidence: 99, description: "Distributed revision control database rendering repositories trees." },
      { name: "Pull Request Code Review", confidence: 98, description: "Compares file changes, runs lint check hooks, registers comments." },
      { name: "GitHub Actions CI/CD Core", confidence: 94, description: "Runs runner server clusters parsing YAML workflow configurations." },
      { name: "Markdown Compiler", confidence: 97, description: "Renders markdown file guides inline with HTML style blocks." }
    ];
    flowNodes = [
      { id: "1", type: "input", data: { label: "Repository Home", description: "Explore repository directories" }, position: { x: 250, y: 0 } },
      { id: "2", type: "default", data: { label: "Code Viewer", description: "Inspect individual code buffers" }, position: { x: 250, y: 100 } },
      { id: "3", type: "default", data: { label: "Pull Request", description: "Propose modifications review branch diffs" }, position: { x: 250, y: 200 } },
      { id: "4", type: "default", data: { label: "Actions Pipeline", description: "Compile code runs test suite suite" }, position: { x: 250, y: 300 } },
      { id: "5", type: "output", data: { label: "Merge Commit", description: "Commit changes into main stream" }, position: { x: 250, y: 400 } }
    ];
    flowEdges = [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true },
      { id: "e4-5", source: "4", target: "5", animated: true }
    ];
    services = [
      { name: "Git Gateway Service", purpose: "Handles SSH / HTTP clone, pull, and push commands.", tech: "Go / Custom Git engine", dependencies: [] },
      { name: "Repository Core Service", purpose: "Manages branch lists, releases, file tags explorer.", tech: "Ruby on Rails", dependencies: ["MySQL", "Redis"] },
      { name: "Actions Runner Service", purpose: "Manages scheduling build runner threads on VM clusters.", tech: "C# / .NET Core", dependencies: ["Kubernetes", "RabbitMQ"] },
      { name: "Search & Indexer", purpose: "Performs high-speed code search across all directories.", tech: "Java / Elasticsearch", dependencies: ["Elasticsearch"] }
    ];
    tables = [
      {
        name: "users",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "username", type: "VARCHAR(64)" },
          { name: "email", type: "VARCHAR(255)" }
        ]
      },
      {
        name: "repositories",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "owner_id", type: "UUID", key: "FK", refTable: "users" },
          { name: "name", type: "VARCHAR(128)" }
        ]
      },
      {
        name: "pull_requests",
        columns: [
          { name: "id", type: "UUID", key: "PK" },
          { name: "repo_id", type: "UUID", key: "FK", refTable: "repositories" },
          { name: "author_id", type: "UUID", key: "FK", refTable: "users" },
          { name: "status", type: "VARCHAR(32)" }
        ]
      }
    ];
  } else if (cleanDomain.includes("google")) {
    industry = "Search Engine & Cloud Infrastructure";
    productType = "Distributed Web Search Indexer & Workspace Platform";
    pages = [
      { name: "Search Main Page", purpose: "Clean minimalist query form, voice scan, doodles renderer", screenshotDesc: "Iconic search input centered on white backboard" },
      { name: "Results Grid", purpose: "Relevance snippets list, knowledge cards panels, search tools menu", screenshotDesc: "Ranked list of clickable hyperlink titles with details" }
    ];
    features = [
      { name: "PageRank Search Indexer", confidence: 99, description: "Distributed web index scanning billions of public links." },
      { name: "AdSense Ads Bid Engine", confidence: 98, description: "Real-time query matching ads auctioning system." }
    ];
    flowNodes = [
      { id: "1", type: "input", data: { label: "Search Entry", description: "User visits search portal" }, position: { x: 250, y: 0 } },
      { id: "2", type: "default", data: { label: "Relevance Query Parser", description: "NLP query parsing and tokenization" }, position: { x: 250, y: 100 } },
      { id: "3", type: "output", data: { label: "Results Matrix", description: "Matches indexed sites maps to client" }, position: { x: 250, y: 200 } }
    ];
    flowEdges = [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true }
    ];
    services = [
      { name: "Query Router Gateway", purpose: "Splits queries across distributed document retrieval indices.", tech: "C++ / Borg Scheduler", dependencies: [] },
      { name: "Ad Selection Service", purpose: "Retrieves relevant ads based on query search terms bidding.", tech: "Java / Bigtable", dependencies: ["Bigtable"] }
    ];
    tables = [
      {
        name: "indexed_documents",
        columns: [
          { name: "doc_id", type: "BIGINT", key: "PK" },
          { name: "url", type: "VARCHAR(2048)" },
          { name: "pagerank_score", type: "FLOAT" }
        ]
      }
    ];
  }

  // Generate generic costs/metrics
  const infraMetrics = [
    { label: "Estimated Monthly Active Users", value: "25M", description: "Scale projections based on global traffic rankings" },
    { label: "Storage Size Requirement", value: "85 TB", description: "Database transaction logs + user assets hosting" },
    { label: "Bandwidth Capacity", value: "640 Mbps", description: "Estimated peak content delivery requirements" },
    { label: "Estimated Database Nodes", value: "6 Nodes", description: "Primary master node with read replica sets" }
  ];
  
  const costs = [
    { category: "Compute", resource: "Virtual Server Node instances (e.g. AWS EC2 / ECS)", cost: 1450 },
    { category: "Database", resource: "Cloud Relational Database Cluster (PostgreSQL/MySQL)", cost: 980 },
    { category: "Caching & Storage", resource: "AWS S3 Cloud Assets + Redis Cache", cost: 620 },
    { category: "CDN Network", resource: "Edge CDN Data Transfer Delivery", cost: 550 }
  ];
  
  const techStack = [
    { category: "Frontend", name: "Next.js / React / Tailwind CSS", reason: "Standard tech stack for responsive speed and SEO indexing optimization." },
    { category: "Backend System", name: "FastAPI (Python) or Go (Golang)", reason: "FastAPI for standard database operations; Go for high concurrency worker loops." },
    { category: "Datastore Engine", name: "PostgreSQL Database", reason: "Reliable ACID relational storage supporting high schema integrity checks." },
    { category: "Cache Core", name: "Redis Caching Node", reason: "Speeds up common page queries, settings reads, and session tokens lookups." }
  ];

  const newReport: ProjectReport = {
    id: cleanDomain,
    url: targetUrl,
    name: capitalizedName,
    industry,
    productType,
    pagesCount: pages.length,
    featuresCount: features.length,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    pages,
    features,
    flowNodes,
    flowEdges,
    services,
    tables,
    infraMetrics,
    costs,
    techStack
  };
  
  mockProjects[cleanDomain] = newReport;
  return newReport;
}
