import { z } from 'zod';


export const signupPostRequestBodySchema = z.object({
    firstName : z.string(),
    lastName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6) 
});

export const loginPostRequestBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const shortenPostRequestSchema = z.object({
  target_url: z.string().url({ message: "Must be a valid URL" }),
  code: z.string().min(3).max(20).optional(),
});
