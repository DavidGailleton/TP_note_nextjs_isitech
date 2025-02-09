"use server";

import { courseTable } from "@/app/lib/definitions";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import * as console from "node:console";
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
const UpdateUserSchema = z
    .object({
        name: z.string(),
        password: z
            .string()
            .min(6, "Le mot de passe doit contenir au moins 6 caractères")
            .optional(),
        confirmPassword: z.string().optional(),
        role: z.string(),
    })
    .refine(
        (data) => {
            if (data.password || data.confirmPassword) {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            message: "Les mots de passe ne correspondent pas",
            path: ["confirmPassword"],
        }
    );

export type State = {
    errors?: {
        userId?: string[];
        email?: string[];
        name?: string[];
    };
    message?: string | null;
};
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

export async function updateUserById(
    userId: string,
    prevState: State,
    formData: FormData
) {
    try {
        const validatedFields = UpdateUserSchema.safeParse({
            name: formData.get("name"),
            password: formData.get("password") || undefined,
            confirmPassword: formData.get("confirmPassword") || undefined,
            role: formData.get("role"),
        });

        if (!validatedFields.success) {
            return validatedFields.error.errors[0].message;
        }

        const { name, password, role } = validatedFields.data;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await sql`
                UPDATE users 
                SET name = ${name}, 
                    password = ${hashedPassword}, 
                    role = ${role}
                WHERE id = ${userId}
            `;
        } else {
            await sql`
                UPDATE users 
                SET name = ${name}, 
                    role = ${role}
                WHERE id = ${userId}
            `;
        }

        revalidatePath("/admin/users");
        redirect("/admin/users");
    } catch (error) {
        console.error("Update user error:", error);
        return { message: "Erreur lors de la mise à jour de l'utilisateur" };
    }
}

export async function EditCourse(courseId: string, formData: FormData) {
    try {
        const scheduleDate = new Date(formData.get("schedule") as string);
        const parisOffset = 1;
        scheduleDate.setHours(scheduleDate.getHours() + parisOffset);

        const updateData = {
            title: formData.get("title"),
            description: formData.get("description"),
            instrument: formData.get("instrument"),
            teacherId: formData.get("teacherId"),
            level: formData.get("level"),
            schedule: scheduleDate,
            capacity: Number(formData.get("capacity")),
        };
        await sql`
            UPDATE course
            SET
                title = ${updateData.title},
                description = ${updateData.description},
                instrument = ${updateData.instrument},
                teacherId = ${updateData.teacherId},
                level = ${updateData.level},
                schedule = ${updateData.schedule},
                capacity = ${updateData.capacity}
            WHERE id = ${courseId}
        `;

        revalidatePath("/teacher/courses");
    } catch (error) {
        console.error("Course update failed:", error);
        throw new Error("Course update failed");
    }
    redirect("/teacher/courses");
}

export async function AddCourse(formData: FormData) {
    try {
        const scheduleDate = new Date(formData.get("schedule") as string);
        const parisOffset = 1;
        scheduleDate.setHours(scheduleDate.getHours() + parisOffset);

        const updateData = {
            title: formData.get("title"),
            description: formData.get("description"),
            instrument: formData.get("instrument"),
            teacherId: formData.get("teacherId"),
            level: formData.get("level"),
            schedule: scheduleDate,
            capacity: Number(formData.get("capacity")),
        };
        await sql`
            INSERT INTO course(
                title,
                description,
                instrument,
                teacherId,
                level,
                schedule,
                capacity
                ) VALUES (
                          ${updateData.title},
                          ${updateData.description},
                          ${updateData.instrument},
                          ${updateData.teacherId},
                          ${updateData.level},
                          ${updateData.schedule},
                          ${updateData.capacity}
                          
                         )
            `;

        revalidatePath("/teacher/courses");
    } catch (error) {
        console.error("Course insert failed:", error);
        throw new Error("Course insert failed");
    }
    redirect("/teacher/courses");
}

export async function DeleteCourse(courseId: string) {
    try {
        await sql`
        DELETE FROM course
        WHERE id = ${courseId};`;

        revalidatePath("/teacher/courses");
    } catch (error) {
        console.log("Failed to delete course : ", error);
        throw new Error("Failed to delete course");
    }
    redirect("/teacher/courses");
}
