import { putUserCookie } from "@/app/actions/users/Users";
import { ErrorResponse, MyResponse } from "@/app/utils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("Body = ", body);
        const user = await prisma.users.findFirst({
            where: {
                userName: body.userName
            }
        });

        if (!user) {
            return MyResponse(true, "User not found" , null, {status : 404});
        }
        // const isMatch = await bcrypt.compare(body.password, user.passwordHash);
        const isMatch = body.password == user.passwordHash;
        if (!isMatch) {
            console.log("Password not matched");
            return MyResponse(true, "Credentials not matched", null, {status : 401});
        }
        console.log("Putting Cookies");
        await putUserCookie(user);
    
        return MyResponse(false, "User Found", user , {status : 200});

    } catch (err) {
        console.log('Some Error Occured at login/POST');
        console.log(err)
        return ErrorResponse(err);
    }
}
