"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { useState } from 'react';

type Errors = {
    email? :String,
    password? : String
};

function SignUp() {
  const [userName ,setUserName] = useState("");
  const [email ,setEmail] = useState("");
  const [password ,setPassword] = useState("");
  const [errors ,setErrors] = useState<Errors>({});

  const validateForm = ()=>{
    const newError : Errors = {};
    if(!email.trim()){
        newError.email = "Email is Required";
    }else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
        newError.email = "Invalid email format";
    }

    if(!password.trim())
        newError.password = "Passwprd os Required";
    else if(!/[a-z]/.test(password))
        newError.password = "Password must contain at least one lowercase letter";
    else if(!/[A-Z]/.test(password))
        newError.password = "Password must contain at least one uppercase letter";
    else if(!/\d/.test(password))
        newError.password = "Password must contain at least one digit";
    else if(!/[^A-Za-z0-9]/.test(password))
        newError.password = "Password must contain at least one special character";
    
    setErrors(newError);
    return Object.keys(newError).length == 0;
  }
  const handleSubmit = (e : React.FormEvent)=>{
    e.preventDefault();
    if(validateForm()){
        console.log(userName);
        console.log(email);
        console.log(password);
        
    }
    
    
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form action="POST" className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]">
                <div className="p-8 pb-6">
                    <div>
                        <h1 className="text-title mb-1 mt-4 text-xl font-semibold">Create a SyncCraft Account</h1>
                        <p className="text-sm">Welcome! Create an account to get started</p>
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
                                onChange={(e)=>{ setUserName(e.target.value);}}/>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm"> Email</Label>
                            <Input 
                                type="email" required 
                                name="email"
                                id="email" 
                                value={email}
                                onChange={(e)=>{setEmail(e.target.value); }} />
                                { errors.email &&  <p className='text-red-500 text-sm'>{errors.email}</p> }
                        </div>

                        <div className="space-y-2">
                                
                            <Label htmlFor="pwd" className="text-title text-sm"> Password </Label>
                            <Input 
                                type= "password" required 
                                name="pwd" 
                                id="pwd" 
                                className="input sz-md variant-mixed" 
                                value={password}
                                autoComplete='current-password'
                                onChange={(e)=>{setPassword(e.target.value);}} />
                            { errors.password &&  <p className='text-red-500 text-sm'>{errors.password}</p> }
                        </div>

                        <Button className="w-full" onClick={(e) => { handleSubmit(e); }}>Sign Up</Button>
                    </div>
                </div>

                <div className="bg-muted rounded-(--radius) border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Already have an account ?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/login">Login</Link>
                        </Button>
                    </p>
                </div>
            </form>
    </section>
  )
}

export default SignUp
