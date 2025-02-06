import AuthProvider from "@/app/lib/AuthProvider";
import { auth } from "@/auth";
import "@/app/ui/globals.css";

export const metadata = {
    title: "Mon Application",
    description: "Description de mon application",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <html lang="fr">
            <body>
                <AuthProvider session={session}>{children}</AuthProvider>
            </body>
        </html>
    );
}
