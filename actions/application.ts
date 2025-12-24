import { z } from "zod";

const applicationSchema = z.object({
    roomId: z.string().min(1, 'Room is required'),
    businessPlan: z.string().min(100, 'Business plan must be at least 100 characters'),
    businessName: z.string().min(2, 'Business name is required'),
    businessType: z.string().min(2, 'Business type is required'),
    expectedMoveIn: z.string().datetime('Invalid date'),
    supportingDocs: z.array(z.string().url()).min(1, 'At least one supporting document required'),
});

export async function submitApplication(prevState: any, formData: FormData) {
    // Get current uer : Implement later

    // parse and validate form data


    console.log('Validated Application Data:', { formData, prevState });
    console.log(formData.get("businessName"))
    console.log(formData.get("businessType"))
    console.log(formData.get("businessPlan"))
    console.log(formData.get("expectedMoveIn"))
}