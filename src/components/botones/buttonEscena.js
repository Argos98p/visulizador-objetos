import { GiSteeringWheel, GiCarDoor } from "react-icons/gi/index.js";
import {FaCarSide } from "react-icons/fa/index.js";
import ReactTooltip from "react-tooltip";
import {useEffect,memo} from "react";

const ButtonEscena = memo(({escenaInfo, onClick , activo})=>{

    useEffect(() => {
        console.log('render buttonEscena')
    }, );

    let icono =null;

    switch (escenaInfo[1].nombre) {
        case "puertas_cerradas":
            icono=<FaCarSide></FaCarSide>
            break;
        case "puertas_abiertas":
            icono = <GiCarDoor></GiCarDoor>
            break;

        case "interior":
            icono = <GiSteeringWheel></GiSteeringWheel>
            break;
        default:
            icono = <FaCarSide></FaCarSide>
            break;
    }


    return <div className="navigation-item">
    <button  data-for='soclose' data-tip={escenaInfo[1].nombre}  className={`semi-transparent-button ${activo ? "activo":""}`} onClick={()=>onClick(escenaInfo)}>
      {icono}
    </button>
    <ReactTooltip id="soclose" place="top" effect="solid" getContent={(dataTip=>dataTip)}>
    </ReactTooltip>
  </div>
}
)
export default ButtonEscena;