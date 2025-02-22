// coursesEnrollements.tsx
import { Suspense } from "react";
import {
    getAvailableCourses,
    getStudentEnrollments,
    enrollInCourse,
} from "@/app/lib/actions";
import { auth } from "@/auth";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/ui/components/card";
import { EnrollmentForm } from "./EnrollmentForm";

async function AvailableCourses() {
    const session = await auth();
    const courses = await getAvailableCourses(session?.user?.id as string);

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
                <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow"
                >
                    <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                {course.description}
                            </p>
                            <div className="text-sm">
                                <p>
                                    <strong>Instrument :</strong>
                                    {course.instrument}
                                </p>
                                <p>
                                    <strong>Professeur :</strong>
                                    {course.teacherName}
                                </p>
                                <p>
                                    <strong>Niveau :</strong>
                                    {course.level}
                                </p>
                                <p>
                                    <strong>Date :</strong>
                                    {new Date(
                                        course.schedule
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Heure :</strong>
                                    {new Date(
                                        course.schedule
                                    ).toLocaleTimeString()}
                                </p>
                            </div>
                            <EnrollmentForm
                                courseId={course.id}
                                studentId={session?.user?.id as string}
                                enrollInCourse={async (formData: FormData) => {
                                    "use server";
                                    await enrollInCourse(formData);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

async function EnrollmentHistory() {
    const session = await auth();
    const enrollments = await getStudentEnrollments(
        session?.user?.id as string
    );

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
                <Card
                    key={enrollment.id}
                    className="hover:shadow-lg transition-shadow"
                >
                    <CardHeader>
                        <CardTitle>{enrollment.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                {enrollment.description}
                            </p>
                            <div className="text-sm">
                                <p>
                                    <strong>Instrument :</strong>
                                    {enrollment.instrument}
                                </p>
                                <p>
                                    <strong>Professeur :</strong>
                                    {enrollment.teacherName}
                                </p>
                                <p>
                                    <strong>Niveau :</strong>
                                    {enrollment.level}
                                </p>
                                <p>
                                    <strong>Date :</strong>
                                    {new Date(
                                        enrollment.schedule
                                    ).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Statut :</strong>
                                    {enrollment.enrollmentStatus}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default async function StudentCoursesPage() {
    return (
        <div className="space-y-8 p-4 md:p-8">
            <section>
                <h2 className="text-2xl font-bold mb-4">Cours Disponibles</h2>
                <Suspense
                    fallback={<div>Chargement des cours disponibles...</div>}
                >
                    <AvailableCourses />
                </Suspense>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">
                    Historique des Cours
                </h2>
                <Suspense
                    fallback={<div>Chargement de l&apos;historique...</div>}
                >
                    <EnrollmentHistory />
                </Suspense>
            </section>
        </div>
    );
}
