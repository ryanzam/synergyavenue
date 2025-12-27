"use client"

import { loginUser } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full bg-primary hover:bg-primary/70"
            size="lg"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                </>
            ) : (
                'Sign in'
            )}
        </Button>
    );
}

const loginForm = () => {
    const router = useRouter();

    const [state, formAction] = useActionState(loginUser, null);

    useEffect(() => {
        if (state?.success) {
            toast.success('Welcome back! 👋')
            router.push('/dashboard');
        }
    }, [state?.success, router])

    console.log({ state })

    return (
        <form action={formAction} className="space-y-4">
            {!state?.success && (<span className='text-red-600 flex items-center gap-2 font-medium'>{state?.error}</span>)}

            {/* Email Field */}
            <div>
                <Label className='text-[14px] font-medium text-primary' htmlFor="email">Email address</Label>
                <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="pl-10"
                        autoComplete="email"
                    />
                </div>
            </div>

            {/* Password Field */}
            <div>
                <div className="flex items-center justify-between">
                    <Label className='text-[14px] font-medium text-primary' htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:text-blue-700"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="pl-10"
                        autoComplete="current-password"
                    />
                </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
                <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className='text-[14px] font-medium text-primary' htmlFor="remember">
                    Remember me
                </label>
            </div>

            {/* Submit Button */}
            <SubmitButton />
        </form>
    )
}

export default loginForm