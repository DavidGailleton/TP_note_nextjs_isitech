"use server";
import postgres from "postgres";
import {courseTable} from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRoles() {
    try {
        const roles = await sql`SELECT role FROM Users;`;
        return roles;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch revenue data.");
    }
}
export async function fetchCourses():Promise<coursesTable[]>{
    try {
        return await sql<courseTable[]>`
            SELECT 
                course.id,
                course.title,
                course.description,
                course.instrument,
                users.name AS teacherName,
                course.level,
                course.schedule,
                course.capacity
            FROM course
            JOIN users ON users.id = course.teacherid;`;
    } catch (error) {
        throw new Error("An error occurred on DB request")
    }
}

export async function fetchCourse(id: string):Promise<courseTable>{
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

        return courses[0];
    } catch (error) {
        throw new Error("Course fetch failed")
    }
}