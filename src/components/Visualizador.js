import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { useLongPress } from 'use-long-press';
import carInterior from "../360images/360.jpg"
import Tridi from "react-tridi";
import axios from "axios";
import ReelImages from "./reel/ReelImages";
import 'react-modal-video/scss/modal-video.scss';
import ModalVideo from 'react-modal-video';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {
    addExtraPdf,
    addLinkYoutube,
    completeImageUrl,
    getExtrasUrl,
    getHotspots,
    getPDF,
    infoObjectUrl,
    deleteHotspot,
    postAddHotspot, img360CompleteUrl,
} from "../Api/apiRoutes";
import ButtonEscena from "./botones/buttonEscena";
import LottieEmptyEscenas from "../Animations/lottieEmptyEscena";
import PopupNewHotspot from "./popup/PopupAddHotspot";
import ReactTooltip from "react-tooltip";
import "react-tridi/dist/index.css";
import "./visualizador_style.css";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DotLoader from "react-spinners/DotLoader";
import PopupInfoObjetct from "./popup/PopupInfoObjetct";
import {BsChevronDown, BsChevronUp} from "react-icons/bs";
import PopupCompartir from "./popup/PopupCompartir";
import ToogleButton from "./botones/ToogleButton";
import {FaFile, FaFilm, FaImage} from "react-icons/fa";
import {Link, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import {Pannellum} from "pannellum-react";
import useWindowDimensions from "../hooks/useWindowSize";


export function Visualizador({tipo, id,data, extras,edit}) {

    const isMobile = /Mobi|Android/i.test(navigator.userAgent)
    const { height, width } = useWindowDimensions();
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

    const [extraPdfOrVideo, setExtraPdfOrVideo] = useState({});
    const [infoObjectData, setInfoObjectData] = useState("");
    const [imgForInfoModal, setImgForModal] = useState("");
    const [updateObjectData, setUpdateObjectData] = useState(false);
    const [extrasList, setExtrasList] = useState(extras);
    const [updateExtras, setUpdateExtras] = useState(false);
    const [hotspotType, setHotspotType] = useState("imagen");
    const [interior360, setInterior360] = useState(false);

    const [extrasImagesForView, setExtrasImagesForView] = useState([]);

    const extraContainerRef=useRef();
    const extraInViewRef = useRef();
    const tridiRef = useRef(null);
    const tridiContainerRef = useRef(null);
    const tridiModalInfo = useRef(null);
    const containerRef = useRef(null);

    const navigate = useNavigate();

    let zooom=1;


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
                    if(numberOfFrames[2]===1){
                        setInterior360(true)
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
                hotspot.frameId=hotspot.idFrame -1;
                hotspot.id=hotspot.idHotspot-1;
                hotspot.recordingSessionId=null;
                newPins.push(hotspot)
            }
            return newPins;
        }
        return [];
    }

    function getArraySrcPath(escena){

        if(escena.nombre==="interior" && interior360){
            return ([img360CompleteUrl(escena.imagenes[0].path)])
        }

        let n = Object.keys(escena.imagenes).length;
        let [aux,escenaNumber,temp,frames,nameImage]= [];

        let arrayFrames=[]


        if(n!==0){
            [aux,escenaNumber,temp,frames,nameImage]= escena.imagenes[1].path.split("/");

        }

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

        let extraInHotspot = searchExtra(pin.idExtra);

        if(extraContainerRef.current.classList.contains("no-visible")){
            extraContainerRef.current.classList.toggle("no-visible");
        }

        if(extraInHotspot.hasOwnProperty("imagen")){
            setVisibleExtras(true);
            extraInViewRef.current.onExtra(pin.idExtra);
        }
        else if(extraInHotspot.hasOwnProperty("enlace")){

            setExtraPdfOrVideo(extraInHotspot);
            navigate("extravideo");
            console.log('enlace video')
        }
        else if(extraInHotspot.hasOwnProperty("path")){
            console.log("pdf")
            setExtraPdfOrVideo(extraInHotspot);
            navigate("extrapdf");
            //setOpenPdfModal(true);
        }

    };

    const searchExtra=(extraId)=>{
        console.log(extrasList);
        return extrasList.find(x => x.idextra === extraId);
    }

    const zoomValueHandler = (valorZoom) => {
        zooom=valorZoom;
    }

    const  handleZoomIn = () => {
        if(activeEscena!=="2") {
            zooom = zooom + 0.3;
            if(tridiRef !==null || tridiRef.current !==null){
                tridiRef.current.setZoom(zooom);
                if (zooom > 1) {
                    tridiRef.current.toggleMoving(true)
                }
                if (zooom === 1) {
                    tridiRef.current.toggleMoving(false)
                }
            }

        }
    }
    const handleZoomOut = () => {
        if(activeEscena!=="2"){
            zooom = zooom -0.1;
            if(tridiRef !==null || tridiRef.current !==null){
                tridiRef.current.setZoom(zooom );
                if (zooom > 1) {
                    tridiRef.current.toggleMoving(true)
                }
                if (zooom === 1) {
                    tridiRef.current.toggleMoving(false)
                }
            }


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
        if(escena.toString() === "2"){
            console.log('entra')
            window.resizeBy(width/2, height);
        }
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
            if(isMobile){
                toast.info('Toque la pantalla para crear el hotspot',{autoClose: 3000,
                    hideProgressBar: true,theme:"dark"});
            }
            if(!isMobile){
                toast.info('Doble click sobre la pantalla para crear el hotspot',{autoClose: 3000,
                    hideProgressBar: true,theme:"dark"});
            }

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
            let arrayFramesId=[]
            for (let frame in escenas[indexEscena].imagenes){
                for(let value in escenas[indexEscena].imagenes[frame].hotspots){
                    let tempHotspot = escenas[indexEscena].imagenes[frame].hotspots[value];
                    if(tempHotspot.nombreHotspot === nameHotspot){
                        arrayFramesId.push(escenas[indexEscena].imagenes[frame].path.split('/')[3].split('.')[0]);
                    }
                }
            }
            console.log(arrayFramesId)
            return hotspotsMap[indexEscena].filter(hotspot => hotspot.nombreHotspot === nameHotspot).map(hotspot => hotspot.idFrame.toString());
        }

        setAwaitAddHotspot(true);

        if( escenas[activeEscena].nombre === "puertas_abiertas" || escenas[activeEscena].nombre === "puertas_cerradas"){
            let hotspotsDeleteAbiertas = searchHotspot("1");
            let hotspotsDeleteCerradas = searchHotspot("0");


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


    const botonInfoObject=()=>{
        return <>
            <Link to={'info'}>
                <img ref={tridiModalInfo} className="visualizador_btn-share-img cursor-pointer btn-info-margin" src="/iconos/btn-informacion.png" alt=""
                     />
            </Link>

        </>
    }
    const botonCompartir=()=>{

    return <>
        <Link to={"compartir"}>
            <img className="visualizador_btn-share-img cursor-pointer"  src="/iconos/btn-compartir.png" alt=""/>
        </Link>
    </>
    }
    const botonAgregarHotspot=()=>{
        if(isEditMode){
            return   <Link to={'agregarHotspot'}><img className="visualizador_btn-add-hotspot cursor-pointer"  src="/iconos/btn-editar-hotspot.png" alt=""/></Link>
        }
        else{
            return null;
        }
    }
    const addPdfVis=(file)=>{console.log(file)}
    const convertToSlug=(Text)=> {
        return Text.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    const handleCreateHotpotsExtra=(titulo="test",type,file=null,linkYoutube="",extra=null)=>{
        if(type==="pdf"){
            setAwaitAddHotspot(true);
            let bodyFormData = new FormData();
            bodyFormData.append('extra', file);
            const toastHotspot = toast.loading("Subiendo PDF")
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
                        setExtraSelected(response.data);
                        setNameHotspot(titulo);
                        setAddHotspotMode(true);
                        setAwaitAddHotspot(false);
                        toast.update(toastHotspot, { render: "PDF subido", type: "success", isLoading: false, autoClose: 1000,draggable: true});
                    }
                })
                .catch(function (response) {
                    setAwaitAddHotspot(false);
                    console.log(response);
                    toast.update(toastHotspot, { render: "Error subiendo PDF", type: "success", isLoading: false, autoClose: 1000,draggable: true});

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
    const loadAllTridiComponents=()=>{
        if(objetoData){
            let escenas=objetoData.escenas;
            let escenasSrcImages=[];
            let show=false;

            let myHeight = height.toString()+'px';
            let myWidth = width.toString()+'px';

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
                    )}
                else if(imagesSrcOneScene.length === 1){
                    escenasSrcImages.push(
                        <div className={show && loadStatus ? "visible" : "oculto"} key={index}>
                            <Pannellum
                                width={"100%"}
                                height={"100%"}
                                image={imagesSrcOneScene[0]}
                                pitch={10}
                                yaw={180}
                                hfov={110}
                                autoLoad
                                onRender={()=>{}}
                                showFullscreenCtrl={false}
                                showZoomCtrl={false}
                                onLoad={() => {
                                    console.log("panorama loaded");
                                }}
                                onError={err => {
                                    console.log("Error", err);
                                }}
                            >

                            </Pannellum>
                        </div>
                    )
                }
                else{
                    escenasSrcImages.push(
                         <Tridi ref={  show  ? tridiRef :null}
                               key={index}
                               className={`${ addHotspotMode===true ? " addHotspotCursor " : ""} ${show && loadStatus? "visible" : "oculto"}`}
                               images={imagesSrcOneScene}
                               autoplaySpeed={70}
                               zoom={1}
                               maxZoom={3}
                               minZoom={1}
                               onZoom={zoomValueHandler}
                               onFrameChange={frameChangeHandler}
                               touch={true}
                               touchDragInterval={1}
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
                <div className={`tridi-container`}    onWheel={handleWheel} >
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
                        </div> :   <div className={"imagesContainer"}
                                        onClick={clickOnTridi}
                                        onDoubleClick={doubleClickOnTridi}
                                        ref={containerRef}>
                            {escenasSrcImages}
                        </div>
                    }

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

        return arrayHotspots;
    }
    const frameReplicateOneReference=(lastPin)=>{
        const newHotspotToast = toast.loading("Creando hotspot");
        if(objetoData.escenas[activeEscena].nombre === "puertas_cerradas" || objetoData.escenas[activeEscena].nombre === "puertas_abiertas"){

            let ultimoPin= {...lastPin};
            let ultimoPinV2 = {...lastPin};
            let arrayPuertasCerradas =  replicateFrames("0",ultimoPin);
            let arrayPuertasAbiertas =  replicateFrames("1",ultimoPinV2);


            postNewHotspots(id,"puertas_cerradas",arrayPuertasCerradas).then(
                response=>{
                    if(response.status === 200){
                        postNewHotspots(id, "puertas_abiertas",arrayPuertasAbiertas).then(
                            response => {
                                if(response.status === 200){
                                    toast.update(newHotspotToast, { render:`Hotspot  ${nameHotspot} creado`, type: "success", isLoading: false, autoClose: 2000,draggable: true});
                                    setUpdateObjectData(true);
                                    setUpdateExtras(true);
                                    setAwaitAddHotspot(false);
                                    setAddHotspotMode(false)
                                    setUpdateHotspots(true);
                                }

                            }).catch(
                            (e)=>{

                                toast.update(newHotspotToast, { render:`Error creando hotspot`, type: "error", isLoading: false, autoClose: 2000,draggable: true});

                                console.log(e)
                                setAwaitAddHotspot(false);
                            }
                        )
                    }

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

    const calculaUbicacionHotspot=(e)=>{
        let viewerWidth = containerRef.current.clientWidth;
        let viewerHeight = containerRef.current.clientHeight;
        let clientX = e.clientX - (viewerWidth - viewerWidth) / 2;
        let clientY = e.clientY - (viewerHeight - viewerHeight) / 2;
        let viewerOffsetLeft = containerRef.current.getBoundingClientRect().left;
        let viewerOffsetTop = containerRef.current.getBoundingClientRect().top;
        let x = ((clientX - viewerOffsetLeft) / viewerWidth).toFixed(6) - 0.002;
        let y = ((clientY - viewerOffsetTop) / viewerHeight).toFixed(6) -0.005 ;

        if(currentFrameIndex === 0){
            return {
                x: x,
                y: y,
                frameId: 1,
                idFrame: 1,
            };
        }else{
            return {
                x: x,
                y: y,
                frameId: currentFrameIndex-1,
                idFrame: currentFrameIndex-1,
            };
        }

    }

    const clickOnTridi = (e) => {
        if(addHotspotMode && isMobile){
            setAwaitAddHotspot(true);
           frameReplicateOneReference(calculaUbicacionHotspot(e));
        }
    }

    const doubleClickOnTridi = (e) =>{
        if(addHotspotMode && isMobile ===false){
            setAwaitAddHotspot(true);
            frameReplicateOneReference(calculaUbicacionHotspot(e));
        }
    }
    const youtube_parser = (url="") => {

        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length===11)? match[7] : false;
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
            <div key={"open-reel"} className={"visualizador_open-reel-button "} onClick={handleClickExtras}>
                <div className="visualizador_open_container_icon">
                    <BsChevronUp></BsChevronUp>
                </div>
            </div>
        );
        else return "";

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
        return <div key={"logo"} className="logo-company">
            <img src="/icono.png" alt=""/>
            <label>MOTOR'S</label>
        </div>
    }

    const setExtrasSrc=(images) =>{
        setExtrasImagesForView(images);
    }

    /*
    const [enabled, setEnabled] = useState(true);
    const [pulsa, setPulsa] = useState(false);
    const callback = useCallback(event => {
        console.log('long pressed')
    }, []);
    const aux= 3;

    const bind = useLongPress(enabled ? callback : null, {
        onStart: event => {
            console.log('Press started');
            setTimeout(() => {
                setPulsa(true)
            }, 400);

        },
        onFinish: event => {
            console.log('Long press finished');
            setPulsa(false);
            setCounter(3)
        },
        onCancel: event => {
            console.log('Press cancelled');
            setPulsa(false);
            setTimeout(() => {
                setPulsa(false)
            }, 400);
            setCounter(3)
        },
        onMove: event => {
            console.log('Detected mouse or touch movement');
            setPulsa(false);
            setCounter(3)
        },
        filterEvents: event => true, // All events can potentially trigger long press
        threshold: 4000,
        captureEvent: true,
        cancelOnMovement: true,
        detect: 'both',
    });

    const [counter, setCounter] = useState(3);
    useEffect(() => {
        if(counter > 0 && pulsa===true){
            setTimeout(() => setCounter(counter - 1), 1000)
        }
    }, [counter, pulsa]);


    const counterTimer = () =>{

        if(pulsa){
            return <div key={"counter"} className={"counter"}>{counter}</div>
        }
        return  null;

    }

    */
    return (
        <>
        <div className="visualizador dragging" onContextMenu={(e)=> {e.preventDefault();e.stopImmediatePropagation();}}>
            {/*counterTimer()*/}
            {logoCompany()}
            {buttonOpenReel()}
            <ToastContainer />
            <div key={"buttons"} className="visualizador_top-buttons ">
                {botonCompartir()}
                {botonInfoObject()}
                {botonAgregarHotspot()}
            </div>
            {botonModoEdicion()}

            <div key={"reel"} ref={extraContainerRef} className="visualizador_reel">
                {buttonCloseReel()}
                <ReelImages id={id}
                            ref={extraInViewRef}
                            extrasImages={extras}
                            isEditMode={isEditMode}></ReelImages>
            </div>
            <div  key={"tridi-container"} ref={tridiContainerRef}  className="tridi-container">
                {/*...bind()*/}
                {
                    loadAllTridiComponents()
                }
            </div>

            <div className="visualizador_navigation-container" key={"escenas-giro"}>
                {botonesEscenas}
                {botonAutoGiro()}
            </div>

            {
                awaitAddHotspot
                    ?  <div key={"await-hotspot"} className="await-hotspot"><DotLoader color="#16A085 "></DotLoader> </div>
                    : null
            }


        </div>
            <Outlet/>
            <Routes>
                <Route exact path="/info" element={<PopupInfoObjetct imgForInfoModal={imgForInfoModal} infoObjectData={infoObjectData}></PopupInfoObjetct>
                }/>
                <Route path="/compartir" element={<PopupCompartir ></PopupCompartir>
                }/>
                <Route path="/agregarHotspot" element = {<PopupNewHotspot id={id} extras={extras} addPdfVis={addPdfVis} handleCreateHotpotsExtra={handleCreateHotpotsExtra}
                                                                          listaHotspots={hotspotsMap[activeEscena]} onClickDeleteHotspot={handleDeleteHotspot}
                ></PopupNewHotspot>}/>
                <Route path="/extravideo" element={ <ModalVideo channel='youtube' autoplay isOpen={true} videoId={youtube_parser(extraPdfOrVideo.enlace)} onClose={() => navigate(-1)} />
                }></Route>
                <Route path="/extraPdf" element={<div className={"modal-pdf-container"} >
                    <Popup open={true} className={"pdf-modal"} onClose={()=> navigate(-1)} position="right center">
                        <div className={"container-iframe-modal"}>
                            <iframe id="iframepdf" src={getPDF(id,extraPdfOrVideo.path)} title="myFrame"></iframe>
                            <button className={"button-option-pdf-modal"} onClick={()=>navigate(-1)}>Cerrar</button>
                        </div>
                    </Popup>
                </div>}></Route>
            </Routes>


        </>

);
}
