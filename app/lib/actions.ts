'use server';

import {courseTable} from "@/app/lib/definitions";
import postgres from "postgres";
import {revalidatePath, revalidateTag} from "next/cache";
import { redirect } from "next/navigation";
import * as console from "node:console";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



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
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}

export async function EditCourse(courseId: string, formData: FormData) {
    try {
        const scheduleDate = new Date(formData.get('schedule') as string);
        const parisOffset = 1;
        scheduleDate.setHours(scheduleDate.getHours() + parisOffset);

        const updateData = {
            title: formData.get('title'),
            description: formData.get('description'),
            instrument: formData.get('instrument'),
            teacherId: formData.get('teacherId'),
            level: formData.get('level'),
            schedule: scheduleDate,
            capacity: Number(formData.get('capacity'))
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

        revalidatePath('/teacher/courses');
    } catch (error) {
        console.error('Course update failed:', error);
        throw new Error('Course update failed');
    }
    redirect('/teacher/courses');
}
