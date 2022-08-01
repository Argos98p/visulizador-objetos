import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Visualizador } from "./Visualizador";
import axios from "axios";
import NoEncontrado from "./paginaNoEncontrado";


function Controller() {
  let { id } = useParams();
  const [imagesLoaded, setImagesLoaded] = useState(true);
  let [color, setColor] = useState("#EBAF26");


  var url = `http://redpanda.sytes.net:8084/api/objects/geturlsimages?idobjeto=${id}`;
  var urlFrames = `http://redpanda.sytes.net:8085/api/images/getimage?path=`;


  const [objExiste, setObjExiste]=useState(false);
  
  const [imagesFramesScenes,setImagesFramesScenes]= useState(new Map())
  const [scenesKeys, setScenesKeys]= useState([]);
  
  var limitFrames = 100;


  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        if (response.data != null) {
            
          response.data.forEach((e) => {            
            var escena = e.split("/")[2];
            var urlFrame = urlFrames + e;
            var framesPaths = [];
            for (var i = 1; i <= limitFrames; i++) {
              framesPaths.push(urlFrame + `/${i}.jpg`);              
            }
            var temp = imagesFramesScenes
            temp.set(escena, framesPaths)
            setImagesFramesScenes(temp);

            var temp2= scenesKeys
            temp2.push(escena)
            setScenesKeys(temp2);
            
            setObjExiste(true);
          });
        }
      })
      .catch((error) => { 
        setObjExiste(false)
        console.error("There was an error!", error);
      });

  },);



  return objExiste
  ?(<Visualizador imagesFramesScenes={imagesFramesScenes} scenesKeys={scenesKeys} tipo="vehiculo"></Visualizador>)
  :(<NoEncontrado idObjeto={id} ></NoEncontrado>)
 
}
export default Controller;
