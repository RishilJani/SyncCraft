"use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Flag, CheckCircle2, NotepadText, Edit, Trash2 } from "lucide-react";
import MyKanbanBoard from "@/components/custom_kanban";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/custom_loader";
import { role_enum } from "@/app/generated/prisma/enums";
import EditProjectForm from "../../admin/editProject/[id]/edit-project-form";
import { Project, Status } from "@/app/(types)/myTypes";
import { getUser } from "@/app/actions/users/Users";
import { formateDate } from "@/app/utils";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project>();
    const [refreshKey, setRefreshKey] = useState(0);
    const [role, setRole] = useState<role_enum>();
    useEffect(() => {
        setLoading(true);
        params.then((val) => {
            var temp = Number(val.id);
            if (temp != -1) {
                getUser().then((val) => {
                    setRole(val?.role);
                });
                getProjectById(temp).then(
                    (res) => {
                        if (res == null) {
                            setLoading(false);
                            setProject(undefined);
                        }
                        setProject(res);
                        setLoading(false);
                    }
                );
            }
        })
        console.log("Main UseEffect");
        
    }, [refreshKey]);

    const handleBack = () => { router.back(); };

    if (loading) {
        return (<CustomLoader />);
    }

    if (project == undefined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                <Button asChild onClick={handleBack}>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
                <div className="w-full space-y-8 max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin/projects">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{project.projectName}</h1>
                                <StatusBadge status={project.status ?? Status.Todo} className="text-md" />
                            </div>
                        </div>
                        {role == role_enum.admin &&
                            <div className="flex justify-end">
                                <div className="flex items-end gap-2 mx-2">
                                    <EditProjectForm data={project} >
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Edit className="h-5 w-5" />
                                            Edit Project
                                        </Button>
                                    </EditProjectForm>
                                </div>
                                <div className="flex items-end gap-2 mx-2">
                                    <Button variant="destructive" size="sm" className="gap-2" >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="grid gap-6">
                        {/* Main Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <NotepadText className="h-4 w-4" />
                                        <span className="text-sm font-medium uppercase">Description</span>
                                    </div>
                                    <p className="pl-6 font-medium">{project.description}</p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm font-medium">Created At</span>
                                        </div>
                                        <p className="pl-6 font-medium">{formateDate(project.createdAt)}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Flag className="h-4 w-4" />
                                            <span className="text-sm font-medium">Due Date</span>
                                        </div>
                                        <p className="pl-6 font-medium">{formateDate(project.dueDate)}</p>
                                    </div>

                                    {project.completionDate && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span className="text-sm font-medium">Completed At</span>
                                            </div>
                                            <p className="pl-6 font-medium text-green-600">{formateDate(project.completionDate)}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>


                        {/* Task List Section - Kanban */}
                        <div className="flex-1 w-full mx-auto">
                            {
                                project.tasks != undefined 
                                ?  <MyKanbanBoard role={role == role_enum.admin || role == role_enum.manager} project={project}  onAddTask={ ()=>{ console.log("On Add Task"); setRefreshKey(refreshKey+1); }}/> 
                                : <div> Tasks Not Found</div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

function StatusBadge({ status, className }: { status: Status; className?: string }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        Completed: "default",
        Running: "secondary",
        Upcoming: "outline",
        "Done": "default",
        "In Progress": "secondary",
        "Todo": "outline"
    };

    let colorClass = "";
    // Project Status Colors
    if (status == Status.Completed) colorClass = "bg-green-500 hover:bg-green-600 border-transparent";
    if (status == Status.Pending) colorClass = "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
    if (status == Status.Todo) colorClass = "text-orange-600 border-orange-200 bg-orange-50";

    // Task Status Colors
    // if (status === "Done") colorClass = "bg-green-100 text-green-700 hover:bg-green-200 border-transparent";
    // if (status === "In Progress") colorClass = "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent";
    // if (status === "Todo") colorClass = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent";

    return (
        <Badge variant={variants[status] || "outline"} className={colorClass + " " + className}>
            {status}
        </Badge>
    );
}

async function getProjectById(id: number) {
    const project = await (await fetch(`/api/projects/${id}`)).json();
    if (project.error) {
        return null;
    }
    return project.data;
}

async function deleteProject(id: number) {
    console.log("Project Deleting");
    const project = await (await fetch(`/api/projects/${id}`, {
        method: "DELETE",
    })).json();
    if (project.error) {
        return null;
    }
    console.log("Project Deleted");
    // revalidatePath("/admin/projects");
    redirect("/admin/projects");
}
