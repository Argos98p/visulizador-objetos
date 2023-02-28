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
        className="popup-compartir_container"
        onClose={()=>{navigate(-1)}}
        open={true}
        modal
        nested >
        <div className="popup-ayuda-relative">
            <h1>hola</h1>
        </div>

    </Popup>
}
export default AyudaPopup;