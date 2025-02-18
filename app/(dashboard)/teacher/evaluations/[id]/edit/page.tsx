import { fetchProgressById } from "@/app/lib/data";
import EditEvaluationForm from "@/app/ui/evalutations/EditEvaluationForm";
import Breadcrumbs from "@/app/ui/components/breadcrumbs";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const evaluation = await fetchProgressById(id);

    if (!evaluation) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Évaluations", href: "/teacher/evaluations" },
                    {
                        label: "Modifier l'évaluation",
                        href: `/teacher/evaluations/${id}/edit`,
                        active: true,
                    },
                ]}
            />

            <h1 className="text-2xl mb-8">Modifier l'évaluation</h1>

            <EditEvaluationForm evaluation={evaluation} />
        </main>
    );
}