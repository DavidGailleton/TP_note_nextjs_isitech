"use server";
import postgres from "postgres";
import { courseTable, RegisterRole, User, user } from "@/app/lib/definitions";
import * as console from "node:console";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// In data.ts
export async function fetchRoles(): Promise<RegisterRole[]> {
    try {
        const rolesResult = await sql`SELECT distinct role FROM Users;`;
        // Transform the raw database result into the expected RegisterRole format
        const roles: RegisterRole[] = [
            {
                roles: rolesResult.map((row) => ({ role: row.role })),
            },
        ];
        return roles;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch roles data.");
    }
}

export async function fetchUserById(id: string): Promise<User | undefined> {
    try {
        const users = await sql<User[]>`
            SELECT id, name, email, password, role 
            FROM Users 
            WHERE id = ${id};
        `;
        return users[0];
    } catch (error) {
        console.log("erreur database : ", error);
        return undefined;
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
