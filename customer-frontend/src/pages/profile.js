import { Profile } from 'components/Profile/Profile';
import { PublicLayout } from 'layout/PublicLayout';

const breadcrumbsData = [
  {
    label: 'Inicio',
    path: '/',
  },
  {
    label: 'Mi Perfil',
    path: '/profile',
  },
];
const ProfilePage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Mi Perfil'>
      <Profile />
    </PublicLayout>
  );
};

export default ProfilePage;
