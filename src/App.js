import React from "react";
import "react-tridi/dist/index.css";
import  "./styles/styles.scss";

import Controller from "./components/Controller";

import {Navigate, Route, Routes, useNavigate, useParams, useSearchParams} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import {uploadExtraUrl, verificaToken} from "./Api/apiRoutes";
import Home from "./components/Home";


function App() {


    const VisualizadorRedirect = () => {
        const { id } = useParams();
        return <Navigate to={`/visualizadorobjeto/view/${id}`} />
    }

    const SaveToken = () =>{
        const { id,webview } = useParams();


        const navigation = useNavigate()
        const [searchParams, setSearchParams] = useSearchParams();
        let tk = searchParams.get("token");
        let idUser = searchParams.get("idUser");

        console.log(tk,idUser)
        if(webview){
            localStorage.setItem('webview',true);
        }else{
            localStorage.setItem('webview',false);
        }
        if(!tk){
            navigation(`/visualizadorobjeto/view/${id}`);
            return <Navigate to={`/visualizadorobjeto/view/${id}`} />
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
                navigation(`/visualizadorobjeto/edit/${id}`);
                return <Navigate to={`/visualizadorobjeto/edit/${id}`} />
            }else if(r.status === 401){
                navigation(`/visualizadorobjeto/view/${id}`);
                return <Navigate to={`/visualizadorobjeto/view/${id}`} />
            }else{
                console.log(r.status)
            }
        }
        );

    }

    return (
            <Routes>

                
                <Route index element={<Home/>} />
                {/*en la siguiente linea va false*/}
                <Route path="/visualizadorobjeto/view/:id/*" element={<Controller editMode={false} marketa={false}/> } />
                <Route path="/visualizadorobjeto/view/:id/marketa/*" element={<Controller editMode={false}  marketa={true} />}/>

                <Route path="/visualizadorobjeto/edit/:id/*" element={
                    <ProtectedRoute>
                        <Controller editMode={true}/>
                    </ProtectedRoute>
                    } />
                <Route path="/visualizadorobjeto/:id" element={<SaveToken/>}/>
                <Route path="/visualizadorobjeto/:id/:webview" element={<SaveToken/>}/>
            </Routes>
    );
}

export default App;
