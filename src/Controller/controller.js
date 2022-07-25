import React from "react";
import { useParams } from 'react-router-dom'
import { Visualizador } from "../visualizador/Visualizador";
import axios from 'axios'
import fileDownload from 'js-file-download'
function Controller(){
    let { objeto, escena } = useParams();
    let url=`http://redpanda.sytes.net:8085/api/images/getimageszip?path=/${objeto}/${escena}/`
    
    let filename='imagenes'
    
    var handleDownload = (url) => {
        console.log('entra');
        axios({
            url: url, //your url
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            fileDownload(response.data, 'lol.zip');
        });
      }
    
      handleDownload(url);
      

    return(
        <h4><Visualizador/></h4>
    );
}
export default Controller;