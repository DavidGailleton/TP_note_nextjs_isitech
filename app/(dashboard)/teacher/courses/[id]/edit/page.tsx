import { EditCourseForm } from "@/app/ui/courses/CourseForm";

export default async function Page({
                                       params,
                                   }: {
    params: { id: string }
}) {
    const courseId = await Promise.resolve(params.id);

    return (
        <main>
            <EditCourseForm courseId={courseId} />
        </main>
    );
}