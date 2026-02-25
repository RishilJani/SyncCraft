import { prisma } from "@/lib/prisma";
import { MyResponse, ErrorResponse } from "@/app/(utils)/utils";
import { Priority, Project, Status, Task } from "@/app/(types)/myTypes";

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
            const adminProjects = await prisma.projects.findMany({
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
            
            projects = adminProjects.map((p) => ({
                projectId: p.projectId,
                projectName: p.projectName,
                description: p.description,
                createdBy: p.createdBy,
                createdAt: p.createdAt,
                completionDate: p.completionDate,
                dueDate: p.dueDate,
                status: p.status as Status,
                tasks: p.Tasks?.map(task => ({
                    taskId: task.taskId,
                    title: task.title,
                    description: task.description ?? "",
                    assignedTo: task.assignedto,
                    dueDate: task.dueDate,
                    createdAt: task.createdAt,
                    completionDate: task.completionDate,
                    points: task.points,
                    priority: task.priority as Priority,
                    status: task.status as Status,
                })),
            }));
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
                            Tasks : true,
                        }
                    } 
                }
            });
            
            projects = userProjects.map((up) => {
                if (!up.Projects) return null;
                
                const project: Project = {
                    projectId: up.Projects.projectId,
                    projectName: up.Projects.projectName,
                    description: up.Projects.description,
                    createdBy: up.Projects.createdBy,
                    createdAt: up.Projects.createdAt,
                    completionDate: up.Projects.completionDate,
                    dueDate: up.Projects.dueDate,
                    status: up.Projects.status as Status,
                    tasks: up.Projects.Tasks?.map(task => ({
                        taskId: task.taskId,
                        title: task.title,
                        description: task.description ?? "",
                        assignedTo: task.assignedto,
                        dueDate: task.dueDate,
                        createdAt: task.createdAt,
                        completionDate: task.completionDate,
                        points: task.points,
                        priority: task.priority as Priority,
                        status: task.status as Status,
                    })),
                };
                return project;
            }).filter(p => p !== null);
        }
        return MyResponse(false, "Projects Found", projects, { status: 200 });
    } catch (err) {
        console.error('Error in GET /api/projects/user/[id]:', err);
        return ErrorResponse(err);
    }
}
