import { NextRequest, NextResponse } from "next/server";
import { getReportById, getAllReports } from "@/lib/reportStore";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const report = getReportById(id);
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    return NextResponse.json({ report });
  }

  const reports = getAllReports();
  return NextResponse.json({ reports });
}
