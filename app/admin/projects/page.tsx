import ProjectsList from "./projectList";

export default async function ProjectsListPage() {
    const data = await (await fetch(process.env.BASE_URL?.toString() + "/api/projects", { method: "GET" })).json();

    if (data.error) {
        return (
            <>
                <h2>Some Error Occured</h2>
                <p>{data.message}</p>
            </>
        );
    }
    return (
        <>
            <ProjectsList data={data.data} />
        </>
    );
}
