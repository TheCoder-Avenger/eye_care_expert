import { NextResponse } from "next/server";
import dbConnect from "@utils/db-connect";
import { Product } from "@models";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const color = searchParams.get("color");
    const shape = searchParams.get("shape");
    const frame_type = searchParams.get("frame_type");
    const material = searchParams.get("material");
    const minPrice = parseFloat(searchParams.get("minPrice"));
    const maxPrice = parseFloat(searchParams.get("maxPrice"));

    // Build query object
    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (color) query.color = { $regex: color, $options: "i" };
    if (shape) query.shape = { $regex: shape, $options: "i" };
    if (frame_type) query.frame_type = { $regex: frame_type, $options: "i" };
    if (material) query.material = { $regex: material, $options: "i" };

    // Price range filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await Product.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const productData = await request.json();

    const {
      name,
      description,
      images,
      price,
      size,
      material,
      color,
      shape,
      frame_type,
      available_lens_types,
      buy_1_get_1_available,
    } = productData;

    // Validation
    if (
      !name ||
      !description ||
      !images ||
      !price ||
      !size ||
      !material ||
      !color ||
      !shape ||
      !frame_type
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "All required fields must be provided",
        },
        { status: 400 }
      );
    }

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      images,
      price,
      size: size.trim(),
      material: material.trim(),
      color: color.trim(),
      shape: shape.trim(),
      frame_type: frame_type.trim(),
      available_lens_types: available_lens_types || [],
      buy_1_get_1_available: buy_1_get_1_available || false,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
      },
      { status: 500 }
    );
  }
}
