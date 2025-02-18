"use client";
import {useActionState, useEffect} from "react";
import { submitEvaluation, ProgressState } from "@/app/lib/actions";
import { Student, courseTable } from "@/app/lib/definitions";
import { Button } from "@/app/ui/components/button";

export function EvaluationForm({
                                   students,
                                   courses,
                                   courseId
                               }: {
    students: Student[];
    courses: courseTable[];
    courseId?: string;
}) {
    const initialState: ProgressState = { message: null };
    const [state, formAction] = useActionState(submitEvaluation, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Sélection de l'étudiant */}
                <div className="mb-4">
                    <label htmlFor="studentId" className="mb-2 block text-sm font-medium">
                        Étudiant
                    </label>
                    <select
                        id="studentId"
                        name="studentId"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        required
                    >
                        <option value="">Sélectionner un étudiant</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                    {state.errors?.studentId && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.studentId[0]}</p>
                    )}
                </div>

                {/* Sélection du cours */}
                <div className="mb-4">
                    <label htmlFor="courseId" className="mb-2 block text-sm font-medium">
                        Cours
                    </label>
                    <select
                        id="courseId"
                        name="courseId"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        defaultValue={courseId || ""}
                        required
                    >
                        <option value="">Sélectionner un cours</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                    {state.errors?.courseId && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.courseId[0]}</p>
                    )}
                </div>

                {/* Évaluation */}
                <div className="mb-4">
                    <label htmlFor="evaluation" className="mb-2 block text-sm font-medium">
                        Évaluation
                    </label>
                    <select
                        id="evaluation"
                        name="evaluation"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        required
                    >
                        <option value="">Sélectionner une évaluation</option>
                        <option value="A">A - Excellent</option>
                        <option value="B">B - Très bien</option>
                        <option value="C">C - Bien</option>
                        <option value="D">D - Satisfaisant</option>
                        <option value="E">E - Insuffisant</option>
                        <option value="F">F - Échec</option>
                    </select>
                    {state.errors?.evaluation && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.evaluation[0]}</p>
                    )}
                </div>

                {/* Commentaires */}
                <div className="mb-4">
                    <label htmlFor="comments" className="mb-2 block text-sm font-medium">
                        Commentaires
                    </label>
                    <textarea
                        id="comments"
                        name="comments"
                        rows={4}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>
            </div>

            {state.message && state.message !== 'success' && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            {state.message === 'success' && (
                <p className="text-sm text-green-500">Évaluation soumise avec succès!</p>
            )}

            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">Soumettre l'évaluation</Button>
            </div>
        </form>
    );
}