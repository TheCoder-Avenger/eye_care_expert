import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@utils/db-connect";
import { User } from "@models";

export async function POST(request) {
  try {
    await dbConnect();

    const userData = await request.json();

    const {
      first_name,
      last_name,
      email,
      mobile_number,
      alternate_mobile_number,
      password,
    } = userData;

    if (!first_name || !last_name || !email || !mobile_number || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile_number }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or mobile number already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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

    const savedUser = await newUser.save();

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
