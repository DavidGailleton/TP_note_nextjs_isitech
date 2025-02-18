"use server";
import postgres from "postgres";
import {courseTable, Progress, Role, Student, User, user} from "@/app/lib/definitions";
import * as console from "node:console";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchRoles(): Promise<Role[]> {
    try {
        const rolesResult = await sql`SELECT distinct role FROM Users;`;
        return rolesResult.map((row) => ({ role: row.role }));
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
const ITEMS_PER_PAGE = 6;
export async function fetchFilteredUsers(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const users = await sql<User[]>`
      SELECT
        *
      FROM users
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        users.role::text ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
        return users;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch users.");
    }
}

export async function fetchUsersPages(query: string) {
    try {
        const data = await sql`
        SELECT COUNT(*)
        FROM users
        WHERE
          name ILIKE ${`%${query}%`} OR
          email ILIKE ${`%${query}%`} OR
          role::text ILIKE ${`%${query}%`}
        `;

        const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of users.");
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

export async function fetchStudents(): Promise<Student[]> {
    try {
        return await sql<Student[]>`
        SELECT 
            users.id,
            users.name,
            users.email,
            users.role
        FROM users
        WHERE role = 'student';`;
    } catch (error) {
        console.error("Students fetch failed:", error);
        throw new Error("Students fetch failed");
    }
}

export async function fetchProgress(): Promise<Progress[]> {
    try {
        const progress = await sql<Progress[]>`
            SELECT 
                progress.id,
                progress.studentId,
                progress.courseId,
                progress.date,
                progress.evaluation,
                progress.comments,
                student.name as studentName,
                course.title as courseName
            FROM progress
            JOIN users as student ON student.id = progress.studentId
            JOIN course ON course.id = progress.courseId
            ORDER BY progress.date DESC;`;

        console.log(`Found ${progress.length} evaluations`);
        console.log(progress);
        return progress;
    } catch (error) {
        console.error("Progress fetch failed:", error);
        throw new Error("Progress fetch failed");
    }
}

export async function fetchStudentsByCourse(courseId: string): Promise<Student[]> {
    try {
        const students = await sql<Student[]>`
            SELECT 
                users.id,
                users.name,
                users.email,
                users.role
            FROM users
            JOIN enrollment ON enrollment.studentId = users.id
            WHERE enrollment.courseId = ${courseId}
            AND users.role = 'student';`;

        return students;
    } catch (error) {
        console.error("Students by course fetch failed:", error);
        throw new Error("Students by course fetch failed");
    }
}

export async function fetchProgressById(id: string): Promise<Progress | undefined> {
    try {
        const progress = await sql<Progress[]>`
      SELECT 
        progress.id,
        progress.studentId,
        student.name as studentName,
        progress.courseId,
        course.title as courseName,
        progress.date,
        progress.evaluation,
        progress.comments
      FROM progress
      JOIN users as student ON student.id = progress.studentId
      JOIN course ON course.id = progress.courseId
      WHERE progress.id = ${id};
    `;

        return progress[0];
    } catch (error) {
        console.error("Progress fetch failed:", error);
        return undefined;
    }
}

export async function fetchProgressByStudent(studentId: string): Promise<Progress[]> {
    try {
        const progress = await sql<Progress[]>`
      SELECT 
        progress.id,
        progress.studentId,
        progress.courseId,
        course.title as courseName,
        progress.date,
        progress.evaluation,
        progress.comments,
        teacher.name as teacherName
      FROM progress
      JOIN course ON course.id = progress.courseId
      JOIN users as teacher ON teacher.id = course.teacherId
      WHERE progress.studentId = ${studentId}
      ORDER BY progress.date DESC;
    `;

        return progress;
    } catch (error) {
        console.error("Student progress fetch failed:", error);
        throw new Error("Student progress fetch failed");
    }
}