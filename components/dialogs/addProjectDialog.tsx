"use client";

import { User } from "@/app/(types)/myTypes";
import { useMyContext } from "@/app/(utils)/myContext";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { getAllUsers } from "@/app/actions/users/Users";
import { role_enum } from "@/app/generated/prisma/enums";
import CustomLoader from "../custom_loader";
import { useRouter } from "next/navigation";

export default function AddProjectDialog({
    children,
    open,
    setOpen
}: {children : React.ReactNode, open : boolean, setOpen : Function}) {

    const router = useRouter();
    const userContext = useMyContext();
    // const [open, setOpen] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date>();
    const [manager, setManager] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [managers , setManagers] = useState<User[]>([]);
    const [members , setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        try {
            setLoading(true);
            getAllUsers().then((users)=>{
                setManagers(users.filter((user) => user.role === role_enum.manager));
                setMembers(users.filter((user) => user.role === role_enum.member));
            });
        }finally{
            setLoading(false);
        }
        
    },[]);

    if(loading){return ( <CustomLoader message="Just a minute"/>);}

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Handle Submit Functin\n");
        const adminId = userContext.user?.userId;
    
        var res = await(await fetch("/api/projects",{
            method : "POST",
            headers : myHeaders,
            body : JSON.stringify({
                projectName : title,
                description : description,
                createdBy : Number(adminId),
                dueDate : dueDate,
                managerId : Number(manager),
                memberIds: selectedMembers
            }),
        })).json();
        console.log("Res = ", res);
        
        await userContext.refreshData();
        if(!res.error){
            console.log("Project added");
            router.replace("/admin");
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

    const handleOpenChange = () => {
        setOpen();
    }

    return (
        <>
        <Dialog open={open}  onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>

                <DialogContent className="sm:max-w-3/8 p-0 max-h-11/12 overflow-scoll">
                    <div>
                        <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-2xl font-bold text-center mt-2">Add Project</DialogTitle>
                            <p className="text-md text-center text-muted-foreground">Enter project details below</p>
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
                                                    <Calendar fromDate={new Date()} mode="single" selected={dueDate}  onSelect={setDueDate} initialFocus />
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

                                </div>
                            </div>
                
                            <div className="pt-2">
                                <Button type="submit" className="w-full text-lg">Add Project</Button>
                            </div>
                        </form>

                        <div className="bg-muted border-t p-3 mt-3">
                            <p className="text-center text-sm">
                                <Button variant="link" onClick={() => handleOpenChange()} className="px-2 text-[15px] text-muted-foreground">
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