import { role_enum } from '@/app/generated/prisma/enums';
import UserProfilePage from '@/components/profilePage'

async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UserProfilePage id={id} viewerRole={role_enum.manager} />;
}

export default ProfilePage