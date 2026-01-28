"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Flag, CheckCircle2, NotepadText, Edit } from "lucide-react";
import MyKanbanBoard from "@/components/custom_kanban";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/custom_loader";
import { role_enum } from "@/app/generated/prisma/enums";
import EditProjectForm from "../../editProject/[id]/edit-project-form";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const role = role_enum.admin;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(Object);
    const [id, setId] = useState(-1);

    useEffect(() => {
        setLoading(true);
        params.then((val) => {
            var temp = Number(val.id);
            setId(temp);
            if (temp != -1) {
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
    }, []);
    const handleBack = () => { router.back(); };

    if (loading) {
        return (
            <>
                <CustomLoader />
            </>
        );
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
                        <StatusBadge status={project.status} className="text-md" />
                    </div>
                </div>
                {role == role_enum.admin &&
                    <div className="flex justify-end">
                        <div className="flex items-end gap-2">
                            {/* <EditProjectForm projectId={project.projectId} projectName={project.projectName} description={project.description} dueDate={project.dueDate} managerId={project.managerId} membersList={project.membersList} managers={project.managers} members={project.members}> */}
                            <Button variant="outline" size="sm" className="gap-2">
                                <Edit className="h-5 w-5" />
                                Edit Project
                            </Button>
                            {/* </EditProjectForm> */}
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
                                <p className="pl-6 font-medium">{project.createdAt}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Flag className="h-4 w-4" />
                                    <span className="text-sm font-medium">Due Date</span>
                                </div>
                                <p className="pl-6 font-medium">{project.dueDate}</p>
                            </div>

                            {project.completionDate && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span className="text-sm font-medium">Completed At</span>
                                    </div>
                                    <p className="pl-6 font-medium text-green-600">{project.completionDate}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>


                {/* Task List Section - Kanban */}
                <div className="flex-1 w-full mx-auto">
                    <MyKanbanBoard role={role == role_enum.admin || role == role_enum.manager} projectId={Number(id)} />
                </div>

            </div>
        </>
    );
}

function StatusBadge({ status, className }: { status: string; className?: string }) {
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
    if (status === "Completed") colorClass = "bg-green-500 hover:bg-green-600 border-transparent";
    if (status === "Running") colorClass = "bg-blue-500 hover:bg-blue-600 text-white border-transparent";
    if (status === "Upcoming") colorClass = "text-orange-600 border-orange-200 bg-orange-50";

    // Task Status Colors
    if (status === "Done") colorClass = "bg-green-100 text-green-700 hover:bg-green-200 border-transparent";
    if (status === "In Progress") colorClass = "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent";
    if (status === "Todo") colorClass = "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent";

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

