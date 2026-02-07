import { prisma } from "@/lib/prisma";
import { MyResponse, ErrorResponse } from "@/app/(utils)/utils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);
        
        if (isNaN(userId)) {
            return MyResponse(true, "Invalid user ID", null, { status: 400 });
        }

        const userProjects = await prisma.user_projects.findMany({
            where: { userid: userId },
            include: { 
                Projects: {
                    include: {
                        Users: {
                            select: {
                                userId: true,
                                userName: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                } 
            }
        });

        const projects = userProjects.map(up => up.Projects).filter(p => p !== null);
        
        return MyResponse(false, "Projects Found", projects, { status: 200 });
    } catch (err) {
        console.error('Error in GET /api/projects/user/[id]:', err);
        return ErrorResponse(err);
    }
}
