import React, {useState, useRef, useEffect} from "react";
import Tridi from "react-tridi";
import OptionButtons from "./buttonsOptions";
import "react-tridi/dist/index.css";
import "./visualizador_style.css";
import axios from "axios";
import NavigationObjectButttons from "./NavigationObjectButtons";
import ReelImages from "./ReelImages";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {completeImageUrl} from "../Api/apiRoutes";
import ButtonEscena from "./buttonEscena";
import LottieEmptyEscenas from "../Animations/lottieEmptyEscena";
import DotLoader from "react-spinners/DotLoader";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import PopupNewHotspot from "./popupAddHotspot";
import ReactTooltip from "react-tooltip";

import {postAddHotspot} from "../Api/apiRoutes"


export function Visualizador({tipo, id, data, extras}) {
    var idUsuario = data["idusuario"];
    var nombre = data["nombre"];
    const [aux, setAux] = useState("0");
    const [escenas, setEscenas] = useState(data["escenas"]);
    const [escenaInView, setEscenaInView] = useState(getSceneWithFrames(escenas));
    const [images, setImages] = useState([]);
    const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [pins, setPins] = useState([]);
    const [visibleExtras, setVisibleExtras] = useState(true);
    const [addHotspotMode, setAddHotspotMode] = useState(false);
    const [nameHotspot, setNameHotspot] = useState("holis");
    const [extraSelected, setExtraSelected] = useState(null);
    const [newHotspot, setNewHotspot] = useState(false);
    const [loadStatus, setLoadStatus] = useState(false);
    const [loadPercentage, setLoadPercentage] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);


    const tridiRef = useRef(null);
    var zoomValue = 0;
    const childRef = useRef();
    var idEscenaActiva = 0;

    const notifyEdicion = () => toast.info("modo edición", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
    });

    const notifyVisualizacion = () => toast.info("visualización", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
    });

    useEffect(() => {
        var temp = [];
        var i = 1;
        escenaInView[1].imagenes.forEach((element) => {
            var splitNombre = element.path.split("/");

            temp.push(completeImageUrl(`/${
                splitNombre[1]
            }/${
                splitNombre[2]
            }/${
                splitNombre[3]
            }_compresos/${i}.jpg`));
            i++;
        });
        setImages(temp);
        setAux(escenaInView[0].toString())
    }, [escenaInView]);

    function getSceneWithFrames(escenas) {
        var aux = true;
        var escenaInicial = undefined;
        Object.entries(escenas).map((escena) => {
            if (escena[1].imagenes.length > 0 && aux) {
                escenaInicial = escena;
                idEscenaActiva = escena[0];
                aux = false;
            }
        });
        return escenaInicial;
    }


    function handleClickExtras() {
        setVisibleExtras(!visibleExtras)
        console.log(escenaInView);
    }
    const frameChangeHandler = (currentFrameIndex) => {
        setCurrentIndex(currentFrameIndex);
    };

    const recordStartHandler = (recordingSessionId) => console.log("on record start", {recordingSessionId, pins});

    const recordStopHandler = (recordingSessionId) => console.log("on record stop", {recordingSessionId, pins});

    const pinClickHandler = (pin) => {
        console.log("on pin click", pin);
        // tridiRef.current.toggleRecording(!isEditMode, pin.recordingSessionId);
    };

    const zoomValueHandler = (valorZoom) => {
        zoomValue = valorZoom;
    }

    function handlePrev() {
        tridiRef.current.prev();
    }
    function handleNext() {
        tridiRef.current.next();
    }
    function handleZoomIn() {
        tridiRef.current.setZoom(zoomValue + 0.3);
        if (zoomValue > 1) {
            tridiRef.current.toggleMoving(true)
        }
        if (zoomValue === 1) {
            tridiRef.current.toggleMoving(false)
        }

    }
    function handleZoomOut() {
        tridiRef.current.setZoom(zoomValue - 0.1);
        if (zoomValue > 1) {
            tridiRef.current.toggleMoving(true)
        }
        if (zoomValue === 1) {
            tridiRef.current.toggleMoving(false)
        }

    }
    function handleAutoPlay() {
        tridiRef.current.toggleAutoplay(!isAutoPlayRunning);
    }
    function handleWheel(e) {

        e.deltaY > 0 ? handleZoomOut() : handleZoomIn();
    }
    function handleAddHostpot() { // tridiRef.current.toggleRecording(!isEditMode);
        console.log(pins);
    }

    function frameReplicate() {
        var lastPin = pins[pins.length - 1];
        var move = 0.015;
        var j = 20;
        var replicate = 20
        var temp = [...pins]
        var moveY = 0.005
        var k = 20 // increment x axis para frames anteriores
        var h = 1 // increment x axis para frames posteiriores

        temp[pins.length - 1].nombre = nameHotspot;
        temp[pins.length - 1].extra = extraSelected.idextra;

        
        axios.post(postAddHotspot(id, escenaInView[1].nombre, currentIndex+".jpg", temp[pins.length - 1].x, temp[pins.length - 1].y)).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });


        for (var i = lastPin.frameId - replicate; i <= lastPin.frameId + replicate; i++) {
            var originalX = parseFloat(lastPin.x);
            var originalY = parseFloat(lastPin.y);


            if (i === lastPin.frameId) {} else {
                var newPin = {
                    id: lastPin.id,
                    frameId: i,
                    nombre: nameHotspot,
                    extra: extraSelected.idextra,
                    x: originalX + move * j,
                    y: originalY - moveY * k,
                    recordingSessionId: lastPin.recordingSessionId
                }
                temp.push(newPin)
            } j--;

            if (i < lastPin.frameId) {
                k--;
            } else {
                k++;
            }


        }
        setNewHotspot(false);
        setPins(temp)
    }


    function handleButtonEscena(escena) {
        idEscenaActiva = escena[0];
        setEscenaInView(escena);
    }

    function handleCreateHotspot(imgExtra, info) {
        console.log(imgExtra);
        if (info == "" || imgExtra == null) {

        } else {
            setExtraSelected(imgExtra);
            setNameHotspot(info);
            tridiRef.current.toggleRecording(true)
            setAddHotspotMode(true);
            setNewHotspot(true)
        }

    }

    function clickOnTridiContainer() {
        if (addHotspotMode) {
            tridiRef.current.toggleRecording(false);
            console.log(pins);
            // setNameHotspot("");
            // ReactTooltip.rebuild();
        }
    }

    useEffect(() => {
        if (pins.length !== 0 && newHotspot === true) {
            frameReplicate();
        }
    }, [pins.length]);


    function myRenderPin(pin) {
        return (
            <>
                <label>
                    <div id="b3"
                        onClick={
                            () => childRef.current.getAlert()
                        }
                        className="button-hotspot"
                        data-for='soclose'
                        data-tip={
                            pin.nombre
                    }>
                        +
                    </div>
                </label>

                <ReactTooltip id="soclose" place="top" effect="solid"
                    getContent={
                        (dataTip => dataTip)
                }></ReactTooltip>
            </>
        );
    }
    function handleOnLoad(load_success, percentage) {
        setLoadPercentage(percentage);

        if (percentage > 70) {
            setLoadStatus(true)
        }

    }

    function getVisualizador() {

        if (images.length === 0) {
            return <div className="emptyEscena ">
                <h2 className="texto-blanco">Escena vacia</h2>
                <br></br>
                <LottieEmptyEscenas></LottieEmptyEscenas>
            </div>
        } else {

            return (

                <div className={`tridi-container `}
                    onWheel={handleWheel}
                    onClick={clickOnTridiContainer}>
                    {/*
                    loadStatus === false ? <div className="sweet-loading">
                        <DotLoader color="#3F3F3F"
                            loading={
                                !loadStatus
                            }
                            size={70}/>
                        <h1>{loadPercentage}
                            %
                        </h1>
                    </div> : null*/}


                    <Tridi ref={tridiRef}
                        className={
                            "" /*
                            `${
                                loadStatus ? "" : 'oculto'
                            }`*/
                        }


                        autoplaySpeed={70}
                        //autoplay={true}

                        zoom={1}
                        maxZoom={3}
                        minZoom={1}
                        onZoom={zoomValueHandler}
                        images={images}
                        //format="png"
                        count={
                            images.length
                        }
                        onFrameChange={frameChangeHandler}
                        onAutoplayStart={
                            () => setIsAutoPlayRunning(true)
                        }
                        onAutoplayStop={
                            () => setIsAutoPlayRunning(false)
                        }
                        onRecordStart={
                            recordStartHandler
                            // setIsEditMode(true);
                            /*
                                toast.dismiss();
                                notifyEdicion();*/
                        }
                        onRecordStop={

                            /*setIsEditMode(false);
                                toast.dismiss();
                                notifyVisualizacion();
                                // frameReplicate()
                                console.log(pins);*/
                            recordStopHandler
                        }
                        onPinClick={pinClickHandler}
                        setPins={setPins}

                        renderPin={myRenderPin}
                        //inverse
                        //showControlBar
                        //showStatusBar

                        pins={pins}
                        //hintOnStartup
                        //hintText="Arrastre para mover"
                        onLoadChange={handleOnLoad}/>
                </div>
            )
        }
    }

    function handleActivateEditMode() {
        setIsEditMode(!isEditMode)
    }


    return (
        <div className="visualizador dragging">

            <div className="top-buttons ">
                <button className="button-option"
                    onClick={handleActivateEditMode}>Añadir recursos</button>
            </div>


            <div className="reel-container">
                <div className={
                    `reel ${
                        !visibleExtras && "no-visible"
                    } `
                }>

                    <ReelImages id={id}
                        ref={childRef}
                        extrasImages={extras} isEditMode={isEditMode}></ReelImages>
                </div>
            </div>
            {
            isEditMode ? <div className="add-buttons">


                <PopupNewHotspot extras={extras}
                    handleCreateHotspot={handleCreateHotspot}></PopupNewHotspot>

                <button className="button-option" disabled>Agregar extra</button>
            </div> : null
        }


            <button className={
                    `reel-btn button-option ${
                        visibleExtras ? "activo" : ""
                    }`
                }
                onClick={handleClickExtras}>
                Extras
            </button>

            {
            getVisualizador()
        }

            <div className="navigation-container">
                {
                Object.entries(escenas).map((escena) => (

                    <ButtonEscena key={
                            escena[0]
                        }
                        escenaInfo={escena}
                        onClick={handleButtonEscena}
                        activo={
                            escena[0].toString() === aux.toString() ? true : false
                    }></ButtonEscena>
                ))
            } </div>

            <div className="options-container">
                <OptionButtons onAddHotspot={handleAddHostpot}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onAutoPlay={handleAutoPlay}
                    isAutoPlayRunning={isAutoPlayRunning}
                    isEditMode={isEditMode}></OptionButtons>
            </div>


            {
            tipo === "vehiculo" ? null /*<NavigationCarButtons onOpenDoors={handleOpenDoors} onCloseDoors={handleCloseDoors}  onInterior={handleInterior}></NavigationCarButtons>*/ : null /*<NavigationObjectButttons ></NavigationObjectButttons>*/
        } </div>
    );

    /*
  return scenesKeys !== undefined ? (
    <div className="visualizador dragging" onWheel={handleWheel}>

      <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
       />
  
        {interiorEnabled
        ?<ReactPlayer url='https://www.youtube.com/watch?v=BlrofcGsouI' width="100%" height="100%" loop={true}/>

        :getVisualizador()
        }
      

      {tipo==="vehiculo"
      ?<NavigationCarButtons onOpenDoors={handleOpenDoors} onCloseDoors={handleCloseDoors} imagesFramesScenes={imagesFramesScenes} onInterior={handleInterior}></NavigationCarButtons>
      :<NavigationObjectButttons imagesFramesScenes={imagesFramesScenes}></NavigationObjectButttons>
      }
      


      <div className="options-container">
        <OptionButtons
        onAddHotspot={handleAddHostpot}
          onPrev={handlePrev}
          onNext={handleNext}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onAutoPlay={handleAutoPlay}
          isAutoPlayRunning={isAutoPlayRunning}
          isEditMode={isEditMode}
        ></OptionButtons>
      </div>

      <div className="reel-container">
        <button className="reel-btn" onClick={handleClickExtras}>
          Extras
        </button>
        <div className={`reel ${!visibleExtras && "no-visible"} `}>
          
          
          <ReelImages id={id}></ReelImages>
        </div>
      </div>
    </div>
  ) : (
    <h1>Cargando</h1>
  );*/
}
