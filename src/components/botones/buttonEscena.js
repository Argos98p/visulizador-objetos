
import {FaCarSide } from "react-icons/fa/index.js";
import ReactTooltip from "react-tooltip";
import {memo} from "react";

const ButtonEscena = memo(({escenaInfo, onClick , activo})=>{


    let icono =null;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent)

    switch (escenaInfo[1].nombre) {
        case "puertas_cerradas":
            icono=<img src="/iconos/carro-cerrado.png" alt=""/>
            break;
        case "puertas_abiertas":
            icono = <img src="/iconos/carro-abierto.png" alt=""/>
            break;

        case "interior":
            icono = <img src="/iconos/interior-carro.png" alt=""/>
            break;
        default:
            icono = <FaCarSide></FaCarSide>
            break;
    }
    return <div className="button-escena_navigation-item">
    <button  data-for='soclose2' data-tip={escenaInfo[1].nombre}  className={`button-escena-btn ${activo ? "activo":""}`} onClick={()=>onClick(escenaInfo)}>
      {icono}
    </button>
    <ReactTooltip id="soclose2" place="right" disable={isMobile} effect="solid" getContent={(dataTip=>dataTip)}>
    </ReactTooltip>
  </div>
}
)
export default ButtonEscena;