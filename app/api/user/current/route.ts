import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { getUserCookie } from "@/app/actions/users/Users";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserCookie();
        if (!user) {
            return NextResponse.json({ error: true, message: "User not found" }, { status: 404 });
        }
        return MyResponse(false, "User Found Successfully", user, { status: 200 });
    } catch (error) {
        console.error("Error in GET /api/user/current:", error);
        return ErrorResponse(error);
    }
}
