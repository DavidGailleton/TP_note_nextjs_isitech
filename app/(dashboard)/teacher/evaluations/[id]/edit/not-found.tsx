import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2">
            <FaceFrownIcon className="w-10 text-gray-400" />
            <h2 className="text-xl font-semibold">Évaluation introuvable</h2>
            <p>L'évaluation demandée n'existe pas ou vous n'avez pas les permissions pour y accéder.</p>
            <Link
                href="/teacher/evaluations"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
                Retour aux évaluations
            </Link>
        </main>
    );
}