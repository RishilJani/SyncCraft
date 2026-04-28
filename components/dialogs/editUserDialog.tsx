"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Errors, User } from "@/app/(types)/myTypes";
import { myHeaders } from "@/app/(utils)/utils";
import { role_enum } from "@/app/generated/prisma/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface EditUserDialogProps {
    user: User;
    onSuccess: () => void;
    children: React.ReactNode;
}

export default function EditUserDialog({ user, onSuccess, children }: EditUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState(user.userName || "");
    const [email, setEmail] = useState(user.email || "");
    const [role, setRole] = useState<role_enum>(user.role!);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const validateForm = () => {
        const newError: Errors = {};
        if (!userName.trim())
            newError.name = "Name is Required";

        if (!email.trim())
            newError.email = "Email is Required";
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
            newError.email = "Invalid email format";

        console.log("newError = ", newError);

        setErrors(newError);
        return Object.keys(newError).length == 0;
    }

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/${user.userId}`, {
                method: "PUT",
                headers: myHeaders,
                body: JSON.stringify({ userName, email, role }),
            });
            const data = await res.json();
            if (!data.error) {
                setOpen(false);
                onSuccess();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("An error occurred while updating the profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 p-0 overflow-hidden">
                <div className="bg-card">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-semibold text-center mt-2">Edit Profile</DialogTitle>
                        {/* <DialogDescription className="text-sm text-center text-muted-foreground mt-1">
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription> */}
                    </DialogHeader>

                    <hr className="mx-6 border-dashed" />
                    <form className="p-6 pt-4 space-y-4" onSubmit={handleUpdate}>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium"> Name </Label>
                            <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                            {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium"> Email </Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
                            {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                        </div>

                        {/* <div className="space-y-2">
                            <Label className="text-sm font-medium">Assign To</Label>
                            <Select onValueChange={(e) => setRole(e as role_enum)} value={role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        <SelectItem key={1} value={role_enum.manager}>Manager</SelectItem>,
                                        <SelectItem key={2} value={role_enum.member}>Member</SelectItem>
                                    ]}
                                </SelectContent>
                            </Select>
                        </div> */}
                        <div className="space-y-2 my-3">
                            <Label className="text-title text-sm"> Role </Label>
                            <RadioGroup value={role} onValueChange={(value) => setRole(value as role_enum)} className="flex flex-row justify-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={role_enum.admin} id="r-admin" />
                                    <Label htmlFor="r-admin">Admin</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={role_enum.manager} id="r-manager" />
                                    <Label htmlFor="r-manager">Manager</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={role_enum.member} id="r-member" />
                                    <Label htmlFor="r-member">Member</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" className="w-full text-lg" disabled={loading}>
                                {loading ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </form>
                    <div className="bg-muted border-t p-3 text-center">
                        <Button variant="link" onClick={() => setOpen(false)} className="px-2 text-[15px] text-muted-foreground">
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
