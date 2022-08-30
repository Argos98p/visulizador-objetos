import React, {useState} from "react";
import Popup from "reactjs-popup";
import {FaCrosshairs, FaTrash} from "react-icons/fa/index.js";
import "./PopupListaHotspotsStyle.css"
export default function PopupListaHotspot({listaHotspots,onClickDeleteHotspot}){

    const [open, setOpen] = useState(false);

    function tooglePopup(){
        setOpen(!open)
    }

    function handleDeleteHotspot(itemObject){
        onClickDeleteHotspot(itemObject.item);
    }

    function handleListaHotspots(){
        if(listaHotspots!==null || listaHotspots !== undefined){
            let nombresHotspots=[]
           for (let escena in listaHotspots){
               //console.log(listaHotspots[escena])
               const unique = [...new Set(listaHotspots[escena].map(item => item.nombreHotspot))];
               nombresHotspots=nombresHotspots.concat(unique);
           }
            return nombresHotspots.map((item) => {
                return (
                    <div key={item} className="item-hotspots">
                        <div className="icon-name">
                            <FaCrosshairs className="icon-hotspot"></FaCrosshairs> <h6>{item}</h6>
                        </div>
                        <button className="button-delete-hotspot" onClick={()=>handleDeleteHotspot({item})}><FaTrash></FaTrash></button>

                    </div>

                );
            });

        }
        return (<h1>No se encontron hotspots</h1>);
    }

    return(
    <>
        <button className="button-option" disabled={true} onClick={tooglePopup}>Lista de Hotspots</button>
        {
            open
                ? <div className="container-lista-hotspots">
                    {handleListaHotspots()}
                </div>
                : null
        }

    </>);

}