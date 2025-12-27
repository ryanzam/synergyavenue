import { registerUser } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { User, Mail, Phone, Lock, Home, Loader2, Info } from 'lucide-react'
import React, { useActionState, useEffect, useState } from 'react'
import { useFormStatus, } from 'react-dom'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full bg-primary hover:bg-primary/70 cursor-pointer"
            size="lg"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                </>
            ) : (
                'Create account'
            )}
        </Button>
    );
}

const RegisterForm = () => {
    const router = useRouter();

    const [password, setPassword] = useState('')
    const [state, formAction] = useActionState(registerUser, null);

    useEffect(() => {
        if (state?.success) {
            toast.success("Account created! 🎉");
            router.push("/login")
        }
    }, [state?.success])

    const getPasswordStrength = (pass: string) => {
        if (pass.length === 0) return { strength: 0, label: '', color: '' };
        if (pass.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
        if (pass.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
        if (pass.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
        return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <form action={formAction} className="space-y-4">
            {!state?.success && (<span className='text-red-600 flex items-center gap-2 font-medium'>{state?.error}</span>)}

            {/* Name Field */}
            <div>
                <Label className='text-[14px] font-medium text-primary' htmlFor="name">Full name</Label>
                <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Ram Bahadur Malla"
                        className="pl-10"
                        autoComplete="name"
                    />
                </div>
            </div>

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

            {/* Phone Field */}
            <div>
                <Label className='text-[14px] font-medium text-primary' htmlFor="phone">Phone number</Label>
                <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        pattern='[0-9]{10}'
                        placeholder="9876543210"
                        className="pl-10"
                        autoComplete="tel"
                    />
                </div>
            </div>

            {/* Home Address Field */}
            <div>
                <Label className='text-[14px] font-medium text-primary' htmlFor="homeAddress">Home Address</Label>
                <div className="relative mt-1">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="homeAddress"
                        name="homeAddress"
                        required
                        type="text"
                        placeholder="Kathmandu"
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Password Field */}
            <div>
                <Label className='text-[14px] font-medium text-primary' htmlFor="password">Password</Label>
                <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        className="pl-10"
                        autoComplete="new-password"
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Password Strength Indicator */}
                {password && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">Password strength:</span>
                            <span className={`font-medium ${passwordStrength.strength >= 75 ? 'text-green-600' :
                                passwordStrength.strength >= 50 ? 'text-blue-600' :
                                    passwordStrength.strength >= 25 ? 'text-yellow-600' :
                                        'text-red-600'
                                }`}>
                                {passwordStrength.label}
                            </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{ width: `${passwordStrength.strength}%` }}
                            />
                        </div>
                    </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters
                </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                />
                <label className='text-[14px] font-medium text-primary' htmlFor="terms">
                    I agree to the{' '}
                    <a href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                        Privacy Policy
                    </a>
                </label>
            </div>

            {/* Submit Button */}
            <SubmitButton />
        </form>
    )
}

export default RegisterForm