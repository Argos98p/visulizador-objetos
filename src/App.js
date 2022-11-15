import React from "react";
import "react-tridi/dist/index.css";
import  "./styles/styles.scss";

import Controller from "./components/Controller";

import {Navigate, Route, Routes, useParams, useSearchParams} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    const VisualizadorRedirect = () => {
        const { id } = useParams();

        return <Navigate to={`/visualizador/view/${id}`} />
    }

    const SaveToken = () =>{
        const { id } = useParams();
        const [searchParams, setSearchParams] = useSearchParams();
        localStorage.setItem('token', searchParams.get("token"))
        return <Navigate to={`/visualizador/edit/${id}`} />
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
