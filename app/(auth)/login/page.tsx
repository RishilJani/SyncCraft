"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import React, { useState } from "react";
import { Errors } from "../register/page";
import { Role } from "@/lib/utils";
import { checkLogin } from "../auth";

function LoginPage() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(Role.Admin);
    const [errors, setErrors] = useState<Errors>({});

    const validateForm = () => {
        const newError: Errors = {};
        if (!userName.trim())
            newError.name = "Name is Required";
        if (!password.trim())
            newError.password = "Password is Required";
        setErrors(newError);

        return Object.keys(newError).length == 0;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // validation here
        if (validateForm()) {
            // login successful
            var data = {
                userName,
                password,
                role
            };
            console.log(data);
            var result = await checkLogin(data);
            if(result){
                console.log("Login Successful");
                redirect(role.toLowerCase(), RedirectType.replace);
            }else{
                setErrors({ credentials : "Invalid Credentials"});
            }
        }
    }

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form action="POST" className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <h1 className="text-title mb-1 mt-4 text-xl font-semibold text-center">Welcome back !</h1>
                        <p className="text-sm text-center">Log in to your account to get started</p>
                    </div>
                    <hr className="my-4 border-dashed" />
                    {errors.credentials && <p className="text-red-500 text-sm">{errors.credentials}</p>}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="userName" className="block text-sm"> User Name </Label>
                            <Input
                                type="text" required
                                name="userName"
                                id="userName"
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value); }} />
                            {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pwd" className="text-title text-sm"> Password </Label>
                            <PasswordInput
                                required
                                name="pwd"
                                id="pwd"
                                className="input sz-md variant-mixed"
                                value={password}
                                autoComplete='current-password'
                                onChange={(e) => { setPassword(e.target.value); }} />
                            {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-title text-sm"> Role </Label>
                            <RadioGroup value={role} onValueChange={(value)=> setRole(value as Role)} className="flex flex-row space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={Role.Admin} id="r-admin" />
                                    <Label htmlFor="r-admin">Admin</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={Role.Manager} id="r-manager" />
                                    <Label htmlFor="r-manager">Manager</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={Role.Member} id="r-member" />
                                    <Label htmlFor="r-member">Member</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button className="w-full" onClick={(e) => { handleSubmit(e); }}>Sign Up</Button>
                    </div>
                </div>

                <div className="bg-muted rounded-lg border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Don't have an account ?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/register">Sign up</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}

export default LoginPage;
