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
        const { id } = useParams();
        console.log(id)
        const navigation = useNavigate()
        const [searchParams, setSearchParams] = useSearchParams();
        let tk = searchParams.get("token");
        let idUser = searchParams.get("idUser");
        console.log(searchParams)
        fetch(verificaToken(idUser), {
            method: "POST",
            headers: {
                'Authorization': tk,
            }
        }).then(r => {
                console.log(r.status)
            if(r.status === 200){
                localStorage.setItem('token', searchParams.get("token"));
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
                <Route path="/visualizador/view/:id/*" element={<Controller editMode={false}/>} />
                <Route path="/visualizador/edit/:id/*" element={
                    <ProtectedRoute>
                        <Controller editMode={true}/>
                    </ProtectedRoute>

                    } />
                <Route path="/visualizador/:id/*" element={<VisualizadorRedirect/>}/>
                <Route path="/visualizador/:id" element={<SaveToken/>}/>
            </Routes>
    );
}

export default App;
