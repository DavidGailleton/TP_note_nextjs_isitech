"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthRedirect = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            const role = session?.user?.role;

            switch (role) {
                case "teacher":
                    router.push("/teacher/courses");
                    break;
                case "student":
                    router.push("/student/courses");
                    break;
                case "admin":
                    router.push("/admin/users");
                    break;
                default:
                    router.push("/");
            }
        }
    }, [status, session, router]);

    return children;
};

export default AuthRedirect;
