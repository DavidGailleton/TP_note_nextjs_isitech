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

export async function register(
    prevState: string | { message: string },
    formData: FormData
): Promise<string | { message: string }> {
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
                VALUES (${name}, ${email}, ${hashedPassword}, ${role})
            `;

        return { message: "success" };
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

const EnrollmentSchema = z.object({
    courseId: z.string(),
    studentId: z.string(),
});

export type StudentCourse = {
    id: string;
    title: string;
    description: string;
    instrument: string;
    teacherName: string;
    level: string;
    schedule: Date;
    enrollmentStatus: string;
};

export async function enrollInCourse(formData: FormData) {
    const validatedFields = EnrollmentSchema.safeParse({
        courseId: formData.get("courseId"),
        studentId: formData.get("studentId"),
    });

    if (!validatedFields.success) {
        return { error: "Données d'inscription invalides" };
    }

    const { courseId, studentId } = validatedFields.data;

    try {
        // Vérifier si l'étudiant est déjà inscrit
        const existingEnrollment = await sql`
            SELECT id FROM enrollment 
            WHERE studentId = ${studentId} 
            AND courseId = ${courseId}
        `;

        if (existingEnrollment.length > 0) {
            return { error: "Vous êtes déjà inscrit à ce cours" };
        }

        // Vérifier la capacité du cours
        const course = await sql`
            SELECT capacity, 
                   (SELECT COUNT(*) FROM enrollment WHERE courseId = ${courseId}) as enrolled
            FROM course 
            WHERE id = ${courseId}
        `;

        if (course[0].enrolled >= course[0].capacity) {
            return { error: "Ce cours est complet" };
        }

        // Créer l'inscription
        await sql`
            INSERT INTO enrollment (studentId, courseId, enrollmentDate, status)
            VALUES (${studentId}, ${courseId}, NOW(), 'active')
        `;

        revalidatePath("/student/courses");
        return { success: true };
    } catch (error) {
        console.error("Enrollment error:", error);
        return { error: "Erreur lors de l'inscription" };
    }
}

export async function getAvailableCourses(studentId: string) {
    try {
        const courses = await sql<StudentCourse[]>`
            SELECT 
                c.id,
                c.title,
                c.description,
                c.instrument,
                u.name as teacherName,
                c.level,
                c.schedule,
                c.capacity,
                (SELECT COUNT(*) FROM enrollment WHERE courseId = c.id) as enrolled
            FROM course c
            JOIN users u ON c.teacherId = u.id
            WHERE c.schedule > NOW()
            AND NOT EXISTS (
                SELECT 1 FROM enrollment 
                WHERE courseId = c.id 
                AND studentId = ${studentId}
            )
            AND (SELECT COUNT(*) FROM enrollment WHERE courseId = c.id) < c.capacity
            ORDER BY c.schedule
        `;
        return courses;
    } catch (error) {
        console.error("Error fetching available courses:", error);
        throw new Error("Failed to fetch available courses");
    }
}

export async function getStudentEnrollments(studentId: string) {
    try {
        const enrollments = await sql<StudentCourse[]>`
            SELECT 
                c.id,
                c.title,
                c.description,
                c.instrument,
                u.name as teacherName,
                c.level,
                c.schedule,
                e.status as enrollmentStatus
            FROM enrollment e
            JOIN course c ON e.courseId = c.id
            JOIN users u ON c.teacherId = u.id
            WHERE e.studentId = ${studentId}
            ORDER BY c.schedule DESC
        `;
        return enrollments;
    } catch (error) {
        console.error("Error fetching student enrollments:", error);
        throw new Error("Failed to fetch student enrollments");
    }
}
export async function updateUserById(
    userId: string,
    prevState: State,
    formData: FormData
): Promise<State> {
    try {
        const validatedFields = UpdateUserSchema.safeParse({
            name: formData.get("name"),
            password: formData.get("password") || undefined,
            confirmPassword: formData.get("confirmPassword") || undefined,
            role: formData.get("role"),
        });

        if (!validatedFields.success) {
            return {
                message: validatedFields.error.errors[0].message,
            };
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
        return { message: "success" };
    } catch (error) {
        console.error("Update user error:", error);
        return { message: "Erreur lors de la mise à jour de l'utilisateur" };
    }
}

export async function deleteUserById(id: string) {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath("/admin/users");
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

export type ProgressState = {
    message: string | null;
    errors?: Record<string, string[]>;
};

export async function submitEvaluation(
    prevState: ProgressState,
    formData: FormData
): Promise<ProgressState> {
    try {
        const studentId = formData.get("studentId") as string;
        const courseId = formData.get("courseId") as string;
        const evaluation = formData.get("evaluation") as string;
        const comments = formData.get("comments") as string;

        if (!studentId || !courseId || !evaluation) {
            return {
                message: "Les champs obligatoires doivent être remplis",
                errors: {
                    studentId: !studentId ? ["Étudiant obligatoire"] : [],
                    courseId: !courseId ? ["Cours obligatoire"] : [],
                    evaluation: !evaluation ? ["Évaluation obligatoire"] : [],
                },
            };
        }

        const date = new Date();

        await sql`
            INSERT INTO progress (studentId, courseId, date, evaluation, comments)
            VALUES (${studentId}, ${courseId}, ${date}, ${evaluation}, ${comments});
        `;

        revalidatePath("/teacher/evaluations");
        return { message: "success" };
    } catch (error) {
        console.error("Évaluation submission error:", error);
        return {
            message:
                "Une erreur est survenue lors de la soumission de l'évaluation",
        };
    }
}

export async function updateEvaluation(
    id: string,
    prevState: ProgressState,
    formData: FormData
): Promise<ProgressState> {
    try {
        const evaluation = formData.get("evaluation") as string;
        const comments = formData.get("comments") as string;

        if (!evaluation) {
            return {
                message: "L'évaluation est obligatoire",
                errors: {
                    evaluation: ["Évaluation obligatoire"],
                },
            };
        }

        await sql`
            UPDATE progress
            SET evaluation = ${evaluation}, comments = ${comments}
            WHERE id = ${id};
        `;

        revalidatePath("/teacher/evaluations");
        return { message: "success" };
    } catch (error) {
        console.error("Évaluation update error:", error);
        return {
            message:
                "Une erreur est survenue lors de la mise à jour de l'évaluation",
        };
    }
}

export async function deleteEvaluation(id: string) {
    try {
        await sql`DELETE FROM progress WHERE id = ${id}`;
        revalidatePath("/teacher/evaluations");
    } catch (error) {
        console.error("Évaluation deletion error:", error);
        throw new Error(
            "Une erreur est survenue lors de la suppression de l'évaluation"
        );
    }
}
