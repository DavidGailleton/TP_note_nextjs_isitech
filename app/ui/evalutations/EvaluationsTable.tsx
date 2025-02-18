import { Progress } from "@/app/lib/definitions";
import { deleteEvaluation } from "@/app/lib/actions";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/components/button";

export default function EvaluationsTable({evaluations}: {evaluations: Progress[]}) {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-gray-900">
                    <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-4 py-5 font-medium">Étudiant</th>
                        <th scope="col" className="px-3 py-5 font-medium">Cours</th>
                        <th scope="col" className="px-3 py-5 font-medium">Date</th>
                        <th scope="col" className="px-3 py-5 font-medium">Évaluation</th>
                        <th scope="col" className="px-3 py-5 font-medium">Commentaires</th>
                        <th scope="col" className="relative py-3 pl-6 pr-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {evaluations.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-4 text-center text-gray-500">
                                Aucune évaluation trouvée
                            </td>
                        </tr>
                    ) : (
                        evaluations.map((evaluation) => (
                            <tr key={evaluation.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                                <td className="whitespace-nowrap px-3 py-3">
                                    {evaluation.studentname}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {evaluation.coursename}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {new Date(evaluation.date).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                    <span className={`inline-flex items-center rounded-md ${getEvaluationColor(evaluation.evaluation)} px-2 py-1 text-xs font-medium`}>
                      {evaluation.evaluation}
                    </span>
                                </td>
                                <td className="px-3 py-3 max-w-xs truncate">
                                    {evaluation.comments}
                                </td>
                                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                            href={`/teacher/evaluations/${evaluation.id}/edit`}
                                            className="rounded-md border p-2 hover:bg-gray-100"
                                        >
                                            <PencilIcon className="w-5" />
                                        </Link>
                                        <form action={async () => {
                                            'use server'
                                            await deleteEvaluation(evaluation.id);
                                        }}>
                                            <Button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
                                                <TrashIcon className="w-5" />
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function getEvaluationColor(evaluation: string) {
    switch (evaluation) {
        case 'A':
            return 'bg-green-100 text-green-800';
        case 'B':
            return 'bg-green-50 text-green-700';
        case 'C':
            return 'bg-blue-100 text-blue-800';
        case 'D':
            return 'bg-yellow-100 text-yellow-800';
        case 'E':
            return 'bg-orange-100 text-orange-800';
        case 'F':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}