import React from "react";
import { useParams } from 'react-router-dom'
import { Visualizador } from "../visualizador/Visualizador";
import axios from 'axios'
import fileDownload from 'js-file-download'
function Controller(){
    let { objeto, escena } = useParams();
    //let url=`http://redpanda.sytes.net:8085/api/images/getimageszip?path=/${objeto}/${escena}/`
    let url=`http://redpanda.sytes.net:8085/api/images/getimage?path=/${objeto}/${escena}/frames/`
    
    let imagesList=[]

    for(var i=1;i<100;i++){
        imagesList.push(url+i+'.jpg')
    }
    
    
    
    return(
        <h4><Visualizador imagesList={imagesList}/></h4>
    );
}
export default Controller;