export type Role = {
    role: string;
};

export type RegisterRole = {
    roles: Role[];
};

export type courseTable = {
    id: string,
    title: string,
    description: string,
    instrument: string,
    teacherid: string,
    teachername: string,
    level: string,
    schedule: Date,
    capacity: number,
}

export type user = {
    id: string,
    email: string,
    name: string,
    role: string,
}