"use client";
import { useActionState } from "react";
import { updateUserById, State } from "@/app/lib/actions";
import { User, Role, RegisterRole } from "@/app/lib/definitions";
import {
    AtSymbolIcon,
    UserIcon,
    UserCircleIcon,
    KeyIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/components/button";

export default function EditUserForm({
    user,
    roles,
}: {
    user: User;
    roles: RegisterRole[];
}) {
    const updateUserWithId = updateUserById.bind(null, user.id);
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(updateUserWithId, initialState);

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Nom
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={user.name}
                                placeholder="Entrer un nom"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                required
                            />
                            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium"
                    >
                        Nouveau mot de passe (optionnel)
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Laisser vide pour conserver l'ancien"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-medium"
                    >
                        Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Laisser vide pour conserver l'ancien"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Sélection du rôle */}
                <div className="mb-4">
                    <label
                        htmlFor="role"
                        className="mb-2 block text-sm font-medium"
                    >
                        Choisir un rôle
                    </label>
                    <div className="relative">
                        <select
                            id="role"
                            name="role"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue={user.role}
                            required
                        >
                            <option value="" disabled>
                                Sélectionner un rôle
                            </option>
                            {roles[0].roles.map((role: Role) => (
                                <option key={role.role} value={role.role}>
                                    {role.role}
                                </option>
                            ))}
                        </select>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Message d'état */}
            {state?.message && (
                <div className="mt-2 text-sm text-red-500">{state.message}</div>
            )}

            {/* Boutons */}
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/admin/users"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Annuler
                </Link>
                <Button type="submit">Modifier l'utilisateur</Button>
            </div>
        </form>
    );
}
