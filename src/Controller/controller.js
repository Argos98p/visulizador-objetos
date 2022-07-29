import React, {useEffect, useState} from "react";
import {FaCarSide, FaTicketAlt} from "react-icons/fa/index.js";
import {useParams} from 'react-router-dom'
import {Visualizador} from "../visualizador/Visualizador";
import axios from 'axios'
import BounceLoader from "react-spinners/BounceLoader";
import { Alert } from "reactstrap";

function Controller() {
    let {id} = useParams();
    const [imagesLoaded, setImagesLoaded] = useState(true);
    let [color, setColor] = useState("#EBAF26");
    var escena=0;

    
    var url=`http://redpanda.sytes.net:8084/api/objects/geturlsimages?idobjeto=${id}`
    var urlFrames=`http://redpanda.sytes.net:8085/api/images/getimage?path=`
   

   
    var buttonsScenes = []
    let imagesFramesScenes = new Map();
    var scenesKeys=[]
    var limitFrames=100;

    
    const checkImage = path => new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(path)
        img.onerror = () => reject()
        img.src = path
    })

    useEffect(() => { 
        axios.get(url)
        .then(response => {
            if(response.data != null){
                response.data.forEach(e => {
                    var escena = e.split('/')[2]                    
                    var urlFrame = urlFrames+e
                    var framesPaths=[]                                    
                    for(var i = 0;i<=limitFrames;i++){
                        framesPaths.push(urlFrame+`/${i}.jpg`);
                    }
                    imagesFramesScenes.set(escena,framesPaths)
                    scenesKeys.push(escena)          
                      
                });
            }
        })
        .catch(error => {
            alert('pagina no encontrada')
            console.error('There was an error!', error);
        });

        
        /*

        Promise.all(imagesList.map(checkImage)).then(
            () => {
                setImagesLoaded(true);
                console.log('imagenes cargadas');
            }, () => console.error('could not load images'))*/

    }, []);

    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red"
    };

    
    return (
        !imagesLoaded
        ?<div className="contenedor">
        <div>
            <BounceLoader color={color}
                loading={!imagesLoaded}
                cssOverride={override}
                size={80}/>
        </div>

    </div>
        :<h4><Visualizador imagesFramesScenes={imagesFramesScenes} scenesKeys={scenesKeys}
                /></h4>
    );
}
export default Controller;
