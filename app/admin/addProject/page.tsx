"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const MANAGERS = [
  { id: "m1", name: "Alice Johnson" },
  { id: "m2", name: "Bob Smith" },
  { id: "m3", name: "Charlie Davis" },
];

const TEAM_MEMBERS = [
  { id: "t1", name: "David Wilson" },
  { id: "t2", name: "Eva Brown" },
  { id: "t3", name: "Frank Miller" },
  { id: "t4", name: "Grace Lee" },
  { id: "t5", name: "Hannah White" },
];

export default function AddProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [manager, setManager] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      date,
      manager,
      members: selectedMembers
    });
    redirect("/admin");
  }

  const addMember = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const removeMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(id => id !== memberId));
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-14 md:py-14 dark:bg-transparent">
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
              <Input
                id="title"
                placeholder="e.g. Website Redesign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="block text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Project goals and scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-25"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <Label className="block text-sm font-medium">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
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
                    {MANAGERS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
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
                  {TEAM_MEMBERS.map((m) => (
                    <SelectItem
                      key={m.id}
                      value={m.id}
                      disabled={selectedMembers.includes(m.id)}
                    >
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMembers.map(memberId => {
                    const member = TEAM_MEMBERS.find(m => m.id === memberId);
                    return (
                      <div key={memberId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-[14px]">
                        <span>{member?.name}</span>
                        <button
                          type="button"
                          onClick={() => removeMember(memberId)}
                          className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full text-md">Create Project</Button>
            </div>
          </div>
        </div>
        <div className="bg-muted rounded-b-(--radius) border-t p-3">
          <p className="text-center text-sm">
            <Button asChild variant="link" className="px-2 text-muted-foreground">
              <Link href="/admin">Cancel</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
