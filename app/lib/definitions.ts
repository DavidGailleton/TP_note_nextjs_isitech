export type BaseUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export type User = BaseUser & {
    password: string;
};

export type Role = {
    role: string;
};

export type RegisterRole = {
    roles: Role[];
};

export type courseTable = {
    id: string;
    title: string;
    description: string;
    instrument: string;
    teacherid: string;
    teachername: string;
    level: string;
    schedule: Date;
    capacity: number;
};

export type user = {
    id: string;
    email: string;
    name: string;
    role: string;
};
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: Omit<BaseUser, "password">;
    }

    interface User extends BaseUser {
        password: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends Omit<BaseUser, "email" | "name"> {}
}

export type Progress = {
    id: string;
    studentId: string;
    courseId: string;
    date: Date;
    evaluation: string;
    comments: string;
    studentname?: string;
    coursename?: string;
};

export type Student = {
    id: string;
    name: string;
    email: string;
    role: string;
};