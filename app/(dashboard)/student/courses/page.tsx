import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StudentCoursesPage from "@/app/ui/courses/coursesEnrollements";

async function CoursesPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    return <StudentCoursesPage />;
}

export default CoursesPage;
