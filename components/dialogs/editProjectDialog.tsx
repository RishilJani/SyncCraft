"use client";

import { myHeaders } from "@/app/(utils)/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Project, User } from "@/app/(types)/myTypes";
import { getAllUsers } from "@/app/actions/users/Users";
import { role_enum } from "@/app/generated/prisma/enums";
import CustomLoader from "@/components/custom_loader";

interface EditProjectFormProps {
    children: React.ReactNode;
    data: Project;
}

export default function EditProjectForm({
    children,
    data,
}: EditProjectFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(data.projectName);
    const [description, setDescription] = useState(data.description || "");
    const [dueDate, setDueDate] = useState<Date | undefined>(data.dueDate ? new Date(data.dueDate) : undefined);
    const [manager, setManager] = useState(data.manager?.userId?.toString() || "");
    var temp = data.members!.map((val) => { return Number(val.userId) });
    const [selectedMembers, setSelectedMembers] = useState<number[]>(temp || []);
    const [open, setOpen] = useState(false);
    const [managers, setManagers] = useState<any>(null);
    const [members, setMembers] = useState<any>(null);

    useEffect(() => {
        getAllUsers().then((users) => {
            var mana = users.filter((user) => user.role === role_enum.manager);
            var mem = users.filter((user) => user.role === role_enum.member);
            setManagers(mana);
            setMembers(mem);
        });

    }, []);

    if (!open) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent>
                    <CustomLoader />
                </DialogContent>
            </Dialog>
        );
    }

    if (managers == null || members == null) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent>
                    <CustomLoader />
                </DialogContent>
            </Dialog>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await (await fetch(`/api/projects/${data.projectId}`, {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify({
                    projectName: title,
                    description: description,
                    dueDate: dueDate,
                    managerId: Number(manager),
                    memberIds: selectedMembers
                }),
            })).json();

            if (!res.error) {
                setOpen(false);
                router.push("/project/"+data.projectId);
                router.refresh();
            } else {
                alert("Error: " + res.message);
            }
        } catch (error) {
            console.error("Update failed:", error);
            alert("Something went wrong");
        }
    };

    const addMember = (memberId: string) => {
        const mem = Number(memberId);
        if (!selectedMembers.includes(mem)) {
            setSelectedMembers([...selectedMembers, mem]);
        }
    };

    const removeMember = (memberId: number) => {
        setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    };

    const handleOpenChange = (val: boolean) => {
        setOpen(val);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 p-0 overflow-hidden" >
                <div className="bg-card">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-semibold text-center mt-2">Edit Project</DialogTitle>
                        <p className="text-sm text-center text-muted-foreground mt-1">Update project details below</p>
                    </DialogHeader>

                    <hr className="mx-6 border-dashed" />

                    <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">Project Name</Label>
                            <Input id="title" value={title} readOnly onChange={(e) => setTitle(e.target.value)} required className="bg-muted" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-24" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Due Date */}
                            <div className="space-y-2 flex flex-col">
                                <Label className="text-sm font-medium">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")} >
                                            <CalendarIcon className="mr-2 h-4 w-4" /> {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {/* Project Manager */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Project Manager</Label>
                                <Select onValueChange={setManager} value={manager} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((m: any) => (
                                            <SelectItem key={m.userId} value={m.userId?.toString() || ""}>{m.userName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Team Members</Label>
                            <Select onValueChange={addMember}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add Team Member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map((m: any) => (
                                        <SelectItem key={m.userId} value={m.userId?.toString() || ""} disabled={selectedMembers.includes(Number(m.userId))}>{m.userName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedMembers.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedMembers.map(memberId => {
                                        const member = members.find((m: any) => Number(m.userId) === memberId);
                                        return (
                                            <div key={memberId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-[14px]">
                                                <span>{member?.userName}</span>
                                                <button type="button" onClick={() => removeMember(memberId)} className="text-muted-foreground hover:text-foreground">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button type="submit" className="w-full text-lg">Update Project</Button>
                        </div>
                    </form>

                    <div className="bg-muted border-t p-3">
                        <p className="text-center text-sm">
                            <Button variant="link" onClick={() => handleOpenChange(false)} className="px-2 text-[15px] text-muted-foreground">
                                Cancel
                            </Button>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
