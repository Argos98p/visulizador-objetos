import React, { useCallback, useEffect, useMemo, useRef, useState} from "react";
import Tridi from "react-tridi";
import axios from "axios";
import ReelImages from "./reel/ReelImages";
import 'react-modal-video/scss/modal-video.scss';
import ModalVideo from 'react-modal-video';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useSwipeable } from 'react-swipeable';
import {
    completeImageUrl,
    deleteHotspot,
    addExtraPdf,
    getHotspots,
    infoObjectUrl,
    postAddHotspot,
    addLinkYoutube, getExtrasUrl,getPDF,
} from "../Api/apiRoutes";
import ButtonEscena from "./botones/buttonEscena";
import LottieEmptyEscenas from "../Animations/lottieEmptyEscena";
import useLongPress from "../hooks/useLongPress";
import PopupNewHotspot from "./popup/PopupAddHotspot";
import ReactTooltip from "react-tooltip";
import 'reactjs-popup/dist/index.css';
import "react-tridi/dist/index.css";
import "./visualizador_style.css";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DotLoader from "react-spinners/DotLoader";
import PopupInfoObjetct from "./popup/PopupInfoObjetct";
import {BsChevronDown, BsChevronUp} from "react-icons/bs";
import PopupCompartir from "./popup/PopupCompartir";
import ToogleButton from "./botones/ToogleButton";
import {FaFile,  FaFilm, FaImage} from "react-icons/fa";

export function Visualizador({tipo, id,data, extras,edit}) {

    const isMobile = /Mobi|Android/i.test(navigator.userAgent)
    const [objetoData,setObjetoData] = useState({escenas:{}});
    const [frames, setFrames] = useState([]);
    const [hotspotsMap, setHotspotsMap] = useState([]);
    const [updateHotspots, setUpdateHotspots] = useState(false); //variable para que se vuelva a pedir los hotspots
    const [awaitAddHotspot, setAwaitAddHotspot] = useState(false); //varaible para saber si los hotspots ya se cargaron en el server
    const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
    const [isEditMode, setIsEditMode] = useState(edit);
    const [pins, setPins] = useState([]);
    const [visibleExtras, setVisibleExtras] = useState(true);


    const [addHotspotMode, setAddHotspotMode] = useState(false); //variable para definir cuando con el click se agrega un nuevo hotspot  y para mostrar inicio y fin
    const [nameHotspot, setNameHotspot] = useState("holis");
    const [extraSelected, setExtraSelected] = useState(null);


    const [loadStatus, setLoadStatus] = useState(false);
    const [loadPercentage, setLoadPercentage] = useState(0);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [sphereImageInView, setSphereImageInView] = useState(false);

    const [activeEscena, setActiveEscena] = useState("0"); //escena que esta activa lo hace con
    const [prevDelta, setPrevDelta] = useState(1);
    const [openYoutubeModal, setOpenYoutubeModal] = useState(false);
    const [extraPdfOrVideo, setExtraPdfOrVideo] = useState({});
    const [ openPdfModal, setOpenPdfModal ] = useState(false);
    const [infoObjectData, setInfoObjectData] = useState("");
    const [ openModalInfoObject, setOpenModalInfoObject] = useState(false);
    const [ openModalCompartir, setOpenModalCompartir]  = useState(false);
    const [imgForInfoModal, setImgForModal] = useState("");
    const [updateObjectData, setUpdateObjectData] = useState(false);
    const [extrasList, setExtrasList] = useState(extras);
    const [updateExtras, setUpdateExtras] = useState(false);
    const [hotspotType, setHotspotType] = useState("imagen");
    const [longPressed, setLongPressed] = useState(false);

    const extraContainerRef=useRef();
    const extraInViewRef = useRef();
    const tridiRef = useRef(null);
    const tridiContainerRef = useRef(null);
    const tridiModalInfo = useRef(null);
    const containerRef = useRef(null);

    let zooom=1;

    /*
    const handlers = useSwipeable({
        onSwiping: (eventData) => leftSwip(eventData),
        delta: { left: 1, right: 1 }
    });*/
/*
    const leftSwip=(eventData)=>{
        if(prevDelta > eventData.deltaX){
            tridiRef.current.next();
            tridiRef.current.next();
            tridiRef.current.next();
            tridiRef.current.next();
            tridiRef.current.next();

        }else{
            tridiRef.current.prev();
            tridiRef.current.prev();
            tridiRef.current.prev();
            tridiRef.current.prev();

        }
        setPrevDelta(eventData.deltaX);
        setLongPressed(false);
    }*/

    // Recibe toda la info del objeto
    useEffect(() => {
        axios.get(infoObjectUrl(id)).then(
            response=>{
                if (response.status===200){
                    setObjetoData(response.data);
                    setInfoObjectData(response.data.info);
                    let numberOfFrames = {};

                    for(let index in response.data.escenas){
                        numberOfFrames[index] = Object.keys(response.data.escenas[index].imagenes).length;
                    }

                    setFrames(numberOfFrames)
                }

            }
        ).catch(error => {
            if(error.response){
                console.log(error.response);
            }else if(error.request){
                console.log(error.request)
            }else{
                console.log('Error ',error.message);
            }
            console.log(error.config);
        })
    }, []);

    useEffect(() => {
        async function getDataHotspots(){
            let promesas=[];
            let mapHotspots={};
            for(let escena in objetoData.escenas){
                let nombreEscena=objetoData.escenas[escena].nombre;
                promesas.push(
                    axios.get(getHotspots(id,nombreEscena))
                        .then(response=>{
                            mapHotspots[escena]=response.data;
                        }).catch(error => {
                        if(error.response){
                            console.log(error.response);
                        }else if(error.request){
                            console.log(error.request)
                        }else{
                            console.log('Error ',error.message);
                        }
                        console.log(error.config);
                    })
                )
            }
            Promise.all(promesas).then(()=> {
                setHotspotsMap(mapHotspots);
                setPins(prepararPins(mapHotspots[activeEscena]));
            });
        }
        getDataHotspots();
        return ()=>setUpdateHotspots(false);
    }, [objetoData, updateHotspots]);

    useEffect(() => {
        axios.get(infoObjectUrl(id)).then(
            response=>{
                if (response.status===200){
                    setObjetoData(response.data);

                }

            }
        ).catch(error => {
            if(error.response){
                console.log(error.response);
            }else if(error.request){
                console.log(error.request)
            }else{
                console.log('Error ',error.message);
            }
            console.log(error.config);
        })
        return () => {
            setUpdateObjectData(false);
        };
    }, [updateObjectData]);

    useEffect(() => {
        axios.get(getExtrasUrl(id))
            .then((response)=>{
                if(response.data !== []){
                    if(response.status === 200){
                        setExtrasList(response.data);
                    }
                }
            });
        return () => {
            setUpdateExtras(false);
        };
    }, [updateExtras]);

    useEffect(() => {
        setTimeout(()=>{
            setLoadPercentage(100);
            setLoadStatus(true);
        },6000);
        return(setLoadStatus(false))
    }, []);


    const prepararPins = (fetchedPinsObject) => {

        if(fetchedPinsObject !== undefined)
        {
            let newPins=[]
            for (let hotspot of fetchedPinsObject ){
                hotspot.frameId=hotspot.idFrame;
                hotspot.id=hotspot.idHotspot;
                hotspot.recordingSessionId=null;
                newPins.push(hotspot)
            }
            return newPins;
        }
        return [];
    }

    function getArraySrcPath(escena){
        let n = Object.keys(escena.imagenes).length;
        let [aux,escenaNumber,temp,frames,nameImage]= [];
        if(n!==0){
            [aux,escenaNumber,temp,frames,nameImage]= escena.imagenes[1].path.split("/");

        }


        let arrayFrames=[]
        for(let i=1;i<=n;i++){

            arrayFrames.push(completeImageUrl(`/${id}/${escenaNumber}/frames_compresos/${i}.jpg`));
        }

        if(imgForInfoModal === ""){
            if(arrayFrames.length>0){
                setImgForModal(arrayFrames[0]);
            }
        }

        return arrayFrames;
    }

    function handleClickExtras() {
        console.log(!visibleExtras);
        setVisibleExtras(!visibleExtras);
        extraContainerRef.current.classList.toggle("no-visible");
    }

    const pinClickHandler = (pin) => {
        console.log(pin);
        let extraInHotspot = searchExtra(pin.idExtra);
        console.log(extraInHotspot)
        //setVisibleExtras(true);

        if(extraContainerRef.current.classList.contains("no-visible")){
            extraContainerRef.current.classList.toggle("no-visible");
        }

        if(extraInHotspot.hasOwnProperty("imagen")){
            setVisibleExtras(true);
            extraInViewRef.current.onExtra(pin.idExtra);
        }
        else if(extraInHotspot.hasOwnProperty("enlace")){
            setOpenYoutubeModal(true);
            setExtraPdfOrVideo(extraInHotspot);
            console.log('enlace video')
        }
        else if(extraInHotspot.hasOwnProperty("path")){
            console.log("pdf")
            setExtraPdfOrVideo(extraInHotspot);
            setOpenPdfModal(true);
        }

    };

    const searchExtra=(extraId)=>{
        console.log(extrasList);
        return extrasList.find(x => x.idextra === extraId);
    }

    function handlePrev() {
        tridiRef.current.prev();
    }
    function handleNext() {
        tridiRef.current.next();
    }

    const zoomValueHandler = (valorZoom) => {
        zooom=valorZoom;
    }

    const  handleZoomIn = () => {
        zooom=zooom+0.3;
        tridiRef.current.setZoom(zooom);
        if (zooom > 1) {
            tridiRef.current.toggleMoving(true)
        }
        if (zooom === 1) {
            tridiRef.current.toggleMoving(false)
        }
    }
    const handleZoomOut = () => {
        //setZooom(zooom-0.1);
        zooom = zooom -0.1
        tridiRef.current.setZoom(zooom );
        if (zooom > 1) {
            tridiRef.current.toggleMoving(true)
        }
        if (zooom === 1) {
            tridiRef.current.toggleMoving(false)
        }
    }
    const handleAutoPlay = () => {
        setIsAutoPlayRunning(!isAutoPlayRunning);
        tridiRef.current.toggleAutoplay(!isAutoPlayRunning);
    }
    const handleWheel = (e) => {
        if(!sphereImageInView){
            e.deltaY > 0 ? handleZoomOut() : handleZoomIn();
        }
    }

    const handleButtonEscena=useCallback((escena)=>{
        setActiveEscena(escena.toString())
        setPins(prepararPins(hotspotsMap[escena]));
    },[activeEscena,hotspotsMap]);

    useEffect(() => {
        async function fetchData() {
            const myDiv = tridiContainerRef.current;
            let activeTridi = Array.from(myDiv.querySelectorAll('.visible .info-value '))[0];

            if(activeTridi !== undefined) {
                let actualFrame = parseInt(activeTridi.innerHTML);
                let previousFrame = currentFrameIndex;
                if(actualFrame>previousFrame){
                    for(let i = actualFrame;i>previousFrame;i--){
                        await tridiRef.current.prev();
                    }
                }else {
                    for(let i = actualFrame;i<previousFrame;i++){
                        await tridiRef.current.next();
                    }
                }
            }
        }
        fetchData();

        if(tridiRef.current!== null){
            tridiRef.current.toggleAutoplay(isAutoPlayRunning)
        }


    }, [activeEscena]);

    const frameChangeHandler = (currentFrameIndex) => {
        setCurrentFrameIndex(currentFrameIndex);
    };

    useEffect(() => {
        if(addHotspotMode===true){
            toast.info('Doble Click sobre la pantalla para crear el hotspot',{autoClose: 3000,
                hideProgressBar: true,theme:"dark"});
        }
    }, [addHotspotMode]);

    const postNewHotspots = (id, nombreEscena,arrayHotspots) => {
        return axios.post(postAddHotspot(id,nombreEscena),arrayHotspots);
    }

    const myRenderPin = (pin) => {

        let aux ;
        if(pin.tipo === "imagen" ){
            aux= <FaImage></FaImage>;
        }
        else if(pin.tipo === "pdf"){
            aux = <FaFile></FaFile>;
        }
        else if(pin.tipo === "youtube"){
            aux = <FaFilm></FaFilm>;
        }
        else{
            aux= "+"
        }

        ReactTooltip.rebuild()
        return (
            <>
                <div data-tip={"test"} data-for='test'>

                    <label  >
                        <div id="b3"

                             className="button-hotspot"
                        >
                            {
                                aux
                            }
                        </div>

                    </label>
                    {
                        /*
                        *   <ReactTooltip id="test" place="top" effect="solid" getContent={(dataTip=>dataTip)}>
                    </ReactTooltip>
                        * */
                    }

                </div>
            </>
        );
    }


    function handleOnLoad(load_success, percentage) {
        console.log(load_success,percentage)
        setLoadPercentage(percentage);
        if (percentage === 100) {
            setLoadStatus(true)
        }
    }

    function handleDeleteHotspot(nameHotspot) {
        let escenas=objetoData.escenas;
        const searchHotspot = (indexEscena) => {
            let arrayFramesId = [];
            for (let frame in escenas[indexEscena].imagenes){
                for(let value in escenas[indexEscena].imagenes[frame].hotspots){
                    let tempHotspot = escenas[indexEscena].imagenes[frame].hotspots[value];
                    if(tempHotspot.nombreHotspot === nameHotspot){
                        arrayFramesId.push(escenas[indexEscena].imagenes[frame].path.split('/')[3].split('.')[0]);
                    }
                }
            }
            return arrayFramesId;
        }

        setAwaitAddHotspot(true);

        console.log(escenas[activeEscena].nombre);

        if( escenas[activeEscena].nombre === "puertas_abiertas" || escenas[activeEscena].nombre === "puertas_cerradas"){
            let hotspotsDeleteAbiertas = searchHotspot("0");
            let hotspotsDeleteCerradas = searchHotspot("1");
            console.log(hotspotsDeleteAbiertas)
            console.log(hotspotsDeleteCerradas)
            axios.post(deleteHotspot(id,"puertas_abiertas",nameHotspot),hotspotsDeleteAbiertas)
                .then((response)=>{
                    axios.post(deleteHotspot(id,"puertas_cerradas",nameHotspot),hotspotsDeleteCerradas)
                        .then(response =>{
                            toast.success(`Hotspot  ${nameHotspot} eliminado`,{autoClose: 2000,
                                hideProgressBar: true,theme:"dark"});
                            setUpdateHotspots(true);
                            setAwaitAddHotspot(false);
                    }).catch(error => {
                        console.log(error)
                        console.log(error.config);
                        setUpdateHotspots(true);
                        setAwaitAddHotspot(false);
                        toast.error(`Error: + ${error}`,{autoClose: 3000,
                            hideProgressBar: true,theme:"dark"});
                    });
                })
                .catch(error => {
                    if(error.response){
                        console.log(error.response);
                    }else if(error.request){
                        console.log(error.request)
                    }else{
                        console.log('Error ',error.message);
                    }
                    console.log(error.config);
                    toast.error(`Error: + ${error}`,{autoClose: 3000,
                        hideProgressBar: true,theme:"dark"});
                    setUpdateHotspots(true);
                    setAwaitAddHotspot(false);
                });
        }else{
            let arrayHotspot = searchHotspot(activeEscena);
            axios.post(deleteHotspot(id,activeEscena,nameHotspot),arrayHotspot)
                .then(response =>{
                    toast.success(`Hotspot: + ${nameHotspot} creado`,{autoClose: 2000,
                        hideProgressBar: true,theme:"dark"});
                    setUpdateHotspots(true);
                    setAwaitAddHotspot(false);
                }).catch(error => {
                toast.error(`Error: + ${error}`,{autoClose: 3000,
                    hideProgressBar: true,theme:"dark"});
                setUpdateHotspots(true);
                setAwaitAddHotspot(false);
            });
        }
    }

    const botonesEscenas=useMemo(()=>
            <>
                {
                    Object.entries(objetoData.escenas).map((escena,index) => (
                        <ButtonEscena key={
                            escena[0]
                        }
                                      escenaInfo={escena}
                                      onClick={()=>handleButtonEscena(index)}
                                      activo={
                                          index.toString() === activeEscena
                                      }
                        ></ButtonEscena>
                    ))}
            </>
        ,[handleButtonEscena,objetoData]
    )

    const handleOpenModalInfoObject = () => {
        setOpenModalInfoObject(false);
    }

    const botonInfoObject=()=>{
        return <>
            <PopupInfoObjetct imgForInfoModal={imgForInfoModal} infoObjectData={infoObjectData} handleOpenModalInfoObject={()=>handleOpenModalInfoObject()} openModalInfoObject={openModalInfoObject}></PopupInfoObjetct>
            <img ref={tridiModalInfo} className="visualizador_btn-share-img cursor-pointer btn-info-margin" src="/iconos/btn-informacion.png" alt=""
                 onClick={()=> {
                     setOpenModalInfoObject(true);
                 }
            }/>
        </>
    }
    const botonCompartir=()=>{
        const handleCloseModalCompartir = ()=>{
            setOpenModalCompartir(false);
        }
        const handleOpenModalCompartir = ()=>{
            setOpenModalCompartir(true);
        }

    return <>
        <PopupCompartir openModalCompartir = {openModalCompartir} handleCloseModalCompartir={()=>handleCloseModalCompartir()}></PopupCompartir>
        <img className="visualizador_btn-share-img cursor-pointer" onClick={() =>handleOpenModalCompartir()} src="/iconos/btn-compartir.png" alt=""/>
    </>

    }
    const addPdfVis=(file)=>{console.log(file)}
    const convertToSlug=(Text)=> {
        return Text.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    const handleCreateHotpotsExtra=(titulo="",type,file=null,linkYoutube="",extra=null)=>{

        if(type==="pdf"){
            let bodyFormData = new FormData();
            bodyFormData.append('extra', file);
            axios({
                method: "post",
                url: addExtraPdf(id,convertToSlug(file.name),titulo, titulo),
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    if(response.status === 200){
                        console.log(response)
                        setHotspotType('pdf');
                        //setLongPressed(false);
                        setExtraSelected(response.data);
                        setNameHotspot(titulo);
                        setAddHotspotMode(true);
                    }
                })
                .catch(function (response) {
                    console.log(response);
                    toast.error('Error en el envio',{autoClose: 2000,
                        hideProgressBar: true,theme:"dark"});
                });
        }
        else if(type==="video_youtube"){
            console.log(linkYoutube)
            axios.post(addLinkYoutube(id, 'test', linkYoutube))
                .then(res => {
                    if(res.status===200){
                        setHotspotType('youtube');
                        setExtraSelected(res.data);
                        setNameHotspot(titulo);
                        setAddHotspotMode(true);
                    }
                })
                .catch(function (response) {
                    toast.error('Error',{autoClose: 2000,
                        hideProgressBar: true,theme:"dark"});
                    console.log(response);
                });
        }
        else if(type==="vincular_extra" ){
                if(extra!== null){
                    console.log(extra);
                    setHotspotType('imagen');
                    setExtraSelected(extra);
                    setNameHotspot(titulo);
                    setAddHotspotMode(true);
                }else{
                    toast.error('Porfavor seleccione un extra',{autoClose: 2000,
                        hideProgressBar: true,theme:"dark"});
                }
        }
    }

    const onLongPress = () => {
        /*if(newHotspot === true){
            setLongPressed(true);
        }*/
    };

    const onClick = () => {
        /*
        if (addHotspotMode) {
            tridiRef.current.toggleRecording(false);
            console.log('onclick')
        }*/
    }
    const onPressEnd = () => {
        /*
        if(newHotspot === true){
            setLongPressed(false)
            tridiRef.current.toggleRecording(true)
        }*/

    }
    const defaultOptions = {
        shouldPreventDefault: false,
        delay: 100,
    };

    const longPressEvent = useLongPress(onLongPress, onClick,onPressEnd, defaultOptions);
    const onMouseUp = (ev) => {
        /*
        if(newHotspot === true){
            //ev.stopPropagation()
            setLongPressed(false);
        }*/
    }

    const loadAllTridiComponents=()=>{
        if(objetoData){
            let escenas=objetoData.escenas;
            let escenasSrcImages=[];
            let show=false;
            for (let index in escenas){
                show=activeEscena===index
                let imagesSrcOneScene = getArraySrcPath(escenas[index]);
                if(imagesSrcOneScene.length === 0 ){
                    escenasSrcImages.push(
                        <div className="emptyEscena ">
                            <h2 className="texto-blanco">Escena vacia</h2>
                            <br></br>
                            <LottieEmptyEscenas></LottieEmptyEscenas>
                        </div>
                    )
                }else{
                    escenasSrcImages.push(
                        <Tridi ref={  show  ? tridiRef :null}
                               key={index}
                               className={` ${ addHotspotMode ? " addHotspotCursor " : ""}  +${show && loadStatus? " visible" : " oculto"} `}
                               images={imagesSrcOneScene}
                               autoplaySpeed={70}
                               zoom={1}
                               maxZoom={3}
                               minZoom={1}
                               onZoom={zoomValueHandler}
                               onFrameChange={frameChangeHandler}
                               touch={true}
                               touchDragInterval={3}
                               onAutoplayStart={
                                   () => show ? setIsAutoPlayRunning(true):null
                               }
                               onAutoplayStop={
                                   () => show ? setIsAutoPlayRunning(false):null
                               }

                               onPinClick={pinClickHandler}
                               setPins={setPins}
                               renderPin={myRenderPin}
                               showStatusBar={true}
                               pins={pins}
                               showControlBar={false}
                        />
                    )
                }
            }

            return (
                <div className={`tridi-container`}    onMouseUp={onMouseUp}  onWheel={handleWheel} >
                    {
                        /*...longPressEvent*/
                        loadStatus === false ? <div className="sweet-loading">
                            <DotLoader color="#3F3F3F"
                                       loading={
                                           !loadStatus
                                       }
                                       size={70}/>
                            {/*<h1>{loadPercentage}
                            %
                        </h1>*/}
                        </div> : null
                    }
                    <div className={"imagesContainer"} onDoubleClick={clickOnTridi} ref={containerRef}>
                        {escenasSrcImages}
                    </div>
                </div>
            );
        }
        return <h1>holaa</h1>
    }

    const replicateFrames = (indexEscena, lastPin) => {
        let move = 0.014;
        let j=20;
        let aux=j;
        let arrayHotspots=[];

        let originalX = parseFloat(lastPin.x);
        let originalY = lastPin.y;

        console.log(frames[indexEscena])

        if(lastPin.frameId > frames[indexEscena]){
            lastPin.frameId = frames[indexEscena]-1;
            lastPin.idFrame = frames[indexEscena]-1;
        }
        console.log(lastPin)

        if(lastPin.frameId -j > 0  && lastPin.frameId + j <=frames[indexEscena]){

            console.log('entra 1');
            for(let i=lastPin.frameId-j;i<=lastPin.frameId+j;i++){
                let newPin={
                    idframe:i,
                    nombreHotspot:nameHotspot,
                    idExtra:extraSelected.idextra,
                    tipo: hotspotType,
                    x:originalX+move*aux,
                    y:parseFloat(originalY),
                }
                if(j===0){
                    newPin={
                        idframe:i,
                        nombreHotspot:nameHotspot,
                        idExtra:extraSelected.idextra,
                        x:originalX,
                        y:parseFloat(originalY),
                        tipo:hotspotType,
                        //type:hotspotType
                    }
                }
                arrayHotspots.push(newPin)
                aux--;
            }


        }else if(lastPin.frameId - j < 0 ){
            console.log('entra 2');

            let k=0;
            for(let i=lastPin.frameId;i<=j+lastPin.frameId;i++){
                let newPin={
                    idframe:i,
                    nombreHotspot:nameHotspot,
                    idExtra:extraSelected.idextra,
                    tipo:hotspotType,
                    x:originalX+move*-k,
                    y:parseFloat(originalY),
                }
                if(newPin.idframe===0){

                }else{
                    arrayHotspots.push(newPin)
                }
                k++;
            }
            k=-j;
            let h= lastPin.frameId -j +frames[indexEscena]
            for(let i = lastPin.frameId -j;i<lastPin.frameId;i++){
                if(h===frames[indexEscena]){
                    h=0;
                }
                if(h!==0){
                    let newPin={
                        idframe:h,
                        nombreHotspot:nameHotspot,
                        idExtra:extraSelected.idextra,
                        x:originalX+move*-k,
                        y:parseFloat(originalY),
                        tipo:hotspotType
                        //type: hotspotType
                    }
                    arrayHotspots.push(newPin)
                }

                h++;
                k++;

            }

        }
        else if(lastPin.frameId+j > frames[indexEscena]){
            console.log('entra 3');
            let k=0;
            for(let i=lastPin.frameId;i>lastPin.frameId-j;i--){
                let newPin={
                    idframe:i,
                    nombreHotspot:nameHotspot,
                    idExtra:extraSelected.idextra,
                    x:originalX-move*k,
                    y:parseFloat(originalY),
                    tipo:hotspotType,
                    //type:hotspotType
                }
                arrayHotspots.push(newPin)
                k--;
            }
            k=0
            let h= lastPin.frameId +1;
            for(let i = lastPin.frameId ;i<lastPin.frameId+j;i++){
                if(h===frames[indexEscena]){
                    h=0;
                }
                if(h!==0){
                    let newPin={
                        idframe:h,
                        nombreHotspot:nameHotspot,
                        idExtra:extraSelected.idextra,
                        x:originalX-move*k,
                        y:parseFloat(originalY),
                        tipo:hotspotType
                        //type:hotspotType
                    }
                    arrayHotspots.push(newPin)
                }

                h++;
                k++;

            }

        }
        console.log(lastPin.frameId);
        console.log(arrayHotspots);
        return arrayHotspots;
    }
    const frameReplicateOneReference=(lastPin)=>{
        if(objetoData.escenas[activeEscena].nombre === "puertas_cerradas" || objetoData.escenas[activeEscena].nombre === "puertas_abiertas"){

            let ultimoPin= {...lastPin};
            let ultimoPinV2 = {...lastPin};
            let arrayPuertasCerradas =  replicateFrames("0",ultimoPin);
            let arrayPuertasAbiertas =  replicateFrames("1",ultimoPinV2);



            postNewHotspots(id,"puertas_cerradas",arrayPuertasCerradas).then(
                response=>{
                    console.log(response);
                    postNewHotspots(id, "puertas_abiertas",arrayPuertasAbiertas).then(
                        response => {
                            toast.success(`Hotspot  ${nameHotspot} creado`,{autoClose: 2000,
                                hideProgressBar: true,theme:"dark"});
                            setUpdateObjectData(true);
                            setUpdateExtras(true);
                            setAwaitAddHotspot(false);
                            setAddHotspotMode(false)
                            setUpdateHotspots(true);
                            //setLongPressed(false);
                        }).catch(
                        (e)=>{
                            toast.error('ha ocurrido un error',{autoClose: 3000,
                                hideProgressBar: true,theme:"dark"});
                            console.log(e)
                            setAwaitAddHotspot(false);
                        }
                    )
                }
            ).catch(
                (e)=>{

                    toast.error('ha ocurrido un error',{autoClose: 3000,
                        hideProgressBar: true,theme:"dark"});
                    console.log(e)
                    setAwaitAddHotspot(false);
                }
            )
            setAwaitAddHotspot(false);
        }else{
            let arrayEscena = replicateFrames(activeEscena);

            postNewHotspots(id, objetoData.escenas[activeEscena].nombre ,arrayEscena).then(
                response => {
                    console.log(response);
                    setUpdateObjectData(true);
                    setUpdateExtras(true);
                    setAwaitAddHotspot(false);
                    setAddHotspotMode(false)
                    setUpdateHotspots(true);
                    //setLongPressed(false);
                    toast.success(`Hotspot  ${nameHotspot} creado`,{autoClose: 2000,
                        hideProgressBar: true,theme:"dark"});
                }).catch(
                (e)=>{
                    toast.error('ha ocurrido un error',{autoClose: 3000,
                        hideProgressBar: true,theme:"dark"});
                    console.log(e)
                    setAwaitAddHotspot(false);
                }
            )
        }

    }

    const clickOnTridi = (e) => {
        if(addHotspotMode){
            setAwaitAddHotspot(true);
            let viewerWidth = containerRef.current.clientWidth;
            let viewerHeight = containerRef.current.clientHeight;
            let clientX = e.clientX - (viewerWidth - viewerWidth) / 2;
            let clientY = e.clientY - (viewerHeight - viewerHeight) / 2;
            let viewerOffsetLeft = containerRef.current.getBoundingClientRect().left;
            let viewerOffsetTop = containerRef.current.getBoundingClientRect().top;
            let x = ((clientX - viewerOffsetLeft) / viewerWidth).toFixed(6);
            let y = ((clientY - viewerOffsetTop) / viewerHeight).toFixed(6);
            let newPin = {
                x: x,
                y: y,
                frameId:currentFrameIndex,
                idFrame:currentFrameIndex,
            };
            frameReplicateOneReference(newPin);
        }
    }
    const youtube_parser = (url="") => {

        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length===11)? match[7] : false;
    }
    const modalVideoYoutube=useCallback(()=>{
        return (
            <ModalVideo channel='youtube' autoplay isOpen={openYoutubeModal} videoId={youtube_parser(extraPdfOrVideo.enlace)} onClose={() => setOpenYoutubeModal(false)} />
        );

    },[openYoutubeModal])
    const modalPdf = ()=>{

        let url = getPDF(id,extraPdfOrVideo.path);

        //console.log(url);
        return (
            openPdfModal?
            <div className={"modal-pdf-container"} >
                <Popup open={openPdfModal} className={"pdf-modal"} onClose={ ()=>setOpenPdfModal(false)} position="right center">
                    <div className={"container-iframe-modal"}>
                        <iframe id="iframepdf" src={url} title="myFrame"></iframe>
                        <button className={"button-option-pdf-modal"} onClick={()=>setOpenPdfModal(false)}>Cerrar</button>
                    </div>
                </Popup>
            </div>
                : null
        );
    }
    const buttonCloseReel= () =>{
        return <>
                <div className="visualizador_close-reel-button" onClick={handleClickExtras}>
                    <div className="visualizador_close_container_icon">
                        <BsChevronDown className="visualizador_close-reel-icon"></BsChevronDown>
                    </div>
                </div>
        </>

    }
    const buttonOpenReel = ()=>{
        if(!visibleExtras)
        return (
            <div className={"visualizador_open-reel-button "} onClick={handleClickExtras}>
                <div className="visualizador_open_container_icon">
                    <BsChevronUp></BsChevronUp>
                </div>
            </div>
        );
        else return "";

    }
    const botonAgregarHotspot=()=>{
        if(isEditMode){
            return <div>
                <PopupNewHotspot id={id} extras={extras} addPdfVis={addPdfVis} handleCreateHotpotsExtra={handleCreateHotpotsExtra}
                                 listaHotspots={hotspotsMap[activeEscena]} onClickDeleteHotspot={handleDeleteHotspot}
                ></PopupNewHotspot>
        </div>
        }
        else{
            return null;
        }
    }
    const botonAutoGiro=()=>{
        return <div className={`button-escena_navigation-item`}  onClick={()=>handleAutoPlay()}>
            <button  data-for='soclose1' data-tip="Girar" className={`button-escena-btn ${isAutoPlayRunning ? "activo":""}`} >
                <img src="/iconos/giro-carro.png" alt=""/>
            </button>
            <ReactTooltip  id="soclose1" place="right" effect="solid"  disable={isMobile}> Girar
            </ReactTooltip>
        </div>
    }
    const botonModoEdicion =()=>{
        function handleActivateEditMode() {
            setIsEditMode(!isEditMode)
        }
        return <ToogleButton isEditMode={isEditMode} handleActivateEditMode={handleActivateEditMode}></ToogleButton>;
    }
    const logoCompany = ()=>{
        return <div className="logo-company">
            <img src="/icono.png" alt=""/>
        </div>
    }

    return (
        <div className="visualizador dragging">
            {logoCompany()}
            {buttonOpenReel()}
            <ToastContainer />
            <div className="visualizador_top-buttons ">
                {botonCompartir()}
                {botonInfoObject()}
                {botonAgregarHotspot()}
            </div>
            {botonModoEdicion()}
            {modalPdf()}
            {modalVideoYoutube()}


            <div ref={extraContainerRef} className="visualizador_reel">
                {buttonCloseReel()}
                <ReelImages id={id}
                            ref={extraInViewRef}
                            extrasImages={extras}
                            isEditMode={isEditMode}></ReelImages>
            </div>
            <div  ref={tridiContainerRef} className="tridi-container">
                {
                    loadAllTridiComponents()
                }
            </div>

            <div className="visualizador_navigation-container">
                {botonesEscenas}
                {botonAutoGiro()}
            </div>

            {
                awaitAddHotspot
                    ?  <div className="await-hotspot"><DotLoader color="#16A085 "></DotLoader> </div>
                    : null
            }


            {
                tipo === "vehiculo" ? null /*<NavigationCarButtons onOpenDoors={handleOpenDoors} onCloseDoors={handleCloseDoors}  onInterior={handleInterior}></NavigationCarButtons>*/ : null /*<NavigationObjectButttons ></NavigationObjectButttons>*/
            } </div>
    );
}
