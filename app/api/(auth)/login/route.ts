import { putUserCookie } from "@/app/actions/users/userFunctions";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const user = await prisma.users.findFirst({
            where: {
                userName: body.userName
            }
        });

        if (!user) {
            return MyResponse(true, "User not found" , null, {status : 404});
        }
        const salt = process.env.SALT ? Number.parseInt(process.env.SALT) : 10;
        const hashedPassword = bcrypt.hashSync(body.password, salt);
        console.log("hash = ", hashedPassword);
        const isMatch = await bcrypt.compare(body.password, user.passwordHash);
        if (!isMatch) {
            return MyResponse(true, "Credentials not matched", null, {status : 401});
        }
        await putUserCookie(user);
    
        return MyResponse(false, "User Found", user , {status : 200});

    } catch (err) {
        console.log('Some Error Occured at login/POST');
        console.log(err)
        return ErrorResponse(err);
    }
}
