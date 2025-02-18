import { fetchCourses, fetchStudents } from "@/app/lib/data";
import { EvaluationForm } from "@/app/ui/evalutations/EvaluationForm";
import Breadcrumbs from "@/app/ui/components/breadcrumbs";

export default async function Page() {
    // Récupération des données
    const [courses, students] = await Promise.all([
        fetchCourses(),
        fetchStudents()
    ]);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Évaluations", href: "/teacher/evaluations" },
                    {
                        label: "Nouvelle évaluation",
                        href: "/teacher/evaluations/new",
                        active: true,
                    },
                ]}
            />

            <h1 className="text-2xl mb-8">Soumettre une nouvelle évaluation</h1>

            <EvaluationForm
                students={students}
                courses={courses}
            />
        </main>
    );
}