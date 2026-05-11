"use client";

import { Project, User } from "@/app/(utils)/myTypes";
import { useMyContext } from "@/app/(utils)/myContext";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { myHeaders } from "@/app/(utils)/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { role_enum } from "@/app/generated/prisma/enums";
import CustomLoader from "../custom_loader";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function AddProjectDialog({
    children,
    open,
    setOpen,
    data
}: { children: React.ReactNode, open: boolean, setOpen: Function, data: Project | undefined | null }) {

    const userContext = useMyContext();
    const isEdit = data ? true : false;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date>();
    const [manager, setManager] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [managers, setManagers] = useState<User[]>([]);
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            setLoading(true);
            if (data) {
                var temp = data.members!.map((val) => { return Number(val.userId) });
                setSelectedMembers(temp || []);
                setTitle(data.projectName);
                setDescription(data.description || "");
                setDueDate(data.dueDate ? new Date(data.dueDate) : undefined);
                setManager(data.manager?.userId?.toString() || "");
            }
            fetch(`/api/admin/employees?org=${userContext.user?.organization}`)
                .then((res) => res.json())
                .then((data) => {
                    setManagers(data.filter((user: User) => user.role === role_enum.manager));
                    setMembers(data.filter((user: User) => user.role === role_enum.member));
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch employees:", err);
                    setLoading(false);
                });
        } finally {
            setLoading(false);
        }

    }, []);
    if (loading) { return (<CustomLoader message="Just a minute" />); }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        userContext.setLoading(true);
        const adminId = userContext.user?.userId;
        var res;
        try {
            if (data) {
                res = await (await fetch(`/api/projects/${data.projectId}`, {
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
            } else {
                res = await (await fetch("/api/projects", {
                    method: "POST",
                    headers: myHeaders,
                    body: JSON.stringify({
                        projectName: title,
                        description: description,
                        dueDate: dueDate,
                        managerId: Number(manager),
                        memberIds: selectedMembers,
                        createdBy: Number(adminId),
                    }),
                })).json();
            }
            if (!res.error) {
                await userContext.refreshData();
                setOpen(false);
            }
        } catch (error) {

        } finally {
            userContext.setLoading(false);
        }
    }

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
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>

                <DialogContent className="sm:max-w-3/8 p-0 max-h-11/12 overflow-auto" style={{ scrollbarWidth: 'none' }} >
                    <div>
                        <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-2xl font-bold text-center mt-2"> {isEdit ? "Edit Project" : "Add Project"}</DialogTitle>
                            <DialogDescription className="text-md text-center text-muted-foreground"> {isEdit ? "Edit project details below" : "Enter project details below"} </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="bg-card m-auto h-fit w-full max-w-lg rounded-[calc(var(--radius)+.125rem)] border p-1 ">
                            <div className="p-8 pb-6">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="block text-sm font-medium">Project Name</Label>
                                        <Input id="title" placeholder="e.g. Website Redesign" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="block text-sm font-medium">Description</Label>
                                        <Textarea id="description" placeholder="e.g. Project goals and scope..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-25 bg-background rounded-md border border-input px-3 py-2" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 flex flex-col">
                                            <Label className="block text-sm font-medium">Due Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")} >
                                                        <CalendarIcon className="mr-2 h-4 w-4" /> {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar hidden={{ before: new Date() }} mode="single" selected={dueDate} onSelect={setDueDate} autoFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="block text-sm font-medium">Project Manager</Label>
                                            <Select onValueChange={setManager} required value={isEdit ? manager : ""}>
                                                <SelectTrigger className="bg-background rounded-md border border-input">
                                                    <SelectValue placeholder="Select Manager" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {managers.map((m) => (
                                                        <SelectItem key={m.userId} value={Number(m.userId) + ""} className="pt-3">{m.userName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="block text-sm font-medium">Team Members</Label>
                                        <Select onValueChange={addMember}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Add Team Member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {members.map((m) => (
                                                    <SelectItem
                                                        key={m.userId}
                                                        value={Number(m.userId) + ""}
                                                        disabled={selectedMembers.includes(Number(m.userId))}
                                                        className="pt-3"
                                                    > {m.userName} </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {selectedMembers.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedMembers.map(memberId => {
                                                    const member = members.find(m => Number(m.userId) === memberId);
                                                    return (
                                                        <div key={memberId} className="flex items-center gap-1 border border-muted-foreground text-muted-foreground px-2 py-1 rounded-md text-[14px]">
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

                                </div>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full text-lg" disabled={loading}>{isEdit ? "Edit Project" : "Add Project"}</Button>
                            </div>
                        </form>

                        <div className="bg-muted border-t p-3 mt-3">
                            <p className="text-center text-sm">
                                <Button variant="link" onClick={() => handleOpenChange(false)} className="px-2 text-[15px] text-muted-foreground">
                                    Cancel
                                </Button>
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>

    );
}