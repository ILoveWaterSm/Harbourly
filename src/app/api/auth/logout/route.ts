import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  await deleteSession();
  return NextResponse.redirect(new URL("/", process.env.APP_URL || "http://localhost:3000"), {
    status: 302,
  });
}
