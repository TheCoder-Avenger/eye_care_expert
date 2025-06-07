import { NextResponse } from "next/server";
import dbConnect from "../../../helpers/db-connect";

export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json(
      {
        status: "OK",
        message: "Database connection successful",
        database: "ece",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "ERROR",
        message: "Database connection failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
