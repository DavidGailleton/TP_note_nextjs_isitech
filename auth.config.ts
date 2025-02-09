import type { NextAuthConfig } from "next-auth";
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicPath = nextUrl.pathname.startsWith("/login");

            if (isPublicPath) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            }

            return isLoggedIn;
        },
    },

    providers: [],
} satisfies NextAuthConfig;
