import './App.css';
import React from 'react';
import 'react-tridi/dist/index.css';
import {Visualizador} from './visualizador/Visualizador'

function App() {

    return (
       <div className="container">
            
            <div className="row">
                <div className="col-12 col-md-6 card p-0">
                <Visualizador></Visualizador>

                    {/*

                    <React360Viewer amount={73}
                        imagePath={`./carro/`}
                        fileName="carro_{index}.png"
                        loop={1}
                        //buttonClass="ligth"
                    />

                    <ThreeSixty amount={73}
                        imagePath={`./carro/`}
                        fileName="carro_{index}.png"
                        loop={1}
                        //buttonClass="ligth"
                    />

                    <ThreeSixty amount={73}
                        imagePath={`./carro/`}
                        fileName="carro_{index}.png"
                        loop={1}
                        //buttonClass="ligth"
                    />
*/} </div>
            </div>
        </div>


    );
}

export default App;
