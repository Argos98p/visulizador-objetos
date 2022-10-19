import React, {useEffect, useState} from "react";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import {Visualizador} from "./Visualizador";
import axios from "axios";
import NoEncontrado from "./publicidad/paginaNoEncontrado";
import {infoObjectUrl, getExtrasUrl, loginUser} from "../Api/apiRoutes";
import LottieServerError from "../Animations/lottieServerError";
import {Helmet} from "react-helmet";

function Controller({editMode}) {
    let {id} = useParams();
    const [myObjeto, setMyObjeto] = useState(null);
    const [extras, setExtras] = useState([]);
    const [noEscenas,setNoEscenas] = useState(false);
    const navigate=useNavigate();


    useEffect(() => {


        axios.post(loginUser(),{ "username":"seaman2",

            "password":"123456789"}).then(response =>{
            console.log(response.data)
            localStorage.setItem('token', response.data.accessToken)
            localStorage.setItem('user',response.data.id)

            axios.get(infoObjectUrl(id)).then(response => {
                console.log(response)

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
                    console.log("NOT_FOUND");
                    setMyObjeto("NOT_FOUND");

                }
            }).catch(error => {
                if(error.response){
                    console.log(error.response);
                    //setMyObjeto("errorGET");
                    //entra aqui cuando el sesrvidor esta caido
                }else if(error.request){
                    console.log(error.request)
                    //setMyObjeto("errorGET");
                }else{
                    console.log('Error ',error.message);
                    //setMyObjeto("errorGET");
                }
                navigate("/serverError");
                console.log(error.config);
            })
        })



    }, [id,navigate]);



    return (
        <>
            {
                /*
                <Helmet>
                <meta charSet="utf-8" />
                <title>My Title holaaa</title>
                <meta name="description" content="Helmet application" />
                <meta property="og:title" content="MyApp" />
                <meta property="og:image" content="https://kinsta.com/es/wp-content/uploads/sites/8/2020/10/tipos-de-archivos-de-imagen.png" />
            </Helmet>
                * */
            }


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
