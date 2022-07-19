import React, {useState, useRef} from "react";
import "./visualizador_style.css";
import {

    FaPlus,
    FaMinus,
    FaPlay,
    FaChevronLeft,
    FaChevronRight,
    FaPause

} from "react-icons/fa/index.js";
import Tridi from "react-tridi";
import "react-tridi/dist/index.css";
import LottieControl from "../lottieFiles/lottieAnimation";

export function Visualizador() {
    const [imageLocation, setImageLocation] = useState("./carro");
    const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
    const [pins, setPins] = useState([]);
    const tridiRef = useRef(null);
    var zoomValue=0;

    const frameChangeHandler = (currentFrameIndex) => { // console.log("current frame index", currentFrameIndex);
    };

    const recordStartHandler = (recordingSessionId) => console.log("on record start", {recordingSessionId, pins});

    const recordStopHandler = (recordingSessionId) => console.log("on record stop", {recordingSessionId, pins});

    const pinClickHandler = (pin) => {
        console.log("on pin click", pin);
        tridiRef.current.toggleRecording(true, pin.recordingSessionId);
    };

    const zoomValueHandler =(valueZoom)=>zoomValue=valueZoom;

    return (
        <div style={
            {height: "100%"}
        }>
            <Tridi ref={tridiRef}
                zoom={1}
                maxZoom= {3}
                minZoom= {1}
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
                showControlBar
                //showStatusBar
                mousewheel
                pins={pins}
                setPins={setPins}
                //hintOnStartup
                //hintText="Drag to view"
            />

            <div className="flex-container">
                <div className="flex-items">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.prev()
                    }><FaChevronLeft/></button>
                </div>
                <div className="flex-items">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.next()
                    }><FaChevronRight/></button>
                </div>
                <div className="flex-items">
                    <button className="semi-transparent-button"
                        onClick={
                            () => tridiRef.current.toggleAutoplay(!isAutoPlayRunning)
                    }>
                        {
                        isAutoPlayRunning ? <FaPause/>: <FaPlay/>
                    }</button>
                </div>
                <div className="flex-items">
                    <button className="semi-transparent-button" onClick={() =>tridiRef.current.setZoom(zoomValue+0.3)}><FaPlus/></button>
                </div>
                <div className="flex-items">
                    <button className="semi-transparent-button" onClick={()=>tridiRef.current.setZoom(zoomValue-0.1)}><FaMinus/></button>
                </div>
                
            </div>

        </div>
    );
};
