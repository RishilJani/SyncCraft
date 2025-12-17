'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import React, { useState } from "react";

function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // validation here

        redirect("/admin/dashboard");
    }
    return (
        <>
            <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
                <form action="POST" className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                    <div className="p-8 pb-6">
                        <div>
                            <h1 className="text-title mb-1 mt-4 text-xl font-semibold text-center">Welcome back !</h1>
                            <p className="text-sm text-center">Log in to your account to get started</p>
                        </div>
                        <hr className="my-4 border-dashed" />

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="userName" className="block text-sm"> User Name </Label>
                                <Input
                                    type="text" required
                                    name="userName"
                                    id="userName"
                                    value={userName}
                                    onChange={(e) => { setUserName(e.target.value); }} />
                            </div>

                            <div className="space-y-2">

                                <Label htmlFor="pwd" className="text-title text-sm"> Password </Label>
                                <Input
                                    type="password" required
                                    name="pwd"
                                    id="pwd"
                                    className="input sz-md variant-mixed"
                                    value={password}
                                    autoComplete='current-password'
                                    onChange={(e) => { setPassword(e.target.value); }} />
                            </div>

                            <Button className="w-full" onClick={(e) => { handleSubmit(e); }}>Sign Up</Button>
                        </div>
                    </div>

                    <div className="bg-muted rounded-(--radius) border p-3">
                        <p className="text-accent-foreground text-center text-sm">
                            Don't have an account ?
                            <Button asChild variant="link" className="px-2">
                                <Link href="/register">Sign up</Link>
                            </Button>
                        </p>
                    </div>
                </form>
            </section>
        </>
    );
}

export default LoginPage;
