import React, { useState, useRef, useEffect } from "react";
import Tridi from "react-tridi";
import OptionButtons from "./buttonsOptions";
import "react-tridi/dist/index.css";
import "./visualizador_style.css";
import NavigationObjectButttons from "./NavigationObjectButtons";
import ReactPlayer from "react-player";
import ReelImages from "./ReelImages";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { completeImageUrl } from "../Api/apiRoutes";
import ButtonEscena from "./buttonEscena";
import LottieEmptyEscenas from "../Animations/lottieEmptyEscena";


export function Visualizador({tipo,
  id,
  data,
}) {
  var idUsuario = data["idusuario"];
  var nombre = data["nombre"];
  const [aux,setAux] = useState("0");
  const [escenas, setEscenas] = useState(data["escenas"]);
  const [escenaInView, setEscenaInView] = useState(getSceneWithFrames(escenas));
  const [images, setImages] = useState([]);

  
  var idEscenaActiva=0;

  const notifyEdicion = () =>
    toast.info("modo edición", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notifyVisualizacion = () =>
    toast.info("visualización", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  useEffect(() => {
    var temp = [];
    var i = 1;
    escenaInView[1].imagenes.forEach((element) => {
      var splitNombre = element.path.split("ObjetosVirtuales")[1].split("/");

      temp.push(
        completeImageUrl(
          `/${splitNombre[1]}/${splitNombre[2]}/${splitNombre[3]}/${i}.jpg`
        )
      );
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
        idEscenaActiva=escena[0];
        aux = false;
      }
    });
    return escenaInicial;
  }

  const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pins, setPins] = useState([]);
  const [visibleExtras, setVisibleExtras] = useState(true);
  const [interiorEnabled, setInteriorEnabled] = useState(false);
  const tridiRef = useRef(null);
  var zoomValue = 0;

  function handleClickExtras() {
    setVisibleExtras(!visibleExtras);
  }
  const frameChangeHandler = (currentFrameIndex) => {};

  const recordStartHandler = (recordingSessionId) =>
    console.log("on record start", { recordingSessionId, pins });

  const recordStopHandler = (recordingSessionId) =>
    console.log("on record stop", { recordingSessionId, pins });

  const pinClickHandler = (pin) => {
    console.log("on pin click", pin);
    tridiRef.current.toggleRecording(!isEditMode, pin.recordingSessionId);
  };
  const zoomValueHandler = (valueZoom) => (zoomValue = valueZoom);

  function handlePrev() {
    tridiRef.current.prev();
  }
  function handleNext() {
    tridiRef.current.next();
  }
  function handleZoomIn() {
    tridiRef.current.setZoom(zoomValue + 0.3);
  }
  function handleZoomOut() {
    tridiRef.current.setZoom(zoomValue - 0.1);
  }
  function handleAutoPlay() {
    tridiRef.current.toggleAutoplay(!isAutoPlayRunning);
  }
  function handleWheel(e) {
    e.deltaY > 0 ? handleZoomOut() : handleZoomIn();
  }

  function handleOpenDoors() {
    setInteriorEnabled(false);
    //var temp=[...imagesFramesScenes.get(scenesKeys[0])]
    //setImagesInVisualizador([...temp])
  }

  function handleCloseDoors() {
    setInteriorEnabled(false);
    //var temp2=[...imagesFramesScenes.get(scenesKeys[1])]
    //setImagesInVisualizador([...temp2]);
  }

  function handleInterior() {
    setInteriorEnabled(true);
  }

  function handleAddHostpot() {
    tridiRef.current.toggleRecording(!isEditMode);
    console.log(pins);
  }
  /*
  function frameReplicate(){
    var lastPin= pins[pins.length-1];
    var move = 0.015;
    var j=20;
    var temp=[...pins]
    for(var i=lastPin.frameId-20;i<=lastPin.frameId+20;i++){
      var originalX = parseFloat(lastPin.x);
      var originalY = parseFloat(lastPin.y);  

      
        var newPin={
          id:lastPin.id,
          frameId: i,
          x:originalX+move*j,
          y:originalY,
          recordingSessionId:lastPin.recordingSessionId,
        }
        temp.push(newPin)
      j--;      
    }
    setPins(temp)
  }*/


  function handleButtonEscena(escena){
    idEscenaActiva=escena[0];
    console.log(idEscenaActiva);
  
    setEscenaInView(escena);
  }


  function getVisualizador() {

    if(images.length === 0){
      return <div className="emptyEscena ">
        <h2 className="texto-blanco">Escena vacia</h2>
        <br></br>
        <LottieEmptyEscenas></LottieEmptyEscenas>
      </div>
      
      
    }else{

    
    return (

      <Tridi
        ref={tridiRef}
        autoplaySpeed={70}
        //autoplay={true}

        zoom={1}
        maxZoom={3}
        minZoom={1}
        onZoom={zoomValueHandler}
        images={images}
        //format="png"
        count={images.length}
        onFrameChange={frameChangeHandler}
        onAutoplayStart={() => setIsAutoPlayRunning(true)}
        onAutoplayStop={() => setIsAutoPlayRunning(false)}
        onRecordStart={() => {
          setIsEditMode(true);
          toast.dismiss();
          notifyEdicion();
        }}
        onRecordStop={() => {
          setIsEditMode(false);
          toast.dismiss();
          notifyVisualizacion();
          //frameReplicate()
        }}
        onPinClick={pinClickHandler}
        setPins={setPins}
        //renderPin={(pin) => <LottieControl></LottieControl>}
        renderPin={(pin) => (
          <label for="input3">
            <div id="b3" className="button">
              +
            </div>
          </label>
        )}
        //inverse
        //showControlBar
        //showStatusBar

        pins={pins}
        hintOnStartup
        hintText="Arrastre para mover"
      />
    )}
  }

  return (
    <div className="visualizador dragging" onWheel={handleWheel}>
      <button className={`reel-btn ${visibleExtras ? "activo":""}`} onClick={handleClickExtras}>
          Extras
        </button>
      {getVisualizador()}
      <div className="navigation-container">        
        {Object.entries(escenas).map((escena) => (
          
          <ButtonEscena key={escena[0]} escenaInfo={escena} onClick={handleButtonEscena} activo={escena[0].toString()===aux.toString() ? true : false}>
            
          </ButtonEscena>
        ))}
      </div>

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
        <div className={`reel ${!visibleExtras && "no-visible"} `}>
                    
          <ReelImages id={id}></ReelImages>
        </div>
      </div>
      
      {
        tipo === "vehiculo"
          ? null /*<NavigationCarButtons onOpenDoors={handleOpenDoors} onCloseDoors={handleCloseDoors}  onInterior={handleInterior}></NavigationCarButtons>*/
          : null /*<NavigationObjectButttons ></NavigationObjectButttons>*/
      }
    </div>
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
