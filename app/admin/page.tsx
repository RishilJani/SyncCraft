"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, User, Kanban, CheckCircle, Activity } from "lucide-react";
import { useMyContext } from "../(utils)/myContext";
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

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
            try {
                const res = await fetch('/api/admin/dashboard');
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
    }, []);

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
                    <Button asChild variant="outline" className="gap-2">
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

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow h-32 animate-pulse" />
                    ))}
                </div>
            ) : data ? (
                <>
                    {/* Stat Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Total Projects</h3>
                                <Kanban className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold">{data.totalProjects}</div>
                        </div>
                        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Active Projects</h3>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold">{data.activeProjects}</div>
                        </div>
                        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Completed Projects</h3>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold">{data.completedProjects}</div>
                        </div>
                        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between space-x-2">
                                <h3 className="tracking-tight text-sm font-medium">Total Employees</h3>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold">{data.totalEmployees}</div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-6">
                        {/* Status Distribution - Bar Chart */}
                        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-1 p-6">
                            <h3 className="font-semibold leading-none tracking-tight mb-6">Project Status Distribution</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
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
                            </div>
                        </div>

                        {/* Task Priority Distribution - Pie Chart */}
                        <div className="rounded-xl border bg-card text-card-foreground shadow col-span-1 p-6">
                            <h3 className="font-semibold leading-none tracking-tight mb-6">Task Priority Distribution</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
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
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
