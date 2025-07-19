// import { NextResponse } from "next/server";
// import dbConnect from "@utils/db-connect";
// import { User } from "@models";

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { email, product_id } = await request.json();

//     if (!email || !product_id) {
//       return NextResponse.json(
//         { error: "Email and product_id are required" },
//         { status: 400 }
//       );
//     }

//     const user = await User.findOne({ email: email.toLowerCase().trim() });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const existingWishlistItem = user.wishlist.find(
//       (item) => item.toString() === product_id
//     );

//     if (existingWishlistItem) {
//       return NextResponse.json(
//         { error: "Product already in wishlist" },
//         { status: 409 }
//       );
//     }

//     user.wishlist.push(product_id);
//     await user.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product added to wishlist successfully",
//         wishlist: user.wishlist,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Add to wishlist error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(request.url);
//     const email = searchParams.get("email");

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     const user = await User.findOne({
//       email: email.toLowerCase().trim(),
//     }).populate("wishlist");

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         wishlist: user.wishlist,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Get wishlist error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
