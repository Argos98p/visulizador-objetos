import "./App.css";
import React from "react";
import "react-tridi/dist/index.css";
import { Visualizador } from "./visualizador/Visualizador";
import Imagen from "./pruebas";
function App() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6 card p-0">
          <Visualizador></Visualizador>
        </div>
      </div>
      
    </div>
  );
}

export default App;
