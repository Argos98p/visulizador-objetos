import './App.css';
import React360Viewer from "react-360-view-simple";
//import ThreeSixty from 'react-360-view-lilith';
import ThreeSixty from 'react-360-view-extended';
function App() { // var visualizerContainer={width:"42%", };
    return (

        <div className="container">
            <div className="row">
                <div className="col-12 col-md-6 card p-0">
                    <div className="v360-header text-light bg-dark">
                        <span className="v360-header-title">36 Images - Autoplay (1 loop) - Reverse Spin</span>
                        <span className="v360-header-description"></span>
                    </div>

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


                </div>
            </div>
        </div>


    );
}

export default App;
