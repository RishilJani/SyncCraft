"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { useState } from 'react'
import { Status } from '@/app/(types)/myTypes';
import { useMyContext } from '@/app/(utils)/myContext';
import AddProjectDialog from '@/components/dialogs/addProjectDialog';
const filters = ["All", "Completed", "Pending", "Todo"];

function ProjectsList() {
    const userContext = useMyContext();
    const allProjects = userContext.projects;
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [open, setOpen] = useState(false);
    const [dialogKey, setDialogKey] = useState(0);
    const handleClose = () => {
        setOpen(!open);
        setDialogKey(dialogKey + 1);
    }

    if (userContext.loading) {
        return null;
    }

    const filteredProjects = allProjects.filter((project) => {
        const matchesSearch = project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDescSearch = project.description ?? "".toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All" || (project.status ?? Status.Todo).toLowerCase() === activeFilter.toLowerCase();
        return (matchesSearch || matchesDescSearch) && matchesFilter;
    });

    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                </div>
                <div className='flex justify-end'>
                    <AddProjectDialog open={open} setOpen={handleClose}>
                        <Button className="gap-2">
                            <Plus className="h-5 w-5" />
                            Add Project
                        </Button>
                    </AddProjectDialog>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
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
                        <Button key={filter} variant={activeFilter === filter ? "default" : "outline"} size="sm" onClick={() => setActiveFilter(filter)} className="rounded-full" >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>

            {
                userContext.projects.length == 0
                    ? <> Not any projects yet </>
                    :
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                        {filteredProjects.map((project) => (
                            <Link href={`/project/${project.projectId}`} key={project.projectId} className="block group">
                                <Card className="h-full transition-all hover:shadow-md border-transparent hover:border-primary/20">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {project.projectName}
                                            </CardTitle>
                                            <StatusBadge status={project.status as Status} />
                                        </div>
                                        <CardDescription className="line-clamp-2 mt-2">
                                            {project.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground">
                                            Due: {new Date(project.dueDate!).toLocaleDateString()}
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
            }
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        completed: "default",
        pending: "secondary",
        todo: "outline",
    };

    let colorClass = "";
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "completed") colorClass = "bg-green-500 hover:bg-green-600 border-transparent";
    if (normalizedStatus === "pending") colorClass = "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
    if (normalizedStatus === "todo") colorClass = "text-orange-600 border-orange-200 bg-orange-50";

    return (
        <Badge variant={variants[normalizedStatus] || "outline"} className={colorClass}>
            {status}
        </Badge>
    );
}


export default ProjectsList;
