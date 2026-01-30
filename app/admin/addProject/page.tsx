import { getAllUsers } from "@/app/actions/users/Users";

import AddProjectForm from "./add-project-form";
import { role_enum } from "@/app/generated/prisma/enums";

export default async function AddProjectPage() {
  const users = await getAllUsers();
  const managers = users.filter((user) => user.role === role_enum.manager);
  const members = users.filter((user) => user.role === role_enum.member);

  return (
    <>
      <AddProjectForm managers={managers} members={members} />
    </>
  );
}
