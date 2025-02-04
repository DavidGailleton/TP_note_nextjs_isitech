import postgres from 'postgres';
import bcrypt from 'bcrypt';
import {users} from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUser () {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`
        CREATE TYPE if NOT EXTISTS roles as ENUM('teacher', 'student');`;
    await sql`
        CREATE TABLE if NOT EXISTS User (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(50) NOT NULL,
            role roles,
            createdAt TIMESTAMP NOT NULL DEFAULT NOW()
    );`;
    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            return sql`
                INSERT INTO users (id, email, password, name, role)
                VALUES (${user.id}, ${user.email}, ${hashedPassword}, ${user.name}, ${user.role})
                ON CONFLICT (id) DO NOTHING;
            `;
        })
    )

    return insertedUsers;
}

async function seedCourse () {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`
        CREATE TABLE if NOT EXISTS Course (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            instrument VARCHAR(255),
            teacherId UUID NOT NULL,
            level VARCHAR(255),
            schedule TEXT,
            capacity SMALLINT
        );`;
}

async function seedEnrollment () {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`
    CREATE TABLE if NOT EXISTS Enrollment (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        studentId UUID NOT NULL,
        courseId UUID NOT NULL,
        enrollmentDate TIMESTAMP NOT NULL,
        status VARCHAR(255)
    )`
}

async function seedProgress () {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`
    CREATE TABLE if NOT EXISTS Progress (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        studentId UUID NOT NULL,
        coursId UUID NOT NULL,
        date TIMESTAMP NOT NULL,
        evaluation VARCHAR(255),
        comments TEXT
    )`
}