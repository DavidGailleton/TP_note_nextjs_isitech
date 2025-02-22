import AuthProvider from "@/app/lib/AuthProvider";
import { auth } from "@/auth";
import "@/app/ui/globals.css";
import AuthRedirect from "@/app/lib/AuthRedirect";

export const metadata = {
    title: "MusiLearn",
    description: "Plateforme de gestion d'école de musique",
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
                <AuthProvider session={session}>
                    <AuthRedirect>{children}</AuthRedirect>
                </AuthProvider>
            </body>
        </html>
    );
}
