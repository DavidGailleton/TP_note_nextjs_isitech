import {JSX} from "react";
import {fetchCourse, fetchTeachers} from "@/app/lib/data";
import Form from "next/form";
import {AddCourse, EditCourse} from "@/app/lib/actions";
import {Button} from "@/app/ui/components/button";

export async function EditCourseForm({ courseId }: { courseId: string }): Promise<JSX.Element> {
    const [course, teachers] = await Promise.all([
        fetchCourse(courseId),
        fetchTeachers()
    ]);

    const editCourseWithId = async (formData: FormData) => {
        'use server';
        await EditCourse(courseId, formData);
    };

    return (
        <form action={editCourseWithId}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        defaultValue={course.title}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        Description
                    </label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        defaultValue={course.description}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Instrument */}
                <div className="mb-4">
                    <label htmlFor="instrument" className="mb-2 block text-sm font-medium">
                        Instrument
                    </label>
                    <input
                        id="instrument"
                        name="instrument"
                        type="text"
                        defaultValue={course.instrument}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Teacher Select */}
                <div className="mb-4">
                    <label htmlFor="teacherId" className="mb-2 block text-sm font-medium">
                        Teacher
                    </label>
                    <select
                        id="teacherId"
                        name="teacherId"
                        defaultValue={course.teacherid}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        required
                    >
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Level */}
                <div className="mb-4">
                    <label htmlFor="level" className="mb-2 block text-sm font-medium">
                        Level
                    </label>
                    <input
                        id="level"
                        name="level"
                        type="text"
                        defaultValue={course.level}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Schedule */}
                <div className="mb-4">
                    <label htmlFor="schedule" className="mb-2 block text-sm font-medium">
                        Schedule
                    </label>
                    <input
                        id="schedule"
                        name="schedule"
                        type="datetime-local"
                        defaultValue={new Date(course.schedule).toLocaleString('sv-SE', { timeZone: 'Europe/Paris' }).slice(0, 16)}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Capacity */}
                <div className="mb-4">
                    <label htmlFor="capacity" className="mb-2 block text-sm font-medium">
                        Capacity
                    </label>
                    <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        defaultValue={course.capacity}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    );
}

export async function AddCourseForm(): Promise<JSX.Element> {
    const [teachers] = await Promise.all([
        fetchTeachers()
    ]);

    const addCourse = async (formData: FormData) => {
        'use server';
        await AddCourse(formData);
    };

    return (
        <form action={addCourse}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        Description
                    </label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Instrument */}
                <div className="mb-4">
                    <label htmlFor="instrument" className="mb-2 block text-sm font-medium">
                        Instrument
                    </label>
                    <input
                        id="instrument"
                        name="instrument"
                        type="text"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Teacher Select */}
                <div className="mb-4">
                    <label htmlFor="teacherId" className="mb-2 block text-sm font-medium">
                        Teacher
                    </label>
                    <select
                        id="teacherId"
                        name="teacherId"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                        required
                    >
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Level */}
                <div className="mb-4">
                    <label htmlFor="level" className="mb-2 block text-sm font-medium">
                        Level
                    </label>
                    <input
                        id="level"
                        name="level"
                        type="text"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Schedule */}
                <div className="mb-4">
                    <label htmlFor="schedule" className="mb-2 block text-sm font-medium">
                        Schedule
                    </label>
                    <input
                        id="schedule"
                        name="schedule"
                        type="datetime-local"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>

                {/* Capacity */}
                <div className="mb-4">
                    <label htmlFor="capacity" className="mb-2 block text-sm font-medium">
                        Capacity
                    </label>
                    <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">Add course</Button>
            </div>
        </form>
    );
}