import React, {useEffect}from "react";
import {
    FaCarSide,
    FaTicketAlt
} from "react-icons/fa/index.js";
import { useParams } from 'react-router-dom'
import { Visualizador } from "../visualizador/Visualizador";
import axios from 'axios'
import fileDownload from 'js-file-download'
function Controller(){
    let { objeto, escena } = useParams();
    //let url=`http://redpanda.sytes.net:8085/api/images/getimageszip?path=/${objeto}/${escena}/`
    let url=`http://redpanda.sytes.net:8085/api/images/getimage?path=/${objeto}/${escena}/frames/`
    
    var buttonsScenes = []

    useEffect(() => {
        axios.get(`http://redpanda.sytes.net:8084/api/objects/geturlsimages?idobjeto=${objeto}`)
        .then(response => {
            if(response.data != null){
                response.data.forEach(e => {

                    buttonsScenes.push(
                        <div className="navigation-item">
                            <button className="semi-transparent-button"><FaTicketAlt size={50}/></button>
                        </div>                        
                    )
                });
            }
        })
        .catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
    }, []);
    

    
    let imagesList=[]

    for(var i=1;i<100;i++){
        imagesList.push(url+i+'.jpg')
    }
    
    
    return(
        <h4><Visualizador imagesList={imagesList} buttonsScenes={buttonsScenes}/></h4>
    );
}
export default Controller;