import { Role } from '@/app/utils'
import UserProfilePage from '@/components/profilePage'

async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UserProfilePage id={id} viewerRole={Role.Manager} />;
}

export default ProfilePage