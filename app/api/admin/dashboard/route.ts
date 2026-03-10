import { ErrorResponse, MyResponse } from "@/app/(utils)/utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const totalProjects = await prisma.projects.count();

        const activeProjects = await prisma.projects.count({
            where: {
                status: {
                    in: ["todo", "pending"]
                }
            }
        });

        const completedProjects = await prisma.projects.count({
            where: {
                status: "completed"
            }
        });

        const totalEmployees = await prisma.users.count();

        // Get counts grouped by status for charts
        const projectStatusDistributionData = await prisma.projects.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        const projectStatusDistribution = projectStatusDistributionData.map(item => ({
            name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
            value: item._count.status
        }));

        // Similarly, counting priorities for another chart
        const taskPriorityDistributionData = await prisma.tasks.groupBy({
            by: ['priority'],
            _count: {
                priority: true,
            },
        });

        const taskPriorityDistribution = taskPriorityDistributionData.map(item => ({
            name: item.priority,
            value: item._count.priority
        }));


        const dashboardData = {
            totalProjects,
            activeProjects,
            completedProjects,
            totalEmployees,
            projectStatusDistribution,
            taskPriorityDistribution
        };

        console.log("Dashboard Data = ", dashboardData);

        return MyResponse(false, "Dashboard Data fetched", dashboardData, { status: 200 });

    } catch (err) {
        console.log('Error at api/admin/dashboard/GET');
        console.log(err);
        return ErrorResponse(err);
    }
}
