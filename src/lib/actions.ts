'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, {message: 'Name must be at least 2 characters.'}),
  email: z.string().email({message: 'Please enter a valid email address.'}),
  message: z.string().min(10, {message: 'Message must be at least 10 characters.'}),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
    };
  }
  
  // In a real app, you'd send an email or save to a database.
  console.log('Contact form submitted:', validatedFields.data);
  return { success: true, message: 'Your message has been sent!' };
}
