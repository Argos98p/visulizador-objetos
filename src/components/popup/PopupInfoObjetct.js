import Popup from 'reactjs-popup';
import React from "react";
import "./popupInfoObject.css";
import {FaUserCircle} from "react-icons/fa";
import {MdCancel} from "react-icons/md";
const PopupInfoObjetct = ({ imgForInfoModal, infoObjectData, handleOpenModalInfoObject, openModalInfoObject}) => {
    const handleInfo = ()=>{
        if(infoObjectData !== undefined){
            let info = infoObjectData.split(",");
            return  <Popup className="popup-info-container"
                onClose={()=>handleOpenModalInfoObject()}
                open={openModalInfoObject}
                modal
                nested >

                <div className={"popup-info-div-container"}>

                <div className="popup-info-der">
                    <div className="info-content">
                        <div className="info-content-title">
                            <div className="titulo-precio-container">
                                <p className="titulo">Vehiculo -  {info[0]} del {info[1]}</p>
                                <p>{info[0]}-Nuevo</p>
                            </div>
                            <div>
                                <p className="precio">USD {info[7]}{info[6]}</p>
                                <p className="user">{info[10] !== "" ? info[10] :"3DMotor's "}  <FaUserCircle className={"icon"}></FaUserCircle></p>
                            </div>

                        </div>
                        <div>
                            <p><b>Nota adicional</b></p>
                            <p>{info[8]}</p>

                        </div>
                    </div>
                </div>
                <div className="popup-info-izq">
                    <img  src= {imgForInfoModal} alt="MDN"/>
                </div>

                {
                /*
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
                </div>*/}
                </div>
                <div className={"button-container"}>
                    <MdCancel className={"button"} fontSize={54} onClick={()=>handleOpenModalInfoObject()}/>

                </div>

            </Popup>
        }
        return "";
    }
    return( handleInfo() );
}
export default PopupInfoObjetct;