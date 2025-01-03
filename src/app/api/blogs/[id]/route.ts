import connectToDB from "@/database/config";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { BlogSchema } from "@/lib/validations/blog";
import { authenticateUser } from "@/middleware/auth";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectToDB();
    const blog = await Blog.findById(params.id).populate(
      "author",
      "name email"
    );

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching blog" },
      { status: 500 }
    );
  }
}

// Update blog

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user: any = await authenticateUser(req);
    if (!user) return;

    await connectToDB();
    const body = await req.json();


    // Handle image upload if new base64 string is provided
    if (body.image?.base64) {
      const uploadResult = await uploadImage(body.image.base64);
      body.image = {
        url: uploadResult.url,
        alt: body.image.alt || '',
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

    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (blog.author.toString() !== user.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(params.id, result.data, {
      new: true,
    }).populate("author", "name email");


    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });


  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, message: "Error updating blog" },
      { status: 500 }
    );
  }
}

// Delete blog
export async function DELETE(req:NextRequest, {params}: Params){
    try {
        const user:any = authenticateUser(req)
        if(!user) return

        await connectToDB()

        const blog = await Blog.findById(params.id)
        if(!blog){
            return NextResponse.json(
                {success:false, message: "Blog not found"},
                {status: 404}
            )
        }

        // Check if user is the author
        if(blog.author.toString() !== user.userId){
            return NextResponse.json(
                {success:false, message: "Unauthorized"},
                {status: 403}
            )
        }

        // Delete the blog's image from Cloudinary if it exists
        if(blog.image?.url){
          const publicId = blog.image.url.split('/').pop()?.split('.')[0]
          if(publicId){
            await deleteImage(publicId)
          }
        }

        await Blog.findByIdAndDelete(params.id)

        return NextResponse.json({
            success:true,
            message: "Blog deleted successfully",
        })
        
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
          { success: false, message: "Error deleting blog" },
          { status: 500 }
        );
    }
}
