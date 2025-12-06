import { Login } from "components/Login/Login";
import { Subscribe } from "components/shared/Subscribe/Subscribe";
import { PublicLayout } from "layout/PublicLayout";

const breadcrumbsData = [
  {
    label: "Inicio",
    path: "/",
  },
  {
    label: "Iniciar Sesión",
    path: "/login",
  },
];
const LoginPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Iniciar Sesión">
      <Login />
    </PublicLayout>
  );
};

export default LoginPage;
