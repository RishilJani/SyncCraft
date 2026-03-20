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
import { role_enum } from "@/app/generated/prisma/enums";
import EditProjectForm from "../../../components/dialogs/editProjectDialog";
import { Project, Status } from "@/app/(types)/myTypes";
import { useMyContext } from "@/app/(utils)/myContext";
import { formateDate } from "@/app/(utils)/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
    const myContext = useMyContext();
    const { user: currentUser, loading: globalLoading, projects, setSpecificProject } = myContext;
    const router = useRouter();
    const [projectId, setProjectId] = useState<number | null>(null);

    useEffect(() => {
        params.then((val) => {
            var temp = Number(val.id);
            if (!isNaN(temp) && temp !== -1) {
                setProjectId(temp);
            }
        });
    }, [params]);

    const project = projectId !== null ? projects.find(p => p.projectId === projectId) : undefined;

    const handleBack = () => { router.back(); };

    const handleDelete = async (id: number) => {
        try {
            myContext.setLoading(true);
            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.error) {
                console.error("Error deleting project:", data.message);
                alert("Message = " + data.message);
                return;
            }
            else {
                myContext.setProjects(myContext.projects.filter((p) => p.projectId !== id));
                router.replace("/admin/projects");
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        } finally {
            myContext.setLoading(false);
        }
    };

    if (globalLoading || projectId === null) {
        return null; // Global Loader is already shown
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
                                <h1 className="text-3xl font-bold">{project.projectName}</h1>
                                <StatusBadge status={project.status ?? Status.Todo} className="text-md" />
                            </div>
                        </div>
                        {currentUser?.role == role_enum.admin &&
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
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm" className="gap-2" >
                                                <Trash2 className="h-5 w-5" />
                                                Delete Project
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="text-center">
                                            <AlertDialogHeader >
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the
                                                    project "{project.projectName}" and all its tasks, comments, and history.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(project.projectId!)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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


                        <div className="flex-1 w-full mx-auto">
                            {
                                project.tasks != undefined
                                    ? <MyKanbanBoard role={currentUser?.role == role_enum.admin || currentUser?.role == role_enum.manager} projectId={project.projectId!} onAddTask={() => { setSpecificProject({ projectId: project.projectId! }); }} />
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

    return (
        <Badge variant={variants[status] || "outline"} className={colorClass + " " + className}>
            {status}
        </Badge>
    );
}




