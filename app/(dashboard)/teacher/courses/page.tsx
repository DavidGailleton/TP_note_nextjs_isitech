import Table from "@/app/ui/courses/table";
import {Button} from "@/app/ui/components/button";
import {redirect} from "next/navigation";
import Link from "next/link";

export default function Page() {
    return(
        <div>
            <Link href="/teacher/courses/add" className="rounded-md border p-2 hover:bg-gray-100">Add</Link>
            <Table/>
        </div>
    )
}