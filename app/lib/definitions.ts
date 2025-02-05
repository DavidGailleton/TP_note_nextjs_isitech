export type Role = {
    role: string;
};

export type RegisterRole = {
    roles: Role[];
};

export type coursesTable = {
    id: string,
    title: string,
    description: string,
    instrument: string,
    teacherName: string,
    level: string,
    schedule: number,
    capacity: number,
}