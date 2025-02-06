import postgres from 'postgres';
import bcrypt from 'bcrypt';
import {users} from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUser () {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    // await sql`
    //     CREATE TYPE roles as ENUM('teacher', 'student', 'admin');`;
    await sql`
        CREATE TABLE if NOT EXISTS Users (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(50) NOT NULL,
            role roles NOT NULL,
            createdAt TIMESTAMP NOT NULL DEFAULT NOW()
    );`;

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        await sql`
            INSERT INTO users (id, email, password, name, role)
            VALUES (${user.id}, ${user.email}, ${hashedPassword}, ${user.name}, ${user.role})
            ON CONFLICT (id) DO NOTHING;
        `;
    }
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
            schedule TIMESTAMP NOT NULL,
            capacity SMALLINT,
            FOREIGN KEY (teacherId) REFERENCES Users(id) ON DELETE CASCADE
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
        status VARCHAR(255),
        FOREIGN KEY (studentId) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE
    )`
}

async function seedProgress () {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`
    CREATE TABLE if NOT EXISTS Progress (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        studentId UUID NOT NULL,
        courseId UUID NOT NULL,
        date TIMESTAMP NOT NULL,
        evaluation VARCHAR(255),
        comments TEXT,
        FOREIGN KEY (studentId) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE
    )`
}

export async function GET() {
    try {
        const result = await sql.begin(async (sql) => {
            await seedUser();
            await seedCourse();
            await seedEnrollment();
            await seedProgress();
        });

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
