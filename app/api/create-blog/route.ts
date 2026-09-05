import { NextResponse } from "next/server";

export async function POST() {
  console.log("Route handler");
  return NextResponse.json({ success: true });
}
