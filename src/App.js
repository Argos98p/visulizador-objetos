import "./App.css";
import React from "react";
import "react-tridi/dist/index.css";
import {Visualizador} from "./visualizador/Visualizador";
import Controller  from "./Controller/controller";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <Routes>
            <Route  path="/visualizador/:objeto/:escena" element= {<Controller/>}/>
    </Routes>    
  
  );
}

export default App;
