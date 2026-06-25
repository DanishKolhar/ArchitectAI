# 🏗️ ArchitectAI — AI Product Reverse Engineer

> Reverse engineer modern software products using AI.

Developers often ask 'How was this product built?' when looking at products like Instagram, GitHub,
Airbnb or YouTube. ArchitectAI automates this investigation by combining web crawling, AI vision,
and architectural reasoning.

ArchitectAI is an AI-powered platform that analyzes publicly accessible websites and generates an inferred software architecture report. Instead of inspecting source code, it studies a website's user interface and behavior to predict how the product is likely designed and implemented.

Simply provide a website URL, and ArchitectAI automatically discovers pages, detects features, reconstructs user journeys, infers backend architecture and database design, estimates infrastructure requirements, and recommends a suitable technology stack.

---

## ✨ Features

- 🌐 Analyze any publicly accessible website
- 🕸️ Automated website crawling using Playwright
- 📸 Multi-page screenshot capture
- 🧠 AI-powered visual analysis using Gemini Vision
- 📄 Automatic page discovery
- 🔍 Intelligent feature detection
- 🔀 User journey reconstruction
- 🏗️ Backend architecture inference
- 🗄️ Database schema inference
- ☁️ Infrastructure estimation
- ⚙️ Technology stack recommendations
- 📥 Export reports as JSON and Markdown
- ⚡ Intelligent caching for repeated analyses

---

# 🚀 How It Works

```text
User
 │
 ▼
Enter Website URL
 │
 ▼
Playwright Browser
 │
 ▼
Website Crawling
 │
 ▼
Screenshot Capture
 │
 ▼
Gemini Vision Analysis
(Single Batched Request)
 │
 ▼
Structured JSON Response
 │
 ▼
Backend Reasoning Engine
 │
 ├── Feature Detection
 ├── User Flow Mapping
 ├── Architecture Inference
 ├── Database Inference
 └── Infrastructure Estimation
 │
 ▼
Interactive Report
 │
 ▼
JSON / Markdown Export
```

---

# 📊 Generated Report

ArchitectAI generates a comprehensive report containing:

- Website Overview
- Pages Discovered
- Detected Features
- User Journey Flow
- Architecture Inference
- Database Design
- Infrastructure Estimates
- Recommended Tech Stack

---

# 🧠 AI Pipeline

Unlike traditional pipelines that make multiple AI requests for each stage, ArchitectAI optimizes the workflow by performing a single batched Gemini Vision analysis.

```text
Website URL
      │
      ▼
Playwright Crawl
      │
      ▼
Batch Screenshot Collection
      │
      ▼
Single Gemini Vision Request
      │
      ▼
Structured Analysis
      │
      ▼
Python Reasoning Engine
      │
      ▼
Final Report
```

This approach reduces API usage, improves performance, and enables faster report generation.

---

# 🛠 Tech Stack

**Frontend**
- Next.js 15
- TypeScript
- Tailwind CSS
- React Flow
- Framer Motion
- shadcn/ui

**Backend**
- FastAPI
- Python

**AI & Automation**
- Playwright
- Google Gemini Vision API

---

# 💡 Use Cases

- Learn how popular software products are likely built
- Study software architecture patterns
- Understand user flows and product structure
- Generate reference architectures for new projects
- Assist software architects during planning
- Educational tool for students learning system design

---

# ⚠️ Disclaimer

ArchitectAI does **not** access or inspect proprietary source code.

All reports are **AI-generated architectural inferences** based solely on publicly accessible webpages, visible UI components, navigation, and observed functionality. The generated architecture should be considered an informed estimate rather than the actual implementation.

---

# 🚧 Future Improvements

- Competitor comparison
- API inference
- Business model analysis
- Monetization insights
- Interactive architecture diagrams
- PDF export
- Multi-LLM support
- Authentication for saved reports

---

# 📸 Screenshots

> Add screenshots of:
>
> - Landing Page
> - Analysis Pipeline
> - Final Report
> - Architecture View

---

# 👨‍💻 Author

**Mohammed Danish Kolhar**

If you found this project interesting, feel free to connect or share your feedback!

---

⭐ If you like this project, consider giving it a star!
