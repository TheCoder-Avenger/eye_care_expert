import { NextResponse } from "next/server";
import dbConnect from "@utils/db-connect";
import { User } from "@models";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { productId } = params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || !productId) {
      return NextResponse.json(
        { error: "Email and product ID are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wishlistItemIndex = user.wishlist.findIndex(
      (item) => item.toString() === productId
    );

    if (wishlistItemIndex === -1) {
      return NextResponse.json(
        { error: "Product not found in wishlist" },
        { status: 404 }
      );
    }

    user.wishlist.splice(wishlistItemIndex, 1);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product removed from wishlist successfully",
        wishlist: user.wishlist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete wishlist item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
