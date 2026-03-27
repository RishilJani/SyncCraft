"use client"

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";
import CustomLoader from "@/components/custom_loader";
import { myHeaders } from "@/app/(utils)/utils";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-transparent">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Reset Link</h1>
                    <p className="mb-4 text-sm">The password reset link is invalid or missing.</p>
                    <Link href="/forgot-password">
                        <Button>Request a new link</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!password.trim() || !confirmPassword.trim()) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify({ token, newPassword: password }),
            });
            const result = await res.json();

            if (!res.ok || result.error) {
                setError(result.message || "Failed to reset password");
            } else {
                setMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    redirect('/login');
                }, 2000);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex h-screen overflow-auto bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            {loading && <CustomLoader message="Resetting password..." />}
            <form onSubmit={handleSubmit} className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <h1 className="text-title mb-1 mt-4 text-xl font-semibold text-center">Reset Password</h1>
                        <p className="text-sm text-center">Enter your new password below.</p>
                    </div>
                    <hr className="my-4 border-dashed" />
                    {error && <p className="text-red-500 text-sm pb-3 text-center">{error}</p>}
                    {message && <p className="text-green-600 text-sm pb-3 text-center">{message}</p>}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="pwd" className="text-title text-sm"> New Password </Label>
                            <PasswordInput required name="pwd" id="pwd" className="input sz-md variant-mixed" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPwd" className="text-title text-sm"> Confirm Password </Label>
                            <PasswordInput required name="confirmPwd" id="confirmPwd" className="input sz-md variant-mixed" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <Button type="submit" className="w-full">Reset Password</Button>
                    </div>
                </div>
            </form>
        </section>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<CustomLoader message="Loading..." />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
