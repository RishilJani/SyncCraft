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
    Mail,
    Calendar,
    Briefcase,
    Trophy,
    LogOut,
    ArrowLeft,
    Pencil,
} from "lucide-react";
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
import { useRouter } from "next/navigation";
import { role_enum } from "@/app/generated/prisma/enums";
import { User } from "@/app/(types)/myTypes";
import { useMyContext } from "@/app/(utils)/myContext";
import EditUserDialog from "./dialogs/editUserDialog";
import { logout } from "@/app/actions/users/userFunctions";

// Data fetching function for a specific user ID
const fetchUserData = async (id: string | number) => {
    try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();

        if (data.error) {
            console.error("Error fetching user:", data.message);
            return null;
        }
        return data.data;
    } catch (error) {
        console.error("fetchUserData failed:", error);
        return null;
    }
};

export default function UserProfilePage({ id, viewerRole }: { id: string | number; viewerRole?: role_enum; }) {
    const { user: currentUser, loading: globalLoading, refreshData } = useMyContext();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [localLoading, setLocalLoading] = useState(true);
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        await refreshData();
        router.replace("/login");
    };

    const loadData = async () => {
        setLocalLoading(true);
        try {
            const data = await fetchUserData(id);
            setProfileUser(data);
        } catch (error) {
            console.error("Failed to load user data", error);
        } finally {
            setLocalLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleBack = () => {
        router.back();
    };

    if (globalLoading || localLoading) {
        return null; // Global loader handles initial state
    }

    if (!profileUser) {
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
                    <div className="flex justify-between items-center mb-6">
                        <Button variant="outline" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex gap-2">
                            {viewerRole == role_enum.admin && (
                                <EditUserDialog user={profileUser} onSuccess={() => { refreshData(); loadData(); }} >
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Pencil className="h-5 w-5" />
                                        Edit
                                    </Button>
                                </EditUserDialog>
                            )}
                            <MyDialog />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col items-center gap-4 md:flex-row">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary ring-4 ring-background">
                                {profileUser.userName!.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <div className="text-center md:text-left">
                                <CardTitle className="text-2xl font-bold">{profileUser.userName}</CardTitle>
                                <CardDescription className="text-md flex items-center justify-center gap-2 md:justify-start">
                                    <Mail className="h-4 w-4" /> {profileUser.email}
                                </CardDescription>
                                <div className="mt-2 flex justify-center gap-2 md:justify-start">
                                    <Badge
                                        variant={
                                            profileUser.role === role_enum.admin
                                                ? "destructive"
                                                : profileUser.role === "manager"
                                                    ? "default"
                                                    : "secondary"
                                        } className="capitalize" >
                                        {profileUser.role}
                                    </Badge>
                                </div>
                            </div>
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
                                    {new Date(profileUser.createdAt!).toLocaleDateString(undefined, {
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
                                {/* <p className="font-medium">{user.points} pts</p> */}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 text-center text-xs text-muted-foreground">
                    Profile ID: {profileUser.userId}
                </CardFooter>
            </Card>
        </div>
    );

    function MyDialog() {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {currentUser?.userId == Number(id) &&
                        <Button variant="destructive" size="sm" className="gap-2">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    }
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