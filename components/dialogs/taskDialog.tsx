"use client";

import { myHeaders } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Task, User, Priority, Status } from "@/app/(types)/myTypes";
import wait from "wait";

interface TaskDialogProps {
    children: React.ReactNode;
    projectId: number;
    members: User[];
    task?: Task;
    // setState : Dispatch<SetStateAction<boolean>>;
    onSuccess?: () => void;
}

export default function TaskDialog({
    children,
    projectId,
    members,
    task,
    // setState,
    onSuccess,
}: TaskDialogProps) {
    // const router = useRouter();
    const isUpdate = !!task;

    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? new Date(task.dueDate) : undefined);
    const [assignedTo, setAssignedTo] = useState(task?.assignedTo?.toString() || "");
    const [priority, setPriority] = useState<Priority>(task?.priority || Priority.Medium);
    const [status, setStatus] = useState<Status>(task?.status || Status.Todo);
    const [points, setPoints] = useState(task?.points?.toString() || "0");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isUpdate ? `/api/tasks/${task.taskId}` : `/api/tasks`;
            const method = isUpdate ? "PUT" : "POST";

            const res = await (await fetch(url, {
                method: method,
                headers: myHeaders,
                body: JSON.stringify({
                    title,
                    description,
                    dueDate,
                    assignedto: assignedTo ? Number(assignedTo) : null,
                    priority,
                    status,
                    points: Number(points),
                    projectId: projectId,
                }),
            })).json();
            // console.log({
            //         title,
            //         description,
            //         dueDate,
            //         assignedto: assignedTo ? Number(assignedTo) : null,
            //         priority,
            //         status,
            //         points: Number(points),
            //         projectId: projectId,
            //     });

            // await wait(3000);
            // var res = {
            //     error : false,
            //     message : "Hello World"
            // }
            if (!res.error) {
                if (onSuccess) onSuccess();
                console.log("Helloooooooooooooooooo");
                setOpen(false);
                // setState(true);
                // router.refresh();
            } else {
                alert("Error: " + res.message);
            }
        } catch (error) {
            console.error("Operation failed:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 p-0 overflow-hidden">
                <div className="bg-card">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-semibold text-center mt-2">
                            {isUpdate ? "Update Task" : "Add New Task"}
                        </DialogTitle>
                        <p className="text-sm text-center text-muted-foreground mt-1">
                            {isUpdate ? "Update task details below" : "Enter task details below"}
                        </p>
                    </DialogHeader>

                    <hr className="mx-6 border-dashed" />

                    <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">Task Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter task title" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-20" placeholder="Enter task description" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-sm font-medium">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")} >
                                            <CalendarIcon className="mr-2 h-4 w-4" /> {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" fromDate={new Date()} selected={dueDate} onSelect={setDueDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Assign To</Label>
                                <Select onValueChange={setAssignedTo} value={assignedTo}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((m) => (
                                            <SelectItem key={m.userId} value={m.userId?.toString() || ""}>{m.userName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Priority</Label>
                                <Select onValueChange={(val: Priority) => setPriority(val)} value={priority}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Priority.Low}>Low</SelectItem>
                                        <SelectItem value={Priority.Medium}>Medium</SelectItem>
                                        <SelectItem value={Priority.High}>High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Points</Label>
                                <Input type="number" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="0" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" className="w-full text-lg" disabled={loading}>
                                {loading ? "Saving..." : (isUpdate ? "Update Task" : "Add Task")}
                            </Button>
                        </div>
                    </form>

                    <div className="bg-muted border-t p-3 text-center">
                        <Button variant="link" onClick={() => setOpen(false)} className="px-2 text-[15px] text-muted-foreground">
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
