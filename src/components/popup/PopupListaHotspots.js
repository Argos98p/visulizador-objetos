import React, {memo, useState,useEffect} from "react";
import Popup from "reactjs-popup";
import {FaCrosshairs, FaTrash} from "react-icons/fa/index.js";
import "./PopupListaHotspotsStyle.css"

    const PopupListaHotspot =memo(({listaHotspots,onClickDeleteHotspot})=>{

    const [open, setOpen] = useState(false);

        useEffect(() => {
            console.log('render lista')
        });


    function tooglePopup(){
        setOpen(!open)
    }

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
                        <div className="icon-name">
                            <FaCrosshairs className="icon-hotspot"></FaCrosshairs> <h6>{item}</h6>
                        </div>{
                        <button className="button-delete-hotspot" onClick={()=>handleDeleteHotspot({item})}><FaTrash></FaTrash></button>
                    }
                    </div>
                );
            });

            //return null

        }
        return (<h1>No se encontron hotspots</h1>);
    }

    return(
    <>
        <button className="button-option"  onClick={tooglePopup}>Lista de Hotspots</button>
        {
            open
                ? <div className="container-lista-hotspots">
                    {handleListaHotspots()}
                </div>
                : null
        }

    </>);

})
export default PopupListaHotspot;