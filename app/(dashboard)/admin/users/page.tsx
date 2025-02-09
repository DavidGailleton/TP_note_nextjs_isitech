import { fetchUsersPages } from "@/app/lib/data";
import Pagination from "@/app/ui/admin/pagination";
import Search from "@/app/ui/admin/search";
import TableUsers from "@/app/ui/admin/table";
import { CreateUser } from "@/app/ui/components/button";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchUsersPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`text-2xl`}>Utilisateurs</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Chercher des utilisateurs..." />
                <CreateUser />
            </div>
            <TableUsers query={query} currentPage={currentPage} />

            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
