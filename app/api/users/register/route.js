import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../helpers/db-connect";
import User from "../../../../models/users";

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const userData = await request.json();

    const {
      first_name,
      last_name,
      email,
      mobile_number,
      alternate_mobile_number,
      password,
    } = userData;

    // Validate required fields
    if (!first_name || !last_name || !email || !mobile_number || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile_number }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or mobile number already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.toLowerCase().trim(),
      mobile_number: mobile_number.trim(),
      alternate_mobile_number: alternate_mobile_number
        ? alternate_mobile_number.trim()
        : null,
      password: hashedPassword,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Remove password from response
    const { password: _, ...userResponse } = savedUser.toObject();

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { error: "User with this email or mobile number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
