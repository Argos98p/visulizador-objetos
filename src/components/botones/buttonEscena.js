import { GiSteeringWheel, GiCarDoor } from "react-icons/gi/index.js";
import {FaCarSide } from "react-icons/fa/index.js";
import ReactTooltip from "react-tooltip";
import {useEffect,memo} from "react";

const ButtonEscena = memo(({escenaInfo, onClick , activo})=>{


    let icono =null;


    switch (escenaInfo[1].nombre) {
        case "puertas_cerradas":
            icono=<img src="../iconos/carro-cerrado.png" alt=""/>
            break;
        case "puertas_abiertas":
            icono = <img src="../iconos/carro-abierto.png" alt=""/>
            break;

        case "interior":
            icono = <img src="../iconos/interior-carro.png" alt=""/>
            break;
        default:
            icono = <FaCarSide></FaCarSide>
            break;
    }
    return <div className="button-escena_navigation-item">
    <button  data-for='soclose' data-tip={escenaInfo[1].nombre}  className={`button-escena-btn ${activo ? "activo":""}`} onClick={()=>onClick(escenaInfo)}>
      {icono}
    </button>
    <ReactTooltip id="soclose" place="top" effect="solid" getContent={(dataTip=>dataTip)}>
    </ReactTooltip>
  </div>
}
)
export default ButtonEscena;