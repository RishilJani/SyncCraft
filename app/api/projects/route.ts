import { Status } from "@/app/(utils)/myTypes";
import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const organization = searchParams.get("org");
        if (organization == null) {
            return ErrorResponse("Organization Required");
        }
        const projects = await prisma.projects.findMany(
            {
                include: { Users: true },
                where: {
                    Users: {
                        organization: organization
                    }
                }
            }
        );
        return MyResponse(false, "Projects Found", projects, { status: 200 });
    } catch (err) {
        console.error('Some Error Occured at api/projets/GET', err);
        return ErrorResponse(err);
    }
}

export async function POST(request: Request) {
    const { projectName, description, createdBy, dueDate, managerId, memberIds } = await request.json();
    const createdAt = new Date();
    try {
        const project = await prisma.projects.create({
            data: {
                projectName: projectName,
                description: description,
                createdBy: createdBy,
                createdAt: createdAt,
                dueDate: dueDate,
                status: Status.Todo,
            }
        });
        const userProject = await prisma.user_projects.create({
            data: {
                userid: managerId,
                projectid: project.projectId
            }
        });

        memberIds.forEach(async (id: number) => {
            await prisma.user_projects.create({
                data: {
                    userid: id,
                    projectid: project.projectId
                }
            });
        });

        revalidatePath("/admin/projects");
        return MyResponse(false, "Project Added Successfully", project, { status: 200 });

    } catch (err) {

        console.error('Some Error Occured at api/projects/POST', err);
        return ErrorResponse(err);
    }

}