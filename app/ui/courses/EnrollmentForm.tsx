"use client";

import { Button } from "@/app/ui/components/button";

type EnrollmentFormProps = {
    courseId: string;
    studentId: string;
    enrollInCourse: (formData: FormData) => Promise<void>;
};

export function EnrollmentForm({
    courseId,
    studentId,
    enrollInCourse,
}: EnrollmentFormProps) {
    return (
        <form action={enrollInCourse}>
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="studentId" value={studentId} />
            <Button type="submit" className="w-full mt-4">
                S&apos;inscrire
            </Button>
        </form>
    );
}
