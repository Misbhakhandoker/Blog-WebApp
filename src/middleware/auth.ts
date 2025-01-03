import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateUser(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    console.log("AuthenticateUser Error : ", error);

    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
