import { fetchCourses, fetchProgress, fetchStudents } from "@/app/lib/data";
import { EvaluationForm } from "@/app/ui/evalutations/EvaluationForm";
import EvaluationsTable from "@/app/ui/evalutations/EvaluationsTable";
import { auth } from "@/auth";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function Page() {
    const session = await auth();
    const teacherId = session?.user?.id || '';

    console.log(`Current teacher ID: ${teacherId}`);

    // Récupération des données
    const [evaluations, courses, students] = await Promise.all([
        fetchProgress(),
        fetchCourses(),
        fetchStudents()
    ]);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Évaluations des élèves</h1>
                <Link
                    href="/teacher/evaluations/new"
                    className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Nouvelle évaluation</span>
                </Link>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Évaluations récentes</h2>
                <EvaluationsTable evaluations={evaluations} />
            </div>
        </div>
    );
}