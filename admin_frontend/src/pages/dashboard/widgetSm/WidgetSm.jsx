import "./widgetSm.css";
import { Visibility } from "@mui/icons-material";
import {useGetAllCustomersQuery} from '../../../services/userCRUDApi'
import userAfatar from '../../../images/femaleAfatar.png'
import { useNavigate } from 'react-router-dom'



export default function WidgetSm() {
  const { data, isSuccess , isLoading} = useGetAllCustomersQuery()
  const navigate = useNavigate();
  let arr = [];

  const handleDisplay = (props) => {
    navigate(`/admin/customer/edit/${props}`);
  };
  
  if(isLoading) return <div>Loading.....</div>
  if(isSuccess){
    arr = data.slice(-5);
  }
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">Nuevos Clientes</span>
      <div className="widgetSmListItem">  
          <div className="widgetSmUser">
            <span className="widgetSmUsername">ID de Cliente</span>
          </div>
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Nombre</span> 
          </div>
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Teléfono </span>
          </div>
          <div className="widgetSmUser">
            <span className="widgetSmUsername">Acción</span>
          </div>
      </div> 
      <div className="widgetSmList">
        {arr.map((user, index)=>(
          <div key={index} className="widgetSmListItem">
          <div className="widgetSmUser">
            <img src={userAfatar} alt="" className="widgetSmImg"/>
            <span className="widgetSmUserTitle">{user.id}</span>
          </div>
          <div className="widgetSmUser">
            <span className="widgetSmUserTitle">{user.first_Name} {" "}  {user.last_Name}</span> 
          </div>
          <div className="widgetSmUser">
            <span className="widgetSmUserTitle">{" "}{user.phone_Number}</span>
          </div>
          <button className="widgetSmButton" onClick={() => handleDisplay(user.id)}>
            <Visibility className="widgetSmIcon"  />
            Ver
          </button>
        </div>
        ))}    
      </div>
    </div>
  );
}
