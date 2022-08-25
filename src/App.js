import "./App.css";
import React, {useEffect, useState, CSSProperties} from "react";
import "react-tridi/dist/index.css";

import Controller from "./components/Controller";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
    const [loading, setLoading] = useState(true);
    

/*
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 8000)
    }, []);*/


    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red"
    };

 
    return (
        <div >
            <Routes>
                <Route path="/visualizador/:id"
                    element={<Controller/>}/>
            </Routes>
        </div>

    );
}

export default App;
