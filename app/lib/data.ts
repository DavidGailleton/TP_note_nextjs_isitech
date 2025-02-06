"use server";
import postgres from "postgres";
import { courseTable, user } from "@/app/lib/definitions";
import * as console from "node:console";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchRoles() {
    try {
        const roles = await sql`SELECT distinct role FROM Users;`;
        return roles;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch revenue data.");
    }
}
export async function fetchUsers() {
    try {
        const users = await sql`select * from Users;`;
        return users;
    } catch (error) {
        console.log("erreur database : ", error);
    }
}
export async function fetchCourses(): Promise<courseTable[]> {
    try {
        const courses = await sql<courseTable[]>`
            SELECT 
                course.id,
                course.title,
                course.description,
                course.instrument,
                users.name AS teachername,
                course.level,
                course.schedule,
                course.capacity
            FROM course
            JOIN users ON users.id = course.teacherid
            ORDER BY schedule;`;
        console.log(courses);
        return courses;
    } catch (error) {
        throw new Error("Courses fetch failed");
    }
}

export async function fetchCourse(id: string): Promise<courseTable> {
    try {
        const courses = await sql<courseTable[]>`
            SELECT
                course.id,
                course.title,
                course.description,
                course.instrument,
                course.teacherid,
                users.name AS teacherName,
                course.level,
                course.schedule,
                course.capacity
            FROM course
            JOIN users ON users.id = course.teacherid 
            WHERE course.id = ${id};`;

        if (!courses || courses.length === 0) {
            throw new Error("Course not found");
        }

        return courses[0];
    } catch (error) {
        console.log(error);
        throw new Error("Course fetch failed");
    }
}

export async function fetchTeachers(): Promise<user[]> {
    try {
        return await sql<user[]>`
        SELECT 
            users.id,
            users.email,
            users.name,
            users.role
        FROM users
        WHERE role = 'teacher';`;
    } catch (error) {
        throw new Error("Teachers fetch failed");
    }
}
