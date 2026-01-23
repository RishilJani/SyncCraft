"use client";

import { addProject } from "@/app/actions/admin/Admin";
import { getUser, Users } from "@/app/actions/users/Users";
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
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";

interface AddProjectFormProps {
    managers: Users[];
    members: Users[];
}

export default function AddProjectForm({ managers, members }: AddProjectFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date>();
    const [manager, setManager] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Handle Submit Functin\n");
        
        const adminId = (await getUser())?.userId;
        // console.log({
        //     title,
        //     description,
        //     createdBy : adminId,
        //     dueDate : dueDate,
        //     manager,
        //     members: selectedMembers
        // });
        
        const project = await addProject({
            projectName: title,
            description,
            dueDate: dueDate!,
            createdBy: Number(adminId!),
            managerId: Number(manager),
            memberIds: selectedMembers
        }).then(()=>{
            console.log("Project Created");
            redirect("/admin");
        });
        
        // [TODO] revalidate logic here

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


    return (
        <div className="w-full flex-col">
            <form onSubmit={handleSubmit} className="bg-card m-auto h-fit w-full max-w-lg rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <h1 className="text-title mb-1 mt-4 text-xl font-semibold text-center">Add New Project</h1>
                        <p className="text-sm text-center text-muted-foreground">Enter project details below</p>
                    </div>
                    <hr className="my-4 border-dashed" />

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="block text-sm font-medium">Project Name</Label>
                            <Input id="title" placeholder="e.g. Website Redesign" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="block text-sm font-medium">Description</Label>
                            <Textarea id="description" placeholder="Project goals and scope..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-25" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label className="block text-sm font-medium">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")} >
                                            <CalendarIcon className="mr-2 h-4 w-4"  /> {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label className="block text-sm font-medium">Project Manager</Label>
                                <Select onValueChange={setManager} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managers.map((m) => (
                                            <SelectItem key={m.userId} value={Number(m.userId) + ""}>{m.userName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="block text-sm font-medium">Team Members</Label>
                            <Select onValueChange={addMember}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add Team Member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map((m) => (
                                        <SelectItem key={m.userId} value={Number(m.userId) + ""} disabled={selectedMembers.includes(Number(m.userId))}>{m.userName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedMembers.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedMembers.map(memberId => {
                                        const member = members.find(m => Number(m.userId) === memberId);
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

                        <div className="pt-4">
                            <Button type="submit" className="w-full text-lg" onClick={async (e)=>{await handleSubmit(e);}}>Create Project</Button>
                        </div>
                    </div>
                </div>
                <div className="bg-muted rounded-b-(--radius) border-t p-3">
                    <p className="text-center text-sm">
                        <Button asChild variant="link" className="px-2 text-[15px] text-muted-foreground">
                            <Link href="/admin">Cancel</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </div>
    );
}