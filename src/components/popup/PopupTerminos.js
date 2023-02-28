import {useNavigate} from "react-router-dom";
import Popup from "reactjs-popup";
import React from "react";

const PopupTerminos =()=>{
    const navigate = useNavigate();
    return <Popup
        className="popup-compartir_container"
        onClose={()=>{navigate(-1)}}
        open={true}
        modal
        nested >
        <div className="popup-terminos-relative">
            <h1>hola</h1>
        </div>

    </Popup>
}
export default PopupTerminos;
