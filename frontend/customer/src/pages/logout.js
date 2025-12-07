import { PublicLayout } from "layout/PublicLayout";
import { Logout } from "components/Logout/Logout"

const breadcrumbsData = [
  {
    label: 'Inicio',
    path: '/',
  },
  {
    label: "Cerrar Sesión",
    path: "/logout",
  },
];

const LogoutPage =() =>{
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Cerrar Sesión">
      <Logout />
    </PublicLayout>
  );
};

export default LogoutPage;