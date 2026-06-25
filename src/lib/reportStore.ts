import fs from "fs";
import path from "path";
import { ProjectReport, mockProjects } from "./mockData";

const DB_FILE_PATH = path.join(process.cwd(), "src/lib/reports_db.json");

// Helper to ensure database file exists
function ensureDbExists() {
  if (!fs.existsSync(DB_FILE_PATH)) {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({}, null, 2), "utf-8");
  }
}

export function getAllReports(): Record<string, ProjectReport> {
  try {
    ensureDbExists();
    const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const fileReports = JSON.parse(data);
    // Combine built-in mock projects with dynamically saved reports
    return { ...mockProjects, ...fileReports };
  } catch (error) {
    console.error("Error reading reports db file:", error);
    return mockProjects;
  }
}

export function getReportById(id: string): ProjectReport | null {
  const reports = getAllReports();
  const cleanId = id.toLowerCase().replace("www.", "");
  return reports[cleanId] || null;
}

export function saveReport(report: ProjectReport): void {
  try {
    ensureDbExists();
    const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
    const fileReports = JSON.parse(data);
    
    const cleanId = report.id.toLowerCase().replace("www.", "");
    fileReports[cleanId] = report;

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(fileReports, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving report to db file:", error);
  }
}
