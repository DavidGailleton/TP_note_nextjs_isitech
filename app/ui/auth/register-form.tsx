"use client";
import { text } from "@/app/ui/fonts";
import {
    ArrowRightIcon,
    AtSymbolIcon,
    ExclamationCircleIcon,
    KeyIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { RegisterRole, Role } from "@/app/lib/definitions";
import { Button } from "@/app/ui/components/button";
import { register } from "@/app/lib/actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterForm({ roles }: RegisterRole[]) {
    const [errorMessage, formAction, isPending] = useActionState(
        register,
        undefined
    );

    const searchParams = useSearchParams();

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${text.className} mb-3 text-2xl`}>
                    Inscription
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Nom
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                type="name"
                                name="name"
                                placeholder="Entrer le nom"
                                required
                                minLength={6}
                            />
                            <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Entrer l'adresse mail"
                                required
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Entrer le mot de passe"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirmer le mot de passe"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Sélectionner un rôle
                            </option>
                            {roles.map((role: Role) => (
                                <option key={role.role} value={role.role}>
                                    {role.role}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button className="mt-4 w-full" aria-disabled={isPending}>
                        Inscription{" "}
                        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </Button>

                    <div className="flex h-8 items-end space-x-1">
                        {errorMessage && (
                            <>
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                <p className="text-sm text-red-500">
                                    {errorMessage}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
