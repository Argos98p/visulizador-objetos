import Popup from "reactjs-popup";
import {MdClose} from "react-icons/md";
import {
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton, TelegramIcon, TelegramShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import React from "react";
import {useNavigate} from "react-router-dom";

const AyudaPopup=()=>{
    const navigate = useNavigate();
     return <Popup
        className="popup-ayuda_container"
        onClose={()=>{navigate(-1)}}
        open={true}
        modal
        nested >
        <div className="popup-ayuda-relative">
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div className={"my-ayuda-container"}>
                    <div className={"ayuda-row"}>
                        <p>Haga click o toque la pantalla y arrastre para mirar el auto en 3d</p>
                        <img src={"/hand.png"}/>

                    </div>
                    <div className={"ayuda-row"}>
                        <p>Toque los hotspots para ver mas información del auto</p>
                        <img src={"/hand1.png"}/>

                    </div>
                    <div className={"ayuda-row"}>

                        <p>Utilize la rueda del mouse o un gesto con dos dedos para acercar y alejar</p>
                        <img src={"/zoom-in.png"}/>

                    </div>
                </div>
                <button className={"mi-boton"} onClick={()=>{navigate(-1)}} style={{width:"100px"}}>Cerrar</button>

            </div>


        </div>

    </Popup>
}
export default AyudaPopup;