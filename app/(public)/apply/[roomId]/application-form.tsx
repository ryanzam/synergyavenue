"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { IRoom } from '@/interfaces'
import React, { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Upload } from 'lucide-react'
import { toast } from 'sonner'
interface ApplicationFormProps {
    room: IRoom
}

const ApplicationForm = ({ room }: ApplicationFormProps) => {

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

    const totalSteps = 3;
    const progress = (currentStep / totalSteps) * 100;

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
    }

    return (<div className="max-w-3xl mx-auto">
        {/* Header */}
        < div className="text-center mb-8" >
            <h1 className="text-4xl font-bold text-primary mb-2">
                Apply for {room.name}
            </h1>
            <p className="text-lg text-gray-600">
                Complete the application form to secure your shop space
            </p>
        </div >

        {/* Progress bar */}
        <Card className='mb-8'>
            <CardContent>
                <div className='flex items-center justify-between'>
                    <span className='text-sm text-primary font-medium'>Step {currentStep} of {totalSteps}</span>
                    <span className='text-sm text-primary font-medium'>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />

                {/* Step Labels */}
                <div className="grid grid-cols-3 mt-4">
                    {['Personal', 'Business', 'Documents'].map((label, index) => (
                        <div
                            key={label}
                            className={`text-center text-xs font-medium ${index + 1 <= currentStep ? 'text-primary' : 'text-gray-400'
                                }`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
            <CardHeader>
                <CardHeader>
                    <CardTitle className='text-primary'>
                        {currentStep === 1 && 'Personal Information'}
                        {currentStep === 2 && 'Business Information'}
                        {currentStep === 3 && 'Supporting Documents'}
                    </CardTitle>
                    <CardDescription className='text-primary'>
                        {currentStep === 1 && 'Tell us about yourself'}
                        {currentStep === 2 && 'Share your business details'}
                        {currentStep === 3 && 'Upload required documents eg. ID proof, business license'}
                    </CardDescription>
                </CardHeader>
            </CardHeader>

            <CardContent>
                {/* Personal Information Form Fields */}
                {currentStep === 1 && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Ram Bahadur"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="name">Home Address *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="BNP-2, Chitwan"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="ramb@example.com"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <Button type="button" onClick={handleNextStep} className="w-full mt-5" size="lg">
                            Continue
                        </Button>
                    </div>
                )}

                {/* Step 2: Business Information */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="businessName">Business Name *</Label>
                                <Input
                                    id="businessName"
                                    name="businessName"
                                    required
                                    placeholder="My Shoe Store"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="businessType">Business Type *</Label>
                                <Input
                                    id="businessType"
                                    name="businessType"
                                    required
                                    placeholder="Retail shop"
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="businessPlan">Business Plan *</Label>
                            <Textarea
                                id="businessPlan"
                                name="businessPlan"
                                required
                                rows={10}
                                placeholder="Describe your business concept, target market, competitive advantages, financial projections, and why you're a good fit for this space..."
                                className="mt-1"
                                minLength={100}
                            />
                            <p className="text-sm text-gray-500 mt-1">Minimum 100 characters</p>
                        </div>

                        <div>
                            <Label htmlFor="expectedMoveIn">Expected Move-In Date *</Label>
                            <Input
                                id="expectedMoveIn"
                                name="expectedMoveIn"
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="mt-1"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={handlePreviousStep} className="flex-1 hover:text-white">
                                Back
                            </Button>
                            <Button type="button" onClick={handleNextStep} className="flex-1">
                                Continue
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Documents & Review */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-secondary transition-colors">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <input
                                    type="file"
                                    multiple
                                    className='w-full h-full'
                                    onChange={handleUpload}
                                >
                                    
                                </input>
                            </div>

                            {uploadedDocs.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-medium">Uploaded Documents ({uploadedDocs.length}):</p>
                                    <ul className="space-y-2">
                                        {uploadedDocs.map((url, index) => (
                                            <li key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span className="text-sm flex-1">Document {index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadedDocs(uploadedDocs.filter((_, i) => i !== index))}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Application Summary */}
                        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-4">Application Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Room:</span>
                                    <span className="font-medium">{room.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monthly Rent:</span>
                                    <span className="font-medium">${room.monthyRent}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Security Deposit:</span>
                                    <span className="font-medium">${room.deposit.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Documents Uploaded:</span>
                                    <span className="font-medium">{uploadedDocs.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={handlePreviousStep} className="flex-1 hover:text-white">
                                Back
                            </Button>
                            <Button type="submit" variant="default" onClick={handlePreviousStep} className="flex-1">
                                Submit
                            </Button>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    </div >
    )
}

export default ApplicationForm