import React from "react";
import "react-tridi/dist/index.css";
import  "./styles/styles.scss";

import Controller from "./components/Controller";

import {Navigate, Route, Routes, useParams} from "react-router-dom";


function App() {

    const VisualizadorRedirect = () => {
        const { id } = useParams();
        return <Navigate to={`/visualizador/view/${id}`} />
    }

    return (

            <Routes>
                <Route index element={<h1>index</h1>} />

                <Route path="/visualizador/view/:id/*" element={<Controller editMode={false}/>} />
                <Route path="/visualizador/edit/:id/*" element={<Controller editMode={true}/>} />
                <Route path="/visualizador/:id/*" element={<VisualizadorRedirect/>}/>
            </Routes>
    );
}

export default App;
