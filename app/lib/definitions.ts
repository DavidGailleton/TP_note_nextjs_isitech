export type Role = {
    role: string;
};

export type RegisterRole = {
    roles: Role[];
};

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
};
