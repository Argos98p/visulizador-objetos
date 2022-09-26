import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import Tridi from "react-tridi";
import OptionButtons from "./botones/buttonsOptions";
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
    addLinkYoutube
} from "../Api/apiRoutes";
import ButtonEscena from "./botones/buttonEscena";
import LottieEmptyEscenas from "../Animations/lottieEmptyEscena";

import PopupNewHotspot from "./popup/PopupAddHotspot";
import ReactTooltip from "react-tooltip";
import 'reactjs-popup/dist/index.css';
import "react-tridi/dist/index.css";
import "./visualizador_style.css";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DotLoader from "react-spinners/DotLoader";
import PopupInfoObjetct from "./popup/PopupInfoObjetct";
import {BsChevronDown, BsChevronUp, BsShareFill} from "react-icons/bs";
import PopupCompartir from "./popup/PopupCompartir";
import ToogleButton from "./botones/ToogleButton";


export function Visualizador({tipo, id,data, extras}) {

    const [objetoData,setObjetoData] = useState({escenas:{}});
    const [frames, setFrames] = useState([]);
    const [hotspotsMap, setHotspotsMap] = useState([]);
    const [updateHotspots, setUpdateHotspots] = useState(false); //variable para que se vuelva a pedir los hotspots
    const [awaitAddHotspot, setAwaitAddHotspot] = useState(false); //varaible para saber si los hotspots ya se cargaron en el server
    const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [pins, setPins] = useState([]);
    const [visibleExtras, setVisibleExtras] = useState(true);
    const [addHotspotMode, setAddHotspotMode] = useState(false); //variable para definir cuando con el click se agrega un nuevo hotspot  y para mostrar inicio y fin
    const [nameHotspot, setNameHotspot] = useState("holis");
    const [extraSelected, setExtraSelected] = useState(null);
    const [newHotspot, setNewHotspot] = useState(false); // para el use effect que usa pins.legth
    const [loadStatus, setLoadStatus] = useState(false);
    const [loadPercentage, setLoadPercentage] = useState(0);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [hotspotInit, setHotspotInit] = useState(false);
    const [hotspotEnd, setHotspotEnd] = useState(false);
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

    const extraContainerRef=useRef();
    const extraInViewRef = useRef();
    const tridiRef = useRef(null);
    const tridiContainerRef = useRef(null);

    let zooom=1;

    const handlers = useSwipeable({
        onSwiping: (eventData) => leftSwip(eventData),
        delta: { left: 1, right: 1 }
    });

    const leftSwip=(eventData)=>{
        if(prevDelta > eventData.deltaX){
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
    }

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
                console.log(mapHotspots)
                setHotspotsMap(mapHotspots);
                setPins(prepararPins(mapHotspots[activeEscena]));
            });

return ()=>setUpdateHotspots(false);
    }, [objetoData, updateHotspots]);

    useEffect(() => {
        setTimeout(()=>{
            setLoadPercentage(100);
            setLoadStatus(true);
        },6000);
        return(setLoadStatus(false))
    }, []);

    /*
    useEffect(() => {
        if(updateHotspots===true){
            console.log('recibe nuevamente pins')
            let promesass=[];
            let mapHotspots={};
            for(let escena in objetoData.escenas){
                let nombreEscena=objetoData.escenas[escena].nombre
                promesass.push(
                    axios.get(getHotspots(id,nombreEscena))
                        .then(response=>{
                            mapHotspots[nombreEscena]=response.data;
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
            Promise.all(promesass).then(()=> {
                setHotspotsMap(mapHotspots);
                prepararPins(mapHotspots)
                setPins(mapHotspots[currentEscena.nombre])
            });
        }
        return () => {
            setUpdateHotspots(false)
        };
    }, [updateHotspots]);*/

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

    /*
    useEffect(() => {
        let timer1 = setTimeout(()=>{},10)
        if(currentEscena.imagenes!== undefined) {
            setLoadStatus(false)
            timer1=setTimeout(() => setLoadStatus(true), 3000);
            setFrames(getArraySrcPath(currentEscena));
            setPins(hotspotsMap[currentEscena.nombre]);
            setSphereImageInView(false);
            //setAux(currentEscena.nombre)
        }
        return () => {
            clearTimeout(timer1);
        };

    }, [currentEscena]);*/

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


    const recordStartHandler = (recordingSessionId) => /*console.log("on record start", {recordingSessionId, pins})*/
        console.log();
    const recordStopHandler = (recordingSessionId) => /* console.log("on record stop", {recordingSessionId, pins})*/
        console.log();
    const pinClickHandler = (pin) => {
        let extraInHotspot = searchExtra(pin.idExtra);

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
        return extras.find(x => x.idextra === extraId);
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



    const move=(a,b)=>{
        if(a<b){

                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();

        }
        if(a>b){

                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                tridiRef.current.prev();
                console.log('entra');

        }
    }


    useEffect(() => {
        console.log(tridiRef)
            if(tridiRef.current!== null){
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
                tridiRef.current.next();
            }
    }, [activeEscena]);

        /*
        const myDiv = tridiContainerRef.current;
        let activeTridi = Array.from(myDiv.querySelectorAll('.visible .info-value '))[0];
        if(activeTridi !== undefined){
            let actualFrame = parseInt(activeTridi.innerHTML);
            let previousFrame= currentFrameIndex;
            move(actualFrame,previousFrame);

        }*/


    const frameChangeHandler = (currentFrameIndex) => {
        setCurrentFrameIndex(currentFrameIndex);
    };

    /****** Inicio ---- HOTSPOTS UNA REFERENCIA ******/

    const handleCreateHotspot=(imgExtra,info)=>{

        if (info === "" || imgExtra == null
        ) {
            console.log('Informacion erronea')
        } else {
            tridiRef.current.toggleRecording(true)
            setExtraSelected(imgExtra);
            setNameHotspot(info);
            setAddHotspotMode(true);
            setNewHotspot(true);
        }
    }

    useEffect(() => {
        if(newHotspot===true){
            toast.info('clicke o pulse sobre la pantalla para crear el hotspot',{autoClose: 3000,
                hideProgressBar: true,theme:"dark"});
        }
    }, [newHotspot]);

    const clickOnTridiContainer = () => {
        if (addHotspotMode) {
            tridiRef.current.toggleRecording(false);
        }
    }
    const frameReplicateOneReference=()=>{


        let lastPin= pins[pins.length-1];
        let move = 0.014;
        let j=10;
        let aux=j;
        let arrayHotspots=[];

        let originalX = parseFloat(lastPin.x);
        let originalY = lastPin.y;

        if(lastPin.frameId -j > 0  && lastPin.frameId + j <=frames[activeEscena]){

            console.log('entra 1');
            for(let i=lastPin.frameId-j;i<=lastPin.frameId+j;i++){
                let newPin={
                    idframe:i,
                    nombreHotspot:nameHotspot,
                    idExtra:extraSelected.idextra,
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
                    x:originalX+move*k,
                    y:parseFloat(originalY),
                }
                arrayHotspots.push(newPin)
                k++;
            }
            k=-j;
            let h= lastPin.frameId -j +frames[activeEscena]
            for(let i = lastPin.frameId -j;i<lastPin.frameId;i++){
                if(h===frames[activeEscena]){
                    h=0;
                }
                if(h!==0){
                    let newPin={
                        idframe:h,
                        nombreHotspot:nameHotspot,
                        idExtra:extraSelected.idextra,
                        x:originalX+move*k,
                        y:parseFloat(originalY),
                    }
                    arrayHotspots.push(newPin)
                }

                h++;
                k++;

            }

        }
        else if(lastPin.frameId+j > frames[activeEscena]){
            console.log('entra 3');
            let k=0;
            for(let i=lastPin.frameId;i>lastPin.frameId-j;i--){
                let newPin={
                    idframe:i,
                    nombreHotspot:nameHotspot,
                    idExtra:extraSelected.idextra,
                    x:originalX+move*k,
                    y:parseFloat(originalY),
                }
                arrayHotspots.push(newPin)
                k--;
            }
            k=0
            let h= lastPin.frameId +1;
            for(let i = lastPin.frameId ;i<lastPin.frameId+j;i++){
                if(h===frames[activeEscena]){
                    h=0;
                }
                if(h!==0){
                    let newPin={
                        idframe:h,
                        nombreHotspot:nameHotspot,
                        idExtra:extraSelected.idextra,
                        x:originalX+move*k,
                        y:parseFloat(originalY),
                    }
                    arrayHotspots.push(newPin)
                }

                h++;
                k++;

            }

        }


        console.log(objetoData.escenas[activeEscena].nombre)
        console.log(arrayHotspots)
        postNewHotspots(id,objetoData.escenas[activeEscena].nombre,arrayHotspots).then(
            response=>{
                console.log(response)
                setAwaitAddHotspot(false);
                setAddHotspotMode(false)
                setUpdateHotspots(true);
                setNewHotspot(false);
            }
        ).catch(
            (e)=>{
                console.log(e)
                setAwaitAddHotspot(false);
            }
        )

    }

    useEffect(() => {
        if (pins.length !== 0 && newHotspot === true) {
            setAwaitAddHotspot(true);
            frameReplicateOneReference(pins[pins.length-1]);
        }
    }, [pins]);

    const postNewHotspots = (id, nombreEscena,arrayHotspots) => {
        return axios.post(postAddHotspot(id,nombreEscena),arrayHotspots);
    }

    /****** Fin ---- HOTSPOTS UNA REFERENCIA ******/


    /****** Inicio ---- FUNCIONALIDAD PARA AGREGAR HOTSPOTS******/

    /*
        function postNewHotspots(id, nombreEscena,arrayHotspots){
            return axios.post(postAddHotspot(id,currentEscena.nombre),arrayHotspots);
        }


        function frameReplicateV2() {
            console.log('entra en replicate')
            let init=pins.slice(-2)[0];
            let end=pins.slice(-2)[1];
            let incre=0;
            let arrayHotspots = [];
            let newPin={};

            if(init.frameId>end.frameId){
                let n=frames.length-init.frameId+end.frameId;
                let k=(init.x-end.x)/n
                let temp = init.frameId+n;
                let desY= (parseFloat(init.y)-parseFloat(end.y))/n;
                for(let i= init.frameId;i < temp; i++){
                    if(i === frames.length){
                        i=0
                        temp=end.frameId
                    }
                    newPin = {
                        idframe:i+1,
                        nombreHotspot:nameHotspot,
                        x: parseFloat(init.x) - k*incre,
                        y: parseFloat(init.y) -desY*incre,
                        idExtra:extraSelected.idextra
                    }
                    incre++;
                    arrayHotspots.push(newPin);
                    if(i!==0){
                    }

                }

            }else{
                let numFrames=end.frameId - init.frameId;
                let k= (parseFloat(init.x)-parseFloat(end.x))/numFrames;
                let desY= (parseFloat(init.y)-parseFloat(end.y))/numFrames;
                for(let i= init.frameId;i < end.frameId; i++){
                    newPin = {
                        idframe:i+1,
                        nombreHotspot:nameHotspot,
                        x: parseFloat(init.x) - k*incre,
                        y: parseFloat(init.y) -desY*incre,
                        idExtra:extraSelected.idextra
                    }
                    incre++;
                    arrayHotspots.push(newPin);
                    if(i!==0){
                    }
                }

            }

            postNewHotspots(id,currentEscena.nombre,arrayHotspots).then(
                response=>{
                    console.log(response)
                    setAwaitAddHotspot(false);
                    setAddHotspotMode(false)
                    setHotspotInit(false);
                    setHotspotEnd(false)
                    setUpdateHotspots(true);
                    setNewHotspot(false);

                }
            ).catch(
                (e)=>console.log(e)
            )
        }



        function handleCreateHotspot(imgExtra, info) {
            // FUNCION PARA CONTROLAR SELECCION DE EXTRAS

            if (info === "" || imgExtra == null
            ) {
                console.log('Informacion erronea')
            } else {
                console.log(imgExtra)
                setExtraSelected(imgExtra);
                setNameHotspot(info);
                setAddHotspotMode(true);
                setNewHotspot(true);
            }
        }

        function handleHotspotInit(){
            setHotspotInit(true);
            tridiRef.current.toggleRecording(true);
        }

        function handleHotspotEnd(){
            setHotspotEnd(true);
            tridiRef.current.toggleRecording(true);
        }

        function clickOnTridiContainer() {
            if (addHotspotMode) {
                tridiRef.current.toggleRecording(false);
            }
        }

        useEffect(() => {
            if (pins.length !== 0 && newHotspot === true) {
                if(hotspotInit && hotspotEnd){
                    setAwaitAddHotspot(true);
                    frameReplicateV2();
                }
            }
        }, [pins.length]);




    */
    /****** Fin ---- FUNCIONALIDAD PARA AGREGAR HOTSPOTS******/
    const myRenderPin = (pin) => {
        ReactTooltip.rebuild()
        return (
            <>
                <div data-tip={"test"} data-for='test'>

                    <label  >
                        <div id="b3"

                             className="button-hotspot"
                        >
                            +
                        </div>

                    </label>
                    <ReactTooltip id="test" place="top" effect="solid" getContent={(dataTip=>dataTip)}>
                    </ReactTooltip>
                </div>
            </>
        );
    }

    useEffect(() => {
        ReactTooltip.rebuild();
    });
    function handleOnLoad(load_success, percentage) {
        console.log(load_success,percentage)
        setLoadPercentage(percentage);
        if (percentage === 100) {
            setLoadStatus(true)
        }
    }


    function handleDeleteHotspot(nameHotspot) {
        setAwaitAddHotspot(true);
        let arrayFramesId = [];
        let escenas=objetoData.escenas;

        console.log(escenas[activeEscena])

        for (let frame in escenas[activeEscena].imagenes){
            for(let value in escenas[activeEscena].imagenes[frame].hotspots){
                let tempHotspot = escenas[activeEscena].imagenes[frame].hotspots[value]
                if(tempHotspot.nombreHotspot === nameHotspot){
                    arrayFramesId.push(escenas[activeEscena].imagenes[frame].path.split('/')[3].split('.')[0]);
                }
            }

        }


        axios.post(deleteHotspot(id,escenas[activeEscena].nombre,nameHotspot),arrayFramesId)
            .then((response)=>{
                console.log(response);
                setUpdateHotspots(true);
                setAwaitAddHotspot(false);
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
                setUpdateHotspots(true);
                setAwaitAddHotspot(false);
            });
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
            <img className="visualizador_btn-share-img cursor-pointer btn-info-margin" src="../iconos/btn-informacion.png" alt="" onClick={()=>setOpenModalInfoObject(true)}/>
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
        <PopupCompartir openModalCompartir = {openModalCompartir} handleCloseModalCompartir={()=>handleCloseModalCompartir()}></PopupCompartir>;
        <img className="visualizador_btn-share-img cursor-pointer" onClick={() =>handleOpenModalCompartir()} src="../iconos/btn-compartir.png" alt=""/>
    </>

    }


    const addPdfVis=(file)=>{
        console.log(file)

    }
    const handleCreateHotpotsExtra=(titulo="",type,file=null,linkYoutube="",extra=null)=>{

        if(type==="pdf"){
            let bodyFormData = new FormData();
            bodyFormData.append('extra', file);
            axios({
                method: "post",
                url: addExtraPdf(id,file.name,titulo, titulo),
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    if(response.status === 200){
                        tridiRef.current.toggleRecording(true)
                        setExtraSelected(response.data);
                        setNameHotspot(titulo);
                        setAddHotspotMode(true);
                        setNewHotspot(true);
                    }
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
        }
        else if(type==="video_youtube"){
            console.log(linkYoutube)
            axios.post(addLinkYoutube(id, 'test', linkYoutube))
                .then(res => {
                    if(res.status===200){
                        tridiRef.current.toggleRecording(true)
                        setExtraSelected(res.data);
                        setNameHotspot(titulo);
                        setAddHotspotMode(true);
                        setNewHotspot(true);
                    }
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
        }
        else if(type==="vincular_extra"){
            console.log(extra);
            tridiRef.current.toggleRecording(true)
            setExtraSelected(extra);
            setNameHotspot(titulo);
            setAddHotspotMode(true);
            setNewHotspot(true);
        }
    }
    const loadAllTridiComponents=()=>{
        console.log('all tridi')
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
                               className={show && loadStatus? "visible" : "oculto" }

                               images={imagesSrcOneScene}
                               autoplaySpeed={70}
                               zoom={1}
                               maxZoom={3}
                               minZoom={1}
                               onZoom={zoomValueHandler}
                               onFrameChange={frameChangeHandler}
                               touch={false}
                               onAutoplayStart={
                                   () => setIsAutoPlayRunning(true)
                               }
                               onAutoplayStop={
                                   () => setIsAutoPlayRunning(false)
                               }
                               onRecordStart={
                                   recordStartHandler
                               }
                               onRecordStop={
                                   recordStopHandler
                               }
                               onPinClick={pinClickHandler}
                               setPins={setPins}
                               renderPin={myRenderPin}
                               showStatusBar={true}
                               pins={pins}
                            //hintOnStartup
                            //hintText="Arrastre para mover"
                            //onLoadChange={(e,y)=>console.log(e,y)}
                        />
                    )
                }

            }

            return (

                <div className={`tridi-container`}  {...handlers}  onWheel={handleWheel} onClick={clickOnTridiContainer}>
                    {
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
                    {escenasSrcImages}
                </div>
            );
        }
        return <h1>holaa</h1>
    }

    function youtube_parser(url=""){

        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    const modalVideoYoutube=useCallback(()=>{
        return (
            <ModalVideo channel='youtube' autoplay isOpen={openYoutubeModal} videoId={youtube_parser(extraPdfOrVideo.enlace)} onClose={() => setOpenYoutubeModal(false)} />
        );

    },[openYoutubeModal]
)

    function openModal() {
        setOpenPdfModal(true);
    }

    function closeModal() {
        setOpenPdfModal(false);
    }

    const modalPdf = ()=>{
        return (
            openPdfModal?
            <div className={"modal-pdf-container "} >
                <Popup open={openPdfModal} onClose={ ()=>setOpenPdfModal(false)} position="right center">
                    <div className={"container-iframe-modal"}>
                        <iframe id="iframepdf" src="https://www.africau.edu/images/default/sample.pdf"></iframe>
                        <button className={"button-option"} onClick={()=>setOpenPdfModal(false)}>Cerrar</button>
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
            handleCreateHotspot={handleCreateHotspot}
                                 listaHotspots={hotspotsMap[activeEscena]} onClickDeleteHotspot={handleDeleteHotspot}
                ></PopupNewHotspot>
        </div>
        }
        else{
            return null;
        }
    }

    const botonAutoGiro=()=>{
        return <div className="button-escena_navigation-item" onClick={()=>handleAutoPlay()}>
            <button  data-for='soclose' data-tip="Girar" className={`button-escena-btn`} >
                <img src="../iconos/giro-carro.png" alt=""/>
            </button>
            <ReactTooltip id="soclose" place="top" effect="solid" getContent={(dataTip=>dataTip)}>
            </ReactTooltip>
        </div>
    }

    const botonModoEdicion =()=>{
        function handleActivateEditMode() {
            setIsEditMode(!isEditMode)
        }
        return <ToogleButton isEditMode={isEditMode} handleActivateEditMode={handleActivateEditMode}></ToogleButton>;
    }

    return (
        <div className="visualizador dragging">
            {buttonOpenReel()}
            <ToastContainer />

            <div className="visualizador_top-buttons ">
                {botonCompartir()}
                {botonInfoObject()}
                {botonAgregarHotspot()}
            </div>


            {
                botonModoEdicion()
            }

            {
                /*
                <button className="button-option"
                    onClick={handleActivateEditMode}>
                Modo Edicion
            </button>
                * */
            }



            {modalPdf()}

            {
                modalVideoYoutube()
            }

            {/*
            addHotspotMode ? <div className="start-end-hotspot-buttons">
                <button className="button-option" onClick={handleHotspotInit}>Inicio</button>
                <button className="button-option" onClick={handleHotspotEnd}>Fin</button>
            </div> : null*/
            }

            <div ref={extraContainerRef} className="visualizador_reel">
                {buttonCloseReel()}
                <ReelImages id={id}
                            ref={extraInViewRef}
                            extrasImages={extras}
                            isEditMode={isEditMode}></ReelImages>
            </div>


            <div  ref={tridiContainerRef} className="tridi-container">
                {
                    /*getVisualizador()*/
                    loadAllTridiComponents()
                }
            </div>



            <div className="visualizador_navigation-container">
                {
                    botonesEscenas
                }
                {
                    botonAutoGiro()
                }
            </div>

            {
                awaitAddHotspot
                    ?  <div className="await-hotspot"><DotLoader color="#16A085 "></DotLoader> </div>
                    : null
            }

            <div className="visualizador_container-handle-buttons">
                <OptionButtons /*onAddHotspot={handleAddHostpot}*/
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
}
