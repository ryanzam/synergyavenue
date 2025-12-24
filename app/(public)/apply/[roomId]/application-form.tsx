"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { IRoom } from '@/interfaces'
import React, { useActionState, useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Loader2, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useFormStatus } from 'react-dom'
import { submitApplication } from '@/actions/application'
interface ApplicationFormProps {
    room: IRoom
}

const SubmitButton = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {

    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} variant="default" className="flex-1" size="lg">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                </>) : currentStep === totalSteps ? (
                    <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Submit Application
                    </>
                ) : (
                'Continue to Next Step'
            )}
        </Button>
    );
};

const ApplicationForm = ({ room }: ApplicationFormProps) => {

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [uploadedDocs, setUploadedDocs] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        homeAddress: '',
        email: '',
        phone: '',
        businessName: '',
        businessType: '',
        businessPlan: '',
        expectedMoveIn: '',
    });
    const [state, formAction] = useActionState(submitApplication, null);

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
        if (e.target.files && e.target.files[0]) {
            setUploadedDocs(e.target.files[0]);
            toast.success('Document uploaded successfully');
        }
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
                <form action={formAction} className="space-y-6">
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
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="homeAddress">Home Address *</Label>
                                    <Input
                                        id="homeAddress"
                                        name="homeAddress"
                                        required
                                        placeholder="BNP-2, Chitwan"
                                        className="mt-1"
                                        value={formData.homeAddress}
                                        onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        placeholder="+1 (555) 123-4567"
                                        className="mt-1"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                                    <Input name="roomId" value={room.id} type="hidden" />
                                    <Label htmlFor="businessName">Business Name *</Label>
                                    <Input
                                        id="businessName"
                                        name="businessName"
                                        required
                                        placeholder="My Shoe Store"
                                        className="mt-1"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
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
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
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
                                    value={formData.businessPlan}
                                    onChange={(e) => setFormData({ ...formData, businessPlan: e.target.value })}
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
                                    value={formData.expectedMoveIn}
                                    onChange={(e) => setFormData({ ...formData, expectedMoveIn: e.target.value })}
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

                    {/* Step 3: Documents & Review */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            {/* Hidden inputs for all form data */}
                            <input type="hidden" name="name" value={formData.name} />
                            <input type="hidden" name="homeAddress" value={formData.homeAddress} />
                            <input type="hidden" name="email" value={formData.email} />
                            <input type="hidden" name="phone" value={formData.phone} />
                            <input type="hidden" name="businessName" value={formData.businessName} />
                            <input type="hidden" name="businessType" value={formData.businessType} />
                            <input type="hidden" name="businessPlan" value={formData.businessPlan} />
                            <input type="hidden" name="expectedMoveIn" value={formData.expectedMoveIn} />
                            <input type="hidden" name="roomId" value={room.id} />
                            <div>
                                <Label htmlFor='supportingDocs' className='flex justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-secondary transition-colors'>
                                    <div className="border-gray-300 rounded-lg p-8 text-center hover:border-secondary transition-colors">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className='text-gray-400'>Click to upload file</p>
                                        <input
                                            id='supportingDocs'
                                            name='supportingDocs'
                                            type="file"
                                            accept='application/pdf'
                                            className='w-full h-full hidden'
                                            onChange={handleUpload}
                                        />
                                    </div>
                                </Label>

                                {uploadedDocs && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium">Uploaded Documents:</p>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span className="text-sm flex-1">{uploadedDocs.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadedDocs(null)}
                                                    className="text-sm cursor-pointer text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </li>
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
                                        <span className="text-gray-600">Document Uploaded:</span>
                                        <span className="font-medium">{uploadedDocs?.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={handlePreviousStep} className="flex-1 hover:text-white">
                                    Back
                                </Button>
                                <SubmitButton currentStep={currentStep} totalSteps={totalSteps} />
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    </div >
    )
}

export default ApplicationForm