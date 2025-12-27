"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/tw_utils";

export default function EmployeesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("All");

    const employees = [
        {
            id: 1,
            name: "Alice Johnson",
            designation: "Manager",
            email: "alice.j@synccraft.com",
            phone: "+1 (555) 123-4567",
        },
        {
            id: 2,
            name: "Bob Smith",
            designation: "Member",
            email: "bob.smith@synccraft.com",
            phone: "+1 (555) 987-6543",
        },
        {
            id: 3,
            name: "Charlie Brown",
            designation: "Member",
            email: "charlie.b@synccraft.com",
        },
        {
            id: 4,
            name: "Diana Prince",
            designation: "Manager",
            email: "diana.p@synccraft.com",
        },
        {
            id: 5,
            name: "Evan Wright",
            designation: "Member",
            email: "evan.w@synccraft.com",
        },
        {
            id: 6,
            name: "Fiona Gallagher",
            designation: "Member",
            email: "fiona.g@synccraft.com",
        }
    ];

    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "All" || employee.designation === filter;
        return matchesSearch && matchesFilter;
    });

    const filters = ["All", "Manager", "Member"];

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
            <div className="mx-auto w-full max-w-6xl space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/admin">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search employees..."
                            className="w-full pl-9 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                    filter === f
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground hover:bg-muted border-border"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                            <Card key={employee.id} className="hover:shadow-lg transition-all duration-300 border-border/50">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="flex flex-col">
                                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{employee.designation}</span>
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-2.5 text-sm text-muted-foreground mt-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 opacity-70" />
                                        <span className="truncate">{employee.email}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No employees found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
