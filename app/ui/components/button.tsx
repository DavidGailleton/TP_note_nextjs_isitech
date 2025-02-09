import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { deleteUserById } from "@/app/lib/actions";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className={clsx(
                "flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                className
            )}
        >
            {children}
        </button>
    );
}

export function UpdateUser({ id }: { id: string }) {
    return (
        <Link
            href={`/admin/users/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}
export function DeleteUser({ id }: { id: string }) {
    const deleteUserWithId = deleteUserById.bind(null, id);

    return (
        <>
            <form action={deleteUserWithId}>
                <button
                    type="submit"
                    className="rounded-md border p-2 hover:bg-gray-100"
                >
                    <span className="sr-only">Delete</span>
                    <TrashIcon className="w-5" />
                </button>
            </form>
        </>
    );
}

export function CreateUser() {
    return (
        <Link
            href="/register"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Ajouter un utilisateur</span>{" "}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}
