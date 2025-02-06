import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";

export default NextAuth(authConfig).auth;
// export async function middleware(request: NextRequest) {
//     const session = await auth();

//     if (request.nextUrl.pathname.startsWith("/admin")) {
//         if (session?.user?.role !== "admin") {
//             return NextResponse.redirect(new URL("/", request.url));
//         }
//     }

//     return NextResponse.next();
// }
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
