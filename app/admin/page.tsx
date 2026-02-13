"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, User, Kanban } from "lucide-react";
import {useMyContext } from "../(utils)/myContext";

export default function AdminDashboard() {
    const userData = useMyContext();

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex gap-2">
                    {/* <SelectManagerDialog user_id={7} /> */}
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href="/admin/employees">
                            <Users className="h-5 w-5" />
                            View All Employees
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/admin/projects">
                            <Kanban className='h-5 w-5' />
                            View All Projects
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="gap-2">
                        <Link href={`/admin/${userData?.user?.userId}`}>
                            <User className="h-6 w-6" />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
