import { fetchProgressByStudent } from "@/app/lib/data";
import ProgressTable from "@/app/ui/student/ProgressTable";
import { auth } from "@/auth";
import {Progress} from "@/app/lib/definitions";

export default async function Page() {
    const session = await auth();
    const studentId = session?.user?.id || '';

    // Récupération des évaluations de l'étudiant
    const evaluations = await fetchProgressByStudent(studentId);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Mes Évaluations</h1>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Historique des évaluations</h2>
                <ProgressTable evaluations={evaluations} />
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-medium mb-4">Statistiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getStatisticsCards(evaluations)}
                </div>
            </div>
        </div>
    );
}

function getStatisticsCards(evaluations: Progress[]) {
    // Calcule le nombre d'évaluations par note
    const evalCounts = evaluations.reduce((acc, curr) => {
        acc[curr.evaluation] = (acc[curr.evaluation] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Détermine la note moyenne (en convertissant les lettres en points)
    const evalPoints: Record<string, number> = {
        'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1, 'F': 0
    };

    let totalPoints = 0;
    let count = 0;
    evaluations.forEach(evaluation => {
        if (evalPoints[evaluation.evaluation] !== undefined) {
            totalPoints += evalPoints[evaluation.evaluation];
            count++;
        }
    });

    const averagePoints = count > 0 ? totalPoints / count : 0;

    // Conversion des points en lettre
    let averageLetter = 'N/A';
    if (count > 0) {
        if (averagePoints >= 4.5) averageLetter = 'A';
        else if (averagePoints >= 3.5) averageLetter = 'B';
        else if (averagePoints >= 2.5) averageLetter = 'C';
        else if (averagePoints >= 1.5) averageLetter = 'D';
        else if (averagePoints >= 0.5) averageLetter = 'E';
        else averageLetter = 'F';
    }

    return [
        <div key="total" className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Nombre total d'évaluations</h3>
            <p className="text-3xl font-bold">{evaluations.length}</p>
        </div>,
        <div key="average" className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Note moyenne</h3>
            <p className="text-3xl font-bold">{averageLetter}</p>
            <p className="text-sm text-gray-500">({averagePoints.toFixed(1)} points)</p>
        </div>,
        <div key="recent" className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-gray-500">Dernière évaluation</h3>
            {evaluations.length > 0 ? (
                <>
                    <p className="text-3xl font-bold">{evaluations[0].evaluation}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(evaluations[0].date).toLocaleDateString()}
                    </p>
                </>
            ) : (
                <p className="text-lg">Aucune évaluation</p>
            )}
        </div>
    ];
}