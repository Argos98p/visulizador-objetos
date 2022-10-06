import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Visualizador} from "./Visualizador";
import axios from "axios";
import NoEncontrado from "./publicidad/paginaNoEncontrado";
import {infoObjectUrl,getExtrasUrl} from "../Api/apiRoutes";
import LottieServerError from "../Animations/lottieServerError";


function Controller({editMode}) {
    let {id} = useParams();
    const [myObjeto, setMyObjeto] = useState(null);
    const [extras, setExtras] = useState([]);
    const [noEscenas,setNoEscenas] = useState(false);

    useEffect(() => {
        axios.get(infoObjectUrl(id)).then(response => {

            if(response.data !== "NOT_FOUND"){
                if(Object.keys(response.data.escenas).length===0){
                    setNoEscenas(true)
                    console.log(id)
                }else{
                    setMyObjeto(response.data);
                    axios.get(getExtrasUrl(id))
                        .then((response)=>{
                            if(response.data !== []){
                                setExtras(response.data)
                            }
                        });
                }


            }
            else{
                console.log("NOT FOUND");
                setMyObjeto("NOT_FOUND");
            }
        }).catch(error => {
            if(error.response){
                console.log(error.response);
                setMyObjeto("errorGET");
                //entra aqui cuando el sesrvidor esta caido
            }else if(error.request){
                console.log(error.request)
                setMyObjeto("errorGET");
            }else{
                console.log('Error ',error.message);
                setMyObjeto("errorGET");
            }
            setMyObjeto("errorGET");
            console.log(error.config);
        })
    }, []);


    if(myObjeto ==="errorGET"){
        return <LottieServerError/>
    }
    if(myObjeto==="NOT_FOUND"){
        return <NoEncontrado idObjeto={id}></NoEncontrado>
    }

    if(noEscenas){
        return <h3>No existen escenas</h3>
    }

    return myObjeto !== null ? (
        <Visualizador data={myObjeto}
                      edit={editMode}
            tipo="vehiculo"
            id={id} extras={extras}></Visualizador>
    ) : null
}

  export default Controller;
