"use server";
import postgres from "postgres";

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
