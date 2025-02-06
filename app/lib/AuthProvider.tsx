"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function AuthProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: any;
}) {
    useEffect(() => {
        function handleStorageChange(event: StorageEvent) {
            if (event.key === "nextauth.message") {
                window.location.reload();
            }
        }

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <SessionProvider session={session} refetchInterval={0}>
            {children}
        </SessionProvider>
    );
}
