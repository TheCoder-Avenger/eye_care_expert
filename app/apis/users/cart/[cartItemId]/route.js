// import { NextResponse } from "next/server";
// import dbConnect from "@utils/db-connect";
// import { User } from "@models";

// export async function DELETE(request, { params }) {
//   try {
//     await dbConnect();

//     const { cartItemId } = params;
//     const { searchParams } = new URL(request.url);
//     const email = searchParams.get("email");

//     if (!email || !cartItemId) {
//       return NextResponse.json(
//         { error: "Email and cart item ID are required" },
//         { status: 400 }
//       );
//     }

//     const user = await User.findOne({ email: email.toLowerCase().trim() });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const cartItemIndex = user.cart.findIndex(
//       (item) => item._id.toString() === cartItemId
//     );

//     if (cartItemIndex === -1) {
//       return NextResponse.json(
//         { error: "Cart item not found" },
//         { status: 404 }
//       );
//     }

//     user.cart.splice(cartItemIndex, 1);
//     await user.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Cart item removed successfully",
//         cart: user.cart,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Delete cart item error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
