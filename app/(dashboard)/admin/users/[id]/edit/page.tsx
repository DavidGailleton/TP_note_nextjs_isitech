import Form from "@/app/ui/admin/edit-user-form";
import Breadcrumbs from "@/app/ui/components/breadcrumbs";
import { fetchUserById, fetchRoles } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [user, roles] = await Promise.all([fetchUserById(id), fetchRoles()]);
    if (!user) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Utilisateur", href: "/admin/users" },
                    {
                        label: "Modifier l'utilisateur",
                        href: `/admin/users/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form user={user} roles={roles} />
        </main>
    );
}
