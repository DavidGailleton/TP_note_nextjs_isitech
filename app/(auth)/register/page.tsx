import RegisterForm from "@/app/ui/auth/register-form";
import { fetchRoles } from "@/app/lib/data";
import { Suspense } from "react";

export default async function RegisterPage() {
    const roles = await fetchRoles();
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <Suspense>
                    <RegisterForm roles={roles} />
                </Suspense>
            </div>
        </main>
    );
}
