import { PublicLayout } from "layout/PublicLayout";
import CustomCakeDesigner from "../components/CustomCakeDesigner/CustomCakeDesigner";

const CustomiseCakePage = () => {
  return (
    <PublicLayout style={{height: "80px"}} >
      <CustomCakeDesigner />
    </PublicLayout>
  );
};

export default CustomiseCakePage;
