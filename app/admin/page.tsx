"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, User, Kanban, CheckCircle, Activity } from "lucide-react";
import { useMyContext } from "../(utils)/myContext";
import { useEffect, useState } from "react";
import DashboardCharts from "./DashboardCharts";


interface DashboardData {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalEmployees: number;
    projectStatusDistribution: { name: string; value: number }[];
    taskPriorityDistribution: { name: string; value: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
    const userData = useMyContext();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userData?.user?.userId) return;
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/dashboard?org=${userData.user.organization}`, { cache: 'no-store' });
                const json = await res.json();
                if (json && !json.error) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userData?.user?.userId]);

    if (loading) {
        return (
            <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow h-32 animate-pulse" />
                    ))}
                </div>
            </>
        );
    }
    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <div className="flex flex-wrap gap-2">
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href="/admin/employees">
                            <Users className="h-5 w-5" />
                            <span className="hidden sm:inline">View All Employees</span>
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href="/admin/projects">
                            <Kanban className='h-5 w-5' />
                            <span className="hidden sm:inline">View All Projects</span>
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href={`/admin/${userData?.user?.userId}`}>
                            <User className="h-6 w-6" />
                        </Link>
                    </Button>
                </div>
            </div>

            {data ? (
                <>
                    {/* Stat Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="group rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-600/50 cursor-default">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Total Projects</h3>
                                <Kanban className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold">{data.totalProjects}</div>
                        </div>
                        <div className="group rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-violet-600/50 cursor-default">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Active Projects</h3>
                                <Activity className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-violet-600" />
                            </div>
                            <div className="text-2xl font-bold">{data.activeProjects}</div>
                        </div>
                        <div className="group rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-emerald-600/50 cursor-default">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Completed Projects</h3>
                                <CheckCircle className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-emerald-600" />
                            </div>
                            <div className="text-2xl font-bold">{data.completedProjects}</div>
                        </div>
                        <div className="group rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:border-amber-600/50 cursor-default">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Total Employees</h3>
                                <Users className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-amber-600" />
                            </div>
                            <div className="text-2xl font-bold">{data.totalEmployees}</div>
                        </div>
                    </div>

                    {/* Charts */}
                    <DashboardCharts data={data} COLORS={COLORS} />
                </>
            ) : null}
        </div>
    );
}
/*
<div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-6">
                        <div className="min-w-0 min-h-0 rounded-xl border bg-card text-card-foreground shadow col-span-1 p-6">
                            <h3 className="font-semibold leading-none tracking-tight mb-6">Project Status Distribution</h3>
                            <div className="h-[300px] w-full">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%" >
                                        <BarChart
                                            data={data.projectStatusDistribution}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }} >
                                            <CartesianGrid strokeDasharray="4 4" opacity={0.75} />
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                                            <Legend />
                                            <Bar dataKey="value" name="Projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        <div className="min-w-0 min-h-0 rounded-xl border bg-card text-card-foreground shadow col-span-1 p-6">
                            <h3 className="font-semibold leading-none tracking-tight mb-6">Task Priority Distribution</h3>
                            <div className="h-[300px] w-full">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%" >
                                        <PieChart>
                                            <Pie
                                                data={data.taskPriorityDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {data.taskPriorityDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

*/