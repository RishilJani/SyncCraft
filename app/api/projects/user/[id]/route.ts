import { prisma } from "@/lib/prisma";
import { MyResponse, ErrorResponse } from "@/app/(utils)/utils";

export async function GET( request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);
        
        if (isNaN(userId)) {
            return MyResponse(true, "Invalid user ID", null, { status: 400 });
        }
        
        const user = await prisma.users.findUnique({
            where: { userId: userId },
            select: { role: true }
        });
        
        if (!user) {
            return MyResponse(true, "User not found", null, { status: 404 });
        }
        
        let projects;
        
        if (user.role === 'admin') {
            projects = await prisma.projects.findMany({
                where: { createdBy: userId },
                include: {
                    Users: {
                        select: {
                            userId: true,
                            userName: true,
                            email: true,
                            role: true
                        }
                    },
                    Tasks: true
                }
            });
        } else {
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
                            },
                            Tasks : true
                        }
                    } 
                }
            });
            
            projects = userProjects.map(up => up.Projects).filter(p => p !== null);
        }
        return MyResponse(false, "Projects Found", projects, { status: 200 });
    } catch (err) {
        console.error('Error in GET /api/projects/user/[id]:', err);
        return ErrorResponse(err);
    }
}
