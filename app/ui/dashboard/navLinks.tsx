"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const links = [
    { name: "Courses", href: "/teacher/courses", role: ["teacher", "admin"] },
    { name: "Students", href: "/teacher/students", role: ["teacher", "admin"] },
    {
        name: "Evaluations",
        href: "/teacher/evaluations",
        role: ["teacher", "admin"],
    },
    { name: "Utilisateurs", href: "/admin/users", role: ["admin"] },
];

export default function NavLinks() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role;
    return (
        <>
            {links.map((link) => {
                if (userRole && link.role.includes(userRole)) {
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
                                {
                                    "bg-sky-100 text-blue-600":
                                        pathname === link.href,
                                }
                            )}
                        >
                            <p className="hidden md:block">{link.name}</p>
                        </Link>
                    );
                }
            })}
        </>
    );
}
