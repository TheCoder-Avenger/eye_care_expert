import { NextResponse } from "next/server";
import dbConnect from "../../../../helpers/db-connect";
import { User } from "models";

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const { email } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();

    return NextResponse.json(
      {
        message: "User found",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
