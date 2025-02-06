"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { z } from "zod";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const RegisterSchema = z
    .object({
        name: z.string(),
        email: z.string().email("Email invalide"),
        password: z
            .string()
            .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
        confirmPassword: z.string(),
        role: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    });

export async function register(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        const validatedFields = RegisterSchema.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
            role: formData.get("role"),
        });

        if (!validatedFields.success) {
            return validatedFields.error.errors[0].message;
        }

        const { name, email, password, role } = validatedFields.data;

        const existingUser = await sql`
                SELECT email FROM users WHERE email = ${email}
            `;

        if (existingUser.length > 0) {
            return "Un compte existe déjà avec cet email";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sql`
                INSERT INTO users (name, email, password, role)
                VALUES (${name},${email}, ${hashedPassword}, ${role})
            `;
    } catch (error) {
        if (error instanceof AuthError) {
            return "Erreur lors de la connexion";
        }
        console.error("Registration error:", error);
        return "Une erreur est survenue lors de l'inscription";
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        console.log("signin");
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Email ou mot de passe invalide.";
                default:
                    return "Erreur";
            }
        }
        throw error;
    }
}
