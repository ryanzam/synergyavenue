import { Building2 } from 'lucide-react'
import Link from 'next/link'
import LoginForm from './loginForm'

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-primary to-secondary flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/10" />

            <div className="relative w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">SynergyAvenue</h1>
                    <p className="text-blue-100">Sign in to manage your shop spaces</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-primary">Welcome back</h2>
                        <p className="text-primary mt-1">Enter your credentials to continue</p>
                    </div>

                    <LoginForm />

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <Link
                        href="/register"
                        className="block w-full text-center py-3 px-4 border-2 border-primary text-primary font-medium rounded-lg hover:bg-secondary/70 transition-colors"
                    >
                        Create an account
                    </Link>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center text-sm text-blue-100">
                    <Link href="/" className="hover:text-white transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage