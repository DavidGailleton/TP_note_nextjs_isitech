import {fetchCourses} from "@/app/lib/data";
import Link from "next/link";
import {Button} from "@/app/ui/components/button";
import {DeleteCourse} from "@/app/lib/actions";
import {MouseEventHandler} from "react";

export default async function Table() {
    const courses = await fetchCourses();

    return (
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Instrument</th>
                <th>Teacher</th>
                <th>Level</th>
                <th>Schedule</th>
                <th>Capacity</th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {courses?.map((course) => (
                <tr key={course.id} className="">
                    <td>{course.title}</td>
                    <td>{course.description.slice(0, 30)+" ..."}</td>
                    <td>{course.instrument}</td>
                    <td>{course.teachername}</td>
                    <td>{course.level}</td>
                    <td>{course.schedule.getFullYear()+"/"+course.schedule.getMonth()+"/"+course.schedule.getDay()+" - "+course.schedule.getHours()+":"+course.schedule.getMinutes()}</td>
                    <td>{course.capacity}</td>
                    <td><Link href={`/teacher/courses/${course.id}/edit`}>Edit</Link></td>
                    <td><form action={async () => {
                        'use server'
                        await DeleteCourse(course.id);
                    }}><Button type="submit" className="bg-red-600 hover:bg-red-900">Delete</Button></form></td>
                </tr>
            ))}
            </tbody>

        </table>
    );
}