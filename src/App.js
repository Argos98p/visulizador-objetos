import React, {useState} from "react";
import "react-tridi/dist/index.css";
import  "./styles/styles.scss";

import Controller from "./components/Controller";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
    const [loading, setLoading] = useState(true);

 
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
