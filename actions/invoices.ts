import z from "zod";
import { getCurrentUser, requireAdmin } from "./auth";
import prisma from "@/lib/prisma";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const invoiceItemSchema = z.object({
    description: z.string(),
    amount: z.number().positive(),
    quantity: z.number().int().positive().default(1),
});

const generateInvoiceSchema = z.object({
    applicationId: z.string(),
    tenantId: z.string(),
    items: z.array(invoiceItemSchema).min(1),
    dueDate: z.string().datetime().optional(),
    notes: z.string().optional(),
});

export async function generateInvoice(
    data: z.infer<typeof generateInvoiceSchema>
) {
    try {
        const validatedData = generateInvoiceSchema.parse(data);

        const user = await getCurrentUser();
        requireAdmin();

        const tenant = await prisma.user.findUnique({
            where: { id: validatedData.tenantId },
        });

        if (!tenant) {
            throw new Error('Tenant not found');
        }

        const application = await prisma.application.findUnique({
            where: { id: validatedData.applicationId },
            include: { room: true },
        });

        if (!application) {
            throw new Error('Application not found');
        }

        // 4. Calculate total amount
        const totalAmount = validatedData.items.reduce(
            (sum, item) => sum + item.amount * item.quantity,
            0
        );

        /*  let stripeCustomerId = tenant.email; 
 
         const customers = await stripe.customers.list({
             email: tenant.email,
             limit: 1,
         });
 
         if (customers.data.length === 0) {
             const customer = await stripe.customers.create({
                 email: tenant.email,
                 name: tenant.name,
                 phone: tenant.phone || undefined,
                 metadata: {
                     userId: tenant.id,
                     applicationId: application.id,
                 },
             });
             stripeCustomerId = customer.id;
         } else {
             stripeCustomerId = customers.data[0].id;
         }
 
         // 6. Create Stripe invoice
         const stripeInvoice = await stripe.invoices.create({
             customer: stripeCustomerId,
             collection_method: 'send_invoice',
             days_until_due: 7,
             description: `Invoice for ${application.room.name}`,
             metadata: {
                 applicationId: application.id,
                 tenantId: tenant.id,
             },
         });
 
         // 7. Add line items to Stripe invoice
         for (const item of validatedData.items) {
             await stripe.invoiceItems.create({
                 customer: stripeCustomerId,
                 invoice: stripeInvoice.id,
                 amount: Math.round(item.amount * 100), // Convert to cents
                 currency: 'usd',
                 description: item.description,
                 quantity: item.quantity,
             });
         }
 
         // 8. Finalize and send Stripe invoice
         const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
         await stripe.invoices.sendInvoice(stripeInvoice.id); */

        // 9. Create invoice record in database
        const dueDate = validatedData.dueDate
            ? new Date(validatedData.dueDate)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        const invoice = await prisma.invoice.create({
            data: {
                tenantId: validatedData.tenantId,
                applicationId: validatedData.applicationId,
                amount: totalAmount,
                currency: 'USD',
                status: 'SENT',
                //stripeInvoiceId: stripeInvoice.id,
                items: validatedData.items,
                notes: validatedData.notes,
                dueDate,
            },
            include: {
                tenant: true,
                application: {
                    include: { room: true },
                },
            },
        });

        // 10. Create notification
        await prisma.notification.create({
            data: {
                type: 'INVOICE_GENERATED',
                title: 'Invoice Generated',
                message: `Invoice for ${application.room.name} has been generated`,
                recipientId: tenant.id,
                senderId: user.id,
                metadata: { invoiceId: invoice.id },
            },
        });

        // 11. Send email notification
        /* await sendEmail({
            to: tenant.email,
            subject: 'Invoice for Your New Shop Space',
            html: `
        <h1>Invoice Generated</h1>
        <p>Hi ${tenant.name},</p>
        <p>Your invoice for ${application.room.name} is ready.</p>
        <h2>Invoice Details:</h2>
        <ul>
          ${validatedData.items.map(item => `
            <li>${item.description}: $${item.amount.toFixed(2)}</li>
          `).join('')}
        </ul>
        <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
        <p><a href="${finalizedInvoice.hosted_invoice_url}">View & Pay Invoice</a></p>
      `,
        }); */

        return {
            success: true,
            invoice,
            message: 'Invoice generated and sent successfully',
        };

    } catch (error) {
        console.error('Generate invoice error:', error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Validation failed',
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate invoice',
        };
    }
}

/**
 * Record payment (called by Stripe webhook)
 * Updates invoice status and room occupancy
 * 
 * This is typically called from the webhook handler, not directly
 */
export async function recordPayment(stripeInvoiceId: string) {
    try {
        // 1. Find invoice
        const invoice = await prisma.invoice.findUnique({
            where: { stripeInvoiceId },
            include: {
                tenant: true,
                application: {
                    include: { room: true },
                },
            },
        });

        if (!invoice) {
            throw new Error('Invoice not found');
        }

        if (invoice.status === 'PAID') {
            // Already processed
            return { success: true, message: 'Payment already recorded' };
        }

        // 2. Update invoice status
        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
                status: 'PAID',
                paidAt: new Date(),
            },
        });

        // 3. Update room status to OCCUPIED and set current tenant
        if (invoice.application) {
            await prisma.room.update({
                where: { id: invoice.application.roomId },
                data: {
                    status: 'OCCUPIED',
                    currentTenantId: invoice.tenantId,
                },
            });

            // 4. Update user role to TENANT
            await prisma.user.update({
                where: { id: invoice.tenantId },
                data: { role: 'TENANT' },
            });
        }

        // 5. Create notification
        await prisma.notification.create({
            data: {
                type: 'PAYMENT_RECEIVED',
                title: 'Payment Received',
                message: 'Your payment has been received successfully',
                recipientId: invoice.tenantId,
                metadata: { invoiceId: invoice.id },
            },
        });

        /* await sendEmail({
            to: invoice.tenant.email,
            subject: 'Payment Received - Welcome! 🎉',
            html: `
        <h1>Payment Confirmed</h1>
        <p>Hi ${invoice.tenant.name},</p>
        <p>We've received your payment of $${invoice.amount.toFixed(2)}.</p>
        ${invoice.application ? `
          <p>Welcome to ${invoice.application.room.name}! Your shop space is now ready.</p>
          <h2>Next Steps:</h2>
          <ol>
            <li>Sign your rental agreement</li>
            <li>Schedule your move-in date</li>
            <li>Access your tenant portal for all documents</li>
          </ol>
        ` : ''}
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal">Go to Portal</a></p>
      `,
        }); */


        return {
            success: true,
            invoice: updatedInvoice,
            message: 'Payment recorded successfully',
        };

    } catch (error) {
        console.error('Record payment error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to record payment',
        };
    }
}

/**
 * Get invoices for current user or all invoices (admin)
 */
export async function getInvoices() {
    try {
        const user = await getCurrentUser();

        const invoices = await prisma.invoice.findMany({
            where: user.role === 'ADMIN' ? {} : { tenantId: user.id },
            include: {
                tenant: true,
                application: {
                    include: { room: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, invoices };

    } catch (error) {
        console.error('Get invoices error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get invoices',
        };
    }
}

/**
 * Get single invoice by ID
 */
export async function getInvoice(invoiceId: string) {
    try {
        const user = await getCurrentUser();

        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                tenant: true,
                application: {
                    include: { room: true },
                },
            },
        });

        if (!invoice) {
            return { success: false, error: 'Invoice not found' };
        }

        // Authorization check
        if (user.role !== 'ADMIN' && invoice.tenantId !== user.id) {
            return { success: false, error: 'Unauthorized' };
        }

        return { success: true, invoice };

    } catch (error) {
        console.error('Get invoice error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get invoice',
        };
    }
}