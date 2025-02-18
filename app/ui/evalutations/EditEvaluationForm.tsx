"use client";
import { useEffect, useActionState } from "react";
import { updateEvaluation, ProgressState } from "@/app/lib/actions";
import { Progress } from "@/app/lib/definitions";
import { Button } from "@/app/ui/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditEvaluationForm({ evaluation }: { evaluation: Progress }) {
    const router = useRouter();
    const updateEvaluationWithId = updateEvaluation.bind(null, evaluation.id);
    const initialState: ProgressState = { message: null };
    const [state, formAction] = useActionState(updateEvaluationWithId, initialState);

    useEffect(() => {
        if (state?.message === 'success') {
            router.push('/teacher/evaluations');
        }
    }, [state, router]);

    return (
        <form action={formAction} className="space-y-6">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Informations de l'évaluation (non modifiables) */}
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium">Étudiant</label>
                        <div className="mt-1 p-2 bg-gray-100 rounded-md">
                            {evaluation.studentname}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Cours</label>
                        <div className="mt-1 p-2 bg-gray-100 rounded-md">
                            {evaluation.coursename}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <div className="mt-1 p-2 bg-gray-100 rounded-md">
                            {new Date(evaluation.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Évaluation (modifiable) */}
                <div className="mb-4">
                    <label htmlFor="evaluation" className="mb-2 block text-sm font-medium">
                        Évaluation
                    </label>
                    <select
                        id="evaluation"
                        name="evaluation"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        defaultValue={evaluation.evaluation}
                        required
                    >
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

                {/* Commentaires (modifiables) */}
                <div className="mb-4">
                    <label htmlFor="comments" className="mb-2 block text-sm font-medium">
                        Commentaires
                    </label>
                    <textarea
                        id="comments"
                        name="comments"
                        rows={4}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        defaultValue={evaluation.comments}
                    />
                </div>
            </div>

            {state.message && state.message !== 'success' && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/teacher/evaluations"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Annuler
                </Link>
                <Button type="submit">Enregistrer les modifications</Button>
            </div>
        </form>
    );
}