import { NextResponse } from "next/server";
import dbConnect from "@utils/db-connect";
import { User } from "@models";

export async function POST(request) {
  try {
    await dbConnect();

    const {
      email,
      product_id,
      lens_type,
      lens_option,
      quantity,
      prescription_file_url,
      free_product_id,
    } = await request.json();

    if (!email || !product_id || !lens_type || !lens_option || !quantity) {
      return NextResponse.json(
        {
          error:
            "Email, product_id, lens_type, lens_option, and quantity are required",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingCartItemIndex = user.cart.findIndex(
      (item) =>
        item.product_id.toString() === product_id &&
        item.lens_type === lens_type &&
        item.lens_option === lens_option
    );

    if (existingCartItemIndex !== -1) {
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      const newCartItem = {
        product_id,
        lens_type,
        lens_option,
        quantity,
        prescription_file_url: prescription_file_url || null,
        free_product_id: free_product_id || null,
      };

      user.cart.push(newCartItem);
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product added to cart successfully",
        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .populate("cart.product_id")
      .populate("cart.free_product_id");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        cart: user.cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
