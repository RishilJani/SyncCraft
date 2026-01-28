"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Calendar,
    Briefcase,
    Trophy,
    Edit,
    Loader2,
    LogOut,
} from "lucide-react";
import { OrbitalLoader } from "./ui/orbital-loader";
import { allTasks } from "@/app/actions/tasks/task";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { logout } from "@/app/actions/users/Users";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { role_enum } from "@/app/generated/prisma/enums";
import { Task } from "@/app/(types)/myTypes";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: role_enum;
    createdAt: string;
    assignedTask?: Task[];
    points: number;
}

// Mock data fetching function
const fetchUserData = async (id: string | number): Promise<UserProfile> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const assignedTasks = allTasks;
    // Mock data based on ID for demonstration
    return {
        id: String(id),
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        role: role_enum.admin,
        createdAt: "2023-01-15",
        assignedTask: assignedTasks,
        points: 1250,
    };
};

export default function UserProfilePage({ id, viewerRole }: { id: string | number; viewerRole?: role_enum; }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        redirect("/login",RedirectType.replace);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchUserData(id);
                setUser(data);
            } catch (error) {
                console.error("Failed to load user data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full ">
                <OrbitalLoader message="Please wait..." className="size-20" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-full w-full items-center justify-center p-10 text-muted-foreground">
                User not found.
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl py-10">
            <Card className="w-full shadow-lg">
                <CardHeader className="relative pb-0">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col items-center gap-4 md:flex-row">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary ring-4 ring-background">
                                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <div className="text-center md:text-left">
                                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                                <CardDescription className="text-md flex items-center justify-center gap-2 md:justify-start">
                                    <Mail className="h-4 w-4" /> {user.email}
                                </CardDescription>
                                <div className="mt-2 flex justify-center gap-2 md:justify-start">
                                    <Badge
                                        variant={
                                            user.role === role_enum.admin
                                                ? "destructive"
                                                : user.role === "manager"
                                                    ? "default"
                                                    : "secondary"
                                        } className="capitalize" >
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            {viewerRole === role_enum.admin && (
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            )}
                            <MyDialog />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mt-6 grid gap-6">
                    <Separator />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-lg border p-4">
                            <div className="rounded-md bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Joined
                                </p>
                                <p className="font-medium">
                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border p-4">
                            <div className="rounded-md bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Gained Points
                                </p>
                                <p className="font-medium">{user.points} pts</p>
                            </div>
                        </div>

                        {user.role == role_enum.member &&
                            <>
                                <div className="text-md flex items-center justify-center gap-2 md:justify-start mx-2">Assigned Tasks</div>
                                {user.assignedTask!.map((task) => {
                                    return (
                                        <div className="col-span-1 flex items-start gap-3 rounded-lg border p-4 md:col-span-2">
                                            <div className="rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <div className="w-full flex items-start ">
                                                <p className="font-medium">{task.title}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        }
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 text-center text-xs text-muted-foreground">
                    Profile ID: {user.id}
                </CardFooter>
            </Card>
        </div>
    );
    function MyDialog() {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                        <LogOut className="h-4 w-4" />
                        {/* Logout */}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to logout?</DialogTitle>
                        <DialogDescription>
                            You will be signed out of your account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild className="mr-2">
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleLogout} className="ml-2">
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>);
    }
}