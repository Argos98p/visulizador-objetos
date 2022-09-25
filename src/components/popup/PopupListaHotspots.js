import React, {memo, useState,useEffect} from "react";
import Popup from "reactjs-popup";
import {FaCrosshairs, FaTrash} from "react-icons/fa/index.js";
import "./PopupListaHotspotsStyle.css"
import {MdOutlineCancel} from "react-icons/md";

    const PopupListaHotspot =memo(({listaHotspots,onClickDeleteHotspot})=>{

    function handleDeleteHotspot(itemObject){
        onClickDeleteHotspot(itemObject.item);
    }

    function handleListaHotspots(){
        if(listaHotspots.length===0){
            return (<h6>No se encontron hotspots</h6>);
        }
        if(listaHotspots){
            let nombresHotspots=[]
            const unique = [...new Set(listaHotspots.map(item => item.nombreHotspot))];
            nombresHotspots=nombresHotspots.concat(unique);
            return nombresHotspots.map((item) => {
                return (
                    <div key={item} className="item-hotspots">
                        <img className="button-delete-hotspot" onClick={()=>handleDeleteHotspot({item})} src="../iconos/eliminar-hotspot.png" alt=""/>

                        <img  src="../iconos/lista_hotspot.png" alt=""/>

                        <h6 className="nombre-hotspot">{item}</h6>
                    </div>
                );
            });

            //return null

        }
        return (<h1>No se encontron hotspots</h1>);
    }

    return(
    <>
        <div className="container-lista-hotspots">
            {handleListaHotspots()}
        </div>


    </>);

})
export default PopupListaHotspot;