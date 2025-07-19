// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import dbConnect from "@utils/db-connect";
// import { User } from "@models";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase().trim(),
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     const { password: _, ...userResponse } = user.toObject();

//     return NextResponse.json(
//       {
//         message: "Login successful",
//         user: userResponse,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
