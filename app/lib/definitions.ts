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
