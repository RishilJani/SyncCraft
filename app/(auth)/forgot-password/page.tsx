"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React, { useState } from "react";
import CustomLoader from "@/components/custom_loader";
import { myHeaders } from "@/app/(utils)/utils";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({ email }),
            });
            const result = await res.json();

            if (!res.ok || result.error) {
                setError(result.message || "Failed to send reset link");
            } else {
                setMessage("Check your email for a password reset link.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <CustomLoader message="Sending reset link..." />}
            <section className="flex h-screen overflow-auto bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
                <form onSubmit={handleSubmit} className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                    <div className="p-8 pb-6">
                        <div>
                            <h1 className="text-title mb-1 mt-4 text-xl font-semibold text-center">Forgot Password</h1>
                            <p className="text-sm text-center text-muted-foreground">Enter your email to receive a password reset link.</p>
                        </div>
                        <hr className="my-4 border-dashed" />
                        {error && <p className="text-red-500 text-sm pb-3 text-center">{error}</p>}
                        {message && <p className="text-green-600 text-sm pb-3 text-center">{message}</p>}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="block text-sm"> Email Address </Label>
                                <Input type="email" required name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <Button type="submit" className="w-full">Send Reset Link</Button>
                        </div>
                    </div>

                    <div className="bg-muted rounded-b-lg border-t p-3">
                        <p className="text-accent-foreground text-center text-sm">
                            Remember your password?
                            <Button asChild variant="link" className="px-2">
                                <Link href="/login" replace={true}>Log in</Link>
                            </Button>
                        </p>
                    </div>
                </form>
            </section>
        </>
    );
}
