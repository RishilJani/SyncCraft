"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Filter, Plus } from "lucide-react";

// Mock Data
const allProjects = [
    { id: 1, title: "Website Redesign", description: "Revamped the corporate website with a fresh look.", status: "Completed", dueDate: "2024-03-01" },
    { id: 2, title: "Mobile App Launch", description: "Released the MVP for both iOS and Android.", status: "Completed", dueDate: "2024-04-15" },
    { id: 3, title: "Database Migration", description: "Transferred legacy data to the new cloud cluster.", status: "Completed", dueDate: "2024-03-10" },
    { id: 6, title: "AI Integration", description: "Implementing predictive models for user behavior.", status: "Pending", dueDate: "2024-08-01" },
    { id: 7, title: "User Dashboard", description: "Building a customizable analytics view.", status: "Pending", dueDate: "2024-07-20" },
    { id: 8, title: "Payment Gateway", description: "Adding support for international currencies.", status: "Pending", dueDate: "2024-06-30" },
    { id: 11, title: "Dark Mode Support", description: "Adding a system-wide theme toggle.", status: "Todo", dueDate: "2024-08-01" },
    { id: 12, title: "Localization", description: "Translating the platform into Spanish and French.", status: "Todo", dueDate: "2024-09-15" },
    { id: 13, title: "Performance Optimization", description: "Reducing bundle size and improving core web vitals.", status: "Todo", dueDate: "2024-09-01" },
];

const filters = ["All", "Completed", "Pending", "Todo"];

export default function ProjectsList() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredProjects = allProjects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" || project.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage and track all ongoing projects.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="pl-8 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    {filters.map((filter) => (
                        <Button
                            key={filter}
                            variant={activeFilter === filter ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveFilter(filter)}
                            className="rounded-full"
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                    <Link href={`/admin/projects/${project.id}`} key={project.id} className="block group">
                        <Card className="h-full transition-all hover:shadow-md border-transparent hover:border-primary/20">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <StatusBadge status={project.status} />
                                </div>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    Due: {project.dueDate}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {filteredProjects.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No projects found matching your criteria.
                    </div>
                )}
            </div>

        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        Completed: "default",
        Pending: "secondary",
        Todo: "outline",
    };

    let colorClass = "";
    if (status === "Completed") colorClass = "bg-green-500 hover:bg-green-600 border-transparent";
    if (status === "Pending") colorClass = "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
    if (status === "Todo") colorClass = "text-orange-600 border-orange-200 bg-orange-50";

    return (
        <Badge variant={variants[status] || "outline"} className={colorClass}>
            {status}
        </Badge>
    );
}
