import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
    callbacks: {
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnPublicPage = ["/login", "/register"].includes(
                nextUrl.pathname
            );

            const isAuthenticating = nextUrl.searchParams.has("authenticating");

            if (isAuthenticating) {
                return true;
            }

            if (isOnPublicPage && isLoggedIn) {
                return Response.redirect(new URL("/", nextUrl));
            }
            if (!isOnPublicPage && !isLoggedIn) {
                return Response.redirect(new URL("/login", nextUrl));
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
