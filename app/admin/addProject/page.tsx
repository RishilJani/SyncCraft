import { getAllUsers } from "@/app/actions/users/Users";
import { Role } from "@/app/utils";
import AddProjectForm from "./add-project-form";

export default async function AddProjectPage() {
  const users = await getAllUsers();
  const managers = users.filter((user) => user.role === Role.Manager);
  const members = users.filter((user) => user.role === Role.Member);

  return (
    <>
      <AddProjectForm managers={managers} members={members} />
    </>
  );
}
