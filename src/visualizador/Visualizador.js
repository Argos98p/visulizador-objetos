import React, {useState, useRef, useEffect} from "react";
import "./visualizador_style.css";
import {
    FaCarSide,
    FaPlus,
    FaMinus,
    FaPlay,
    FaChevronLeft,
    FaChevronRight,
    FaPause
} from "react-icons/fa/index.js";
import {GiSteeringWheel, GiCarDoor} from "react-icons/gi/index.js"
import Tridi from "react-tridi";
import "react-tridi/dist/index.css";
import LottieControl from "../lottieFiles/lottieAnimation";
import {ReelImages} from "../ReelImages";
import { useParams } from 'react-router-dom'


export function Visualizador() {
    const [imageLocation, setImageLocation] = useState("/carro");
    const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
    const [pins, setPins] = useState([]);
    const tridiRef = useRef(null);
    var zoomValue = 0;
    const [visibleExtras, setVisibleExtras] = useState("false");
    function handleClickExtras(){
        setVisibleExtras(!visibleExtras)
        console.log(visibleExtras);
    }
    let { objeto, escena } = useParams();
    console.log(objeto, escena);

    const frameChangeHandler = (currentFrameIndex) => { // console.log("current frame index", currentFrameIndex);
    };
    const recordStartHandler = (recordingSessionId) => console.log("on record start", {recordingSessionId, pins});
    const recordStopHandler = (recordingSessionId) => console.log("on record stop", {recordingSessionId, pins});

    const pinClickHandler = (pin) => {
        console.log("on pin click", pin);
        tridiRef.current.toggleRecording(true, pin.recordingSessionId);
    };

    const zoomValueHandler = (valueZoom) => zoomValue = valueZoom;

    

    return (
        <div className="visualizador">

            <Tridi ref={tridiRef}
                zoom={1}
                maxZoom={3}
                minZoom={1}
                onZoom={zoomValueHandler}
                location={imageLocation}
                format="png"
                count="73"
                onFrameChange={frameChangeHandler}
                autoplaySpeed={70}
                onAutoplayStart={
                    () => setIsAutoPlayRunning(true)
                }
                onAutoplayStop={
                    () => setIsAutoPlayRunning(false)
                }
                onRecordStart={recordStartHandler}
                onRecordStop={recordStopHandler}
                onPinClick={pinClickHandler}
                renderPin={
                    (pin) => (
                        <LottieControl></LottieControl>
                    )
                }
                inverse
                //showControlBar
                showStatusBar
                mousewheel
                pins={pins}
                setPins={setPins}
                //hintOnStartup
                //hintText="Drag to view"
            />

            <div className="navigation-container">
                <div className="navigation-item">
                    <button className="semi-transparent-button"><FaCarSide size={50}/></button>
                </div>
                <div className="navigation-item">
                    <button className="semi-transparent-button"><GiCarDoor size={50}/></button>
                </div>
                <div className="navigation-item">
                    <button className="semi-transparent-button"><GiSteeringWheel size={50}/></button>
                </div>
            </div>

            <div className="options-container">
                <div className="option-item">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.prev()
                    }><FaChevronLeft/></button>
                </div>
                <div className="option-item">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.next()
                    }><FaChevronRight/></button>
                </div>
                <div className="option-item">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.toggleAutoplay(!isAutoPlayRunning)
                    }>
                        {
                        isAutoPlayRunning ? <FaPause/>: <FaPlay/>
                    }</button>
                </div>
                <div className="option-item">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.setZoom(zoomValue + 0.3)
                    }><FaPlus/></button>
                </div>
                <div className="option-item">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.setZoom(zoomValue - 0.1)
                    }><FaMinus/></button>
                </div>

            </div>
            <div className="reel-container">
                <button className="reel-btn" onClick={handleClickExtras} >Extras</button>
                <div className={`reel ${!visibleExtras && "no-visible" } `}>
                    <ReelImages></ReelImages>
                </div>                
            </div>

            


        </div>
    );
};
