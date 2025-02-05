import {fetchCourses} from "@/app/lib/data";

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
                <tr key={course.id}>
                    <td>{course.title}</td>
                    <td>{course.description}</td>
                    <td>{course.instrument}</td>
                    <td>{course.teacherName}</td>
                    <td>{course.level}</td>
                    <td>{course.schedule}</td>
                    <td>{course.capacity}</td>
                    <td><button>Details</button></td>
                    <td><button>Edit</button></td>
                    <td><button>Delete</button></td>
                </tr>
            ))}
            </tbody>

        </table>
    );
}