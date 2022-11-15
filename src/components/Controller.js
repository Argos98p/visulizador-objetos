import React, {useEffect, useState} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import {Visualizador} from "./Visualizador";
import axios from "axios";
import NoEncontrado from "./publicidad/paginaNoEncontrado";
import {infoObjectUrl, getExtrasUrl, loginUser} from "../Api/apiRoutes";
import LottieServerError from "../Animations/lottieServerError";


function Controller({editMode}) {
    let {id} = useParams();
    const [myObjeto, setMyObjeto] = useState(null);
    const [extras, setExtras] = useState([]);
    const [noEscenas,setNoEscenas] = useState(false);
    const navigate=useNavigate();


    useEffect(() => {
        axios.get(infoObjectUrl(id)).then(response => {

            if(response.data !== "NOT_FOUND"){
                if(Object.keys(response.data.escenas).length===0){
                    setNoEscenas(true)

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
                setMyObjeto("NOT_FOUND");

            }
        }).catch(error => {
            console.log(error)
            if(error.response.status === 404){
                setMyObjeto("NOT_FOUND");
            }
        })


    }, [id,navigate]);





    return (
        <>
            <Routes>
                <Route path="/404" element={<NoEncontrado idObjeto={id}></NoEncontrado>} />
                <Route path="/serverError" element={<LottieServerError/>}/>
            </Routes>
            {
                (myObjeto ==="NOT_FOUND")
                    ? <NoEncontrado idObjeto={id}></NoEncontrado>
                    :null
            }
            {
                noEscenas ? <h3>No hay escenas</h3>: null
            }
            { (myObjeto !=="NOT_FOUND" && myObjeto !== null )?
                <Visualizador data={myObjeto}
                              edit={editMode}
                              tipo="vehiculo"
                              id={id} extras={extras}></Visualizador>
                : null}

        </>
    );
}
export default Controller;
