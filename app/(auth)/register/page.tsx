"use client"

import { Building2, CheckCircle2 } from 'lucide-react'
import React from 'react'
import RegisterForm from './registerForm'
import Link from 'next/link'

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary via-accent to-secondary flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10" />

      <div className="relative w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Join SynergyAvenue</h1>
            <p className="text-purple-100 text-lg mb-8">
              Start your business journey with premium shop spaces
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Easy Application Process</h3>
                  <p className="text-purple-100">Submit your application in minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Secure Payments</h3>
                  <p className="text-purple-100">Pay rent online with Stripe</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Digital Contracts</h3>
                  <p className="text-purple-100">E-sign agreements with DocuSign</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-300 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-purple-100">We're here to help anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary">Create your account</h2>
              <p className="text-primary mt-1">Get started with ShopRent Manager</p>
            </div>

            <RegisterForm />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              href="/login"
              className="block w-full text-center py-3 px-4 border-2 border-primary text-primary font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-purple-100">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage