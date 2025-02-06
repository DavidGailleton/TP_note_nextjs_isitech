import {fetchCourses} from "@/app/lib/data";
import Link from "next/link";

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
                <th>Details</th>
                <th>Edit</th>
                <th>Delete</th>
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
                    <td>{course.schedule.getFullYear()+"/"+course.schedule.getMonth()}</td>
                    <td>{course.capacity}</td>
                    <td><button>Details</button></td>
                    <td><Link href={`/teacher/courses/${course.id}/edit`}>Edit</Link></td>
                    <td><button>Delete</button></td>
                </tr>
            ))}
            </tbody>

        </table>
    );
}