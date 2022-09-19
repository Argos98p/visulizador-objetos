import Popup from 'reactjs-popup';
import React from "react";
import "./popupInfoObject.css";
const PopupInfoObjetct = ({infoObjectData, handleOpenModalInfoObject, openModalInfoObject}) => {
    const handleInfo = ()=>{
        if(infoObjectData !== undefined){
            let info = infoObjectData.split(",");
            return  <Popup
                onClose={()=>handleOpenModalInfoObject()}
                open={openModalInfoObject}
                modal
                nested >
                <div className="popup-info-object">
                    <p>Modelo: {info[0]} </p>
                    <p>Anio: {info[1]} </p>
                    <p>Kilometraje: {info[2]}</p>
                    <p>MetricaKilometraje: {info[3]}</p>
                    <p> Ciudad: {info[4]}</p>
                    <p>Placas: {info[5]}</p>
                    <p>Precio: {info[6]}</p>
                    <p>MetricaPrecio: {info[7]}</p>
                    <p>Descripcion: {info[8]}</p>
                    <p>Propietario: {info[10]}</p>
                    <button className={"button-option"} onClick={()=>handleOpenModalInfoObject()}>Cerrar</button>
                </div>

            </Popup>
        }
        return "";
    }
    return( handleInfo() );
}
export default PopupInfoObjetct;