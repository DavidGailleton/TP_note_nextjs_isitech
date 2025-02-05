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
    teacherId: string,
    teacherName: string,
    level: string,
    schedule: number,
    capacity: number,
}