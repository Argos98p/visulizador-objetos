import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Visualizador} from "./Visualizador";
import axios from "axios";
import NoEncontrado from "./publicidad/paginaNoEncontrado";
import {infoObjectUrl,getExtrasUrl} from "../Api/apiRoutes";


//cambiar por una funciona que devuelva solo true o false
function Controller() {
    let {id} = useParams();
    const [myObjeto, setMyObjeto] = useState(null);
    const [extras, setExtras] = useState([]);
    const [noEscenas,setNoEscenas] = useState(false);

    useEffect(() => {
        axios.get(infoObjectUrl(id)).then(response => {
            //return response.data
            if(response.data !== "NOT_FOUND"){
                if(Object.keys(response.data.escenas).length===0){
                    setNoEscenas(true)
                }else{
                    setMyObjeto(response.data);
                    console.log(response.data);
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
            }else if(error.request){
                console.log(error.request)
            }else{
                console.log('Error ',error.message);
            }
            console.log(error.config);
        })
    }, []);


    if(myObjeto==="NOT_FOUND"){
        return <NoEncontrado idObjeto={id}></NoEncontrado>
    }

    if(noEscenas){
        return <h3>No existen escenas</h3>
    }

    return myObjeto !== null ? (
        <Visualizador data={myObjeto}
            tipo="vehiculo"
            id={id} extras={extras}></Visualizador>
    ) : null
}

  export default Controller;
