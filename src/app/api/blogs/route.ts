import connectToDB from "@/database/config";
import { uploadImage } from "@/lib/cloudinary";
import { BlogSchema } from "@/lib/validations/blog";
import { authenticateUser } from "@/middleware/auth";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const blogs = await Blog.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching blogs" },
      { status: 500 }
    );
  }
}

// Create new blog

export async function POST(req: NextRequest) {
  try {
    const user: any = await authenticateUser(req);
    if (!user) return;

    await connectToDB();
    const body = await req.json();

    // Handle image upload if base64 string is provided
    if (body.image?.base64) {
      const uploadResult = await uploadImage(body.image.base64);
      body.image = {
        url: uploadResult.url,
        alt: body.image.alt || "",
      };
    }

    const result = BlogSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const blog = await Blog.create({
      ...result.data,
      author: user.userId,
    });

    const populatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "name email"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog: populatedBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, message: "Error creating blog" },
      { status: 500 }
    );
  }
}
