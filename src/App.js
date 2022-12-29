import React from "react";
import "react-tridi/dist/index.css";
import  "./styles/styles.scss";

import Controller from "./components/Controller";

import {Navigate, Route, Routes, useNavigate, useParams, useSearchParams} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import {uploadExtraUrl, verificaToken} from "./Api/apiRoutes";


function App() {


    const VisualizadorRedirect = () => {
        const { id } = useParams();
        return <Navigate to={`/visualizador/view/${id}`} />
    }

    const SaveToken = () =>{
        const { id,webview } = useParams();


        const navigation = useNavigate()
        const [searchParams, setSearchParams] = useSearchParams();
        let tk = searchParams.get("token");
        let idUser = searchParams.get("idUser");


        if(webview){
            localStorage.setItem('webview',true);
        }else{
            localStorage.setItem('webview',false);
        }
        if(!tk){
            navigation(`/visualizador/view/${id}`);
            return <Navigate to={`/visualizador/view/${id}`} />
        }


        fetch(verificaToken(idUser), {
            method: "POST",
            headers: {
                'Authorization': tk,
            }
        }).then(r => {

            if(r.status === 200){
                localStorage.setItem('token', tk);
                localStorage.setItem("idUser",idUser)
                navigation(`/visualizador/edit/${id}`);
                return <Navigate to={`/visualizador/edit/${id}`} />
            }else if(r.status === 401){
                navigation(`/visualizador/view/${id}`);
                return <Navigate to={`/visualizador/view/${id}`} />
            }else{
                console.log(r.status)
            }
        }
        );




    }

    return (
            <Routes>
                <Route index element={<h1>index</h1>} />
                {/*en la siguiente linea va false*/}
                <Route path="/visualizador/view/:id/*" element={<Controller editMode={false}/>} />
                <Route path="/visualizador/edit/:id/*" element={
                    <ProtectedRoute>
                        <Controller editMode={true}/>
                    </ProtectedRoute>
                    } />
                <Route path="/visualizador/:id" element={<SaveToken/>}/>
                <Route path="/visualizador/:id/:webview" element={<SaveToken/>}/>
            </Routes>
    );
}

export default App;
