import {z} from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const authDto = z.object({
    email: z
        .string()
        .min(1, "Test is required")
        .email("Invalid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .max(8, "Password must be at least 8 characters")
        .regex(passwordRegex, "Password must contain uppercase, lowercase, number, and special character")
})

