import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
//import Tridi from "react-tridi";
import Tridi from "./my_react_tridi/my_react_tridi"
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
    deleteHotspot,
    getExtrasUrl,
    infoObjectUrl, logoEmpresaImage,
    postAddHotspot, viewResource,
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
import {FaFile, FaFilm, FaImage, FaInfo, FaShare} from "react-icons/fa";
import {Link, Outlet, Route, Routes, useNavigate} from "react-router-dom";


import LottieErrorScene from "../Animations/lottieErrorScene";
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import {useDoubleTap} from "use-double-tap";
import LottieSwipe from "../Animations/lottieSwipe";
import AyudaPopup from "./popup/PopupAyuda";
import PopupTerminos from "./popup/PopupTerminos";


export function Visualizador({id, extras,edit,marketa}) {

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
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [activeEscena, setActiveEscena] = useState("0"); //escena que esta activa lo hace con

    const [extraPdfOrVideo, setExtraPdfOrVideo] = useState({});
    const [infoObjectData, setInfoObjectData] = useState("");
    const [imgForInfoModal, setImgForModal] = useState("");
    const [updateObjectData, setUpdateObjectData] = useState(false);
    const [extrasList, setExtrasList] = useState(extras);
    const [updateExtras, setUpdateExtras] = useState(false);
    const [hotspotType, setHotspotType] = useState("imagen");
    const [interior360, setInterior360] = useState(false);
    const [imagenesSinFondo, setImagenesSinFondo] = useState(false)
    const [visibleHotspots,setVisibleHotspots] = useState(true);

    const extraContainerRef=useRef();
    const extraInViewRef = useRef();
    const tridiRef = useRef(null);
    const tridiContainerRef = useRef(null);
    const tridiModalInfo = useRef(null);
    const containerRef = useRef(null);
    const panellumRef = useRef(null);
    const [currentImage, setCurrentImage] = useState(null);
    const navigate = useNavigate();
    let zooom=1;
    let token = localStorage.getItem("token");
    let idUsuario = localStorage.getItem("idUser");
    let webview=localStorage.getItem("webview") ;

    const [logoEmpresa, setLogoEmpresa] = useState("/logo3dobjeto.png");

    if(webview==null){
        webview=false;
    }
    
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
                    /*
                    if(numberOfFrames[2]===2){
                        setInterior360(true)
                    }*/
                    if(response.data.idusuario!=null ){
                        setLogoEmpresa(logoEmpresaImage(response.data.idusuario))
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
    }, [id]);

    /*
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
    */

/*
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
    }, [updateObjectData,id]);

*/
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
    }, [updateExtras,id]);


    useEffect(() => {
        if(loadStatus === true){
            console.log("load status change");
            if (tridiContainerRef.current!==undefined) {
                tridiRef.current.imageIndex(20);
            }
        }
    }, [loadStatus]);


    /*
    const prepararPins = (fetchedPinsObject) => {

        if(fetchedPinsObject !== undefined)
        {
            let newPins=[]
            for (let hotspot of fetchedPinsObject ){
                hotspot.frameId=hotspot.idFrame ;
                hotspot.id=hotspot.idHotspot;
                hotspot.recordingSessionId=null;
                newPins.push(hotspot);
            }
            return newPins;
        }
        return [];
    }*/

    const getArraySrcPath =(escena)=>{

        let n = Object.keys(escena.imagenes).length;
        let escenaNumber;
        let arrayFrames=[]
        if(n!==0){
            escenaNumber= escena.imagenes[1].path.split("/")[1];
        }
        for(let i=1;i<=n;i++){
            if(imagenesSinFondo && escena.nombre !== "interior"){
                arrayFrames.push(completeImageUrl(`/${id}/${escenaNumber}/sinfondo/${i}.png`));
            }
            if(!imagenesSinFondo){
                arrayFrames.push(completeImageUrl(`/${id}/${escenaNumber}/frames_compresos/${i}.jpg`));
            }

        }
        if(imgForInfoModal === ""){
            if(arrayFrames.length>0){
                setImgForModal(arrayFrames[0]);
            }
        }
        return arrayFrames;
    }

    function handleClickExtras() {
        setVisibleExtras(!visibleExtras);
        extraContainerRef.current.classList.toggle("no-visible");
    }

    function closeReel(){
        if(visibleExtras===true){
            setVisibleExtras(false);
            //extraContainerRef.current.classList.add("oculto");
            //extraContainerRef.current.classList.add("no-visible");
        }
    }

    const sleep = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );
    const pinClickHandler = async (pin) => {
        if(currentImage !== undefined){
            let myTridi=document.getElementsByClassName("_lqEjs visible")
            let imagenActual=null;
            if(myTridi.length>0){
                imagenActual=myTridi[0].getElementsByClassName("_3zqPm")[0];
                imagenActual.classList.add("efecto-zoom")
            }
            await sleep(240);
        }
                let extraInHotspot = searchExtra(pin.idExtra);
                if(extraInHotspot.hasOwnProperty("imagen")){
                    extraInViewRef.current.onExtra(pin.idExtra);
                }
                else if(extraInHotspot.hasOwnProperty("enlace")){
                    setExtraPdfOrVideo(extraInHotspot);
                    navigate("extravideo");
                }
                else if(extraInHotspot.hasOwnProperty("path")){
                    setExtraPdfOrVideo(extraInHotspot);
                    navigate("extrapdf");
                }
    };
    const searchExtra=useCallback(
        (extraId) => {
            return extrasList.find(x => x.idextra === extraId);
        },
        [extrasList],
    );
    const zoomValueHandler = (valorZoom) => {
        zooom=valorZoom;
    }
    const  handleZoomIn = () => {

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
    const handleZoomOut = () => {

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
    const handleWheel = (e) => {
            e.deltaY > 0 ? handleZoomOut() : handleZoomIn();
    }
    const handleButtonEscena=(escena)=>{
        //para que la escena que no esta en pantalla siga moviendose
        if(tridiRef.current!=null){
            tridiRef.current.toggleAutoplay(false);
        }
        setActiveEscena(escena.toString())
        //setPins(prepararPins(hotspotsMap[escena]));
        console.log("cambia de escena")
    }
    useEffect( () => {
        async function fetchData() {
            const myDiv = tridiContainerRef.current;
            console.log(myDiv)
            let activeTridi = Array.from(myDiv.querySelectorAll('.visible .info-value '))[0];
            let aux= 0;
            if (tridiContainerRef.current!==undefined) {
                tridiRef.current.imageIndex(currentFrameIndex)

            }
        }
         fetchData();
        if (tridiRef.current !== null) {
            tridiRef.current.toggleAutoplay(isAutoPlayRunning)
        }
    }, [activeEscena,isMobile,isAutoPlayRunning]);
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
    }, [addHotspotMode,isMobile]);
    const postNewHotspots = (id, nombreEscena,arrayHotspots) => {
        return axios.post(postAddHotspot(id,nombreEscena,idUsuario),arrayHotspots,{headers: {
                'Authorization': `${token}`
            }});
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

        return (
            <>
                <div data-tip={"test"} className={!visibleHotspots ?"oculto" :""} data-for='test' key={pin.id}>
                    <label  >
                        <div id="b3" className={'button-hotspot '} >
                            {
                                aux
                            }
                        </div>
                    </label>
                </div>
            </>
        );
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
                                      onTouch={()=>handleButtonEscena(index)}
                                      activo={
                                          index.toString() === activeEscena
                                      }
                                      disabled={!loadStatus}
                        ></ButtonEscena>
                    ))}
            </>
        ,[handleButtonEscena,objetoData,activeEscena]
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
        if (marketa){
            return null
        }else{
            return <>
                {
                    webview ==='false' ?<Link to={"compartir"}>
                            <img className="visualizador_btn-share-img cursor-pointer"  src="/iconos/btn-compartir.png" alt=""/>
                        </Link>
                        : null
                }

            </>
        }
    }
    const botonVisibleHotspots = () => {
        const handleButtonVisibleHotspots=()=>{
            if(visibleHotspots){
                setVisibleHotspots(false);
            }else{
                setVisibleHotspots(true);
            }
        }
        return <label style={{"display":"contents"}}>
            <Toggle
                defaultChecked={true}
                onChange={()=>handleButtonVisibleHotspots()} />

        </label>
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
            .replace("(","")
            .replace(")","")
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
            .replace("pdf",".pdf");
    }

    let updateEscenas = (index)=>{
        //console.log(index)
        if(index==="1" || index==="2"){
           // console.log('entra qui')

            setLoadStatus(true)
            let myTridi=document.getElementsByClassName("_lqEjs visible")

            if(myTridi.length>0){
                setCurrentImage(myTridi[0].getElementsByClassName("_3zqPm")[0]);
            }
        }


    }
    const myHint = ()=>{
        return  <div style={{width:"300px",height:"300px"}}>
            <h4 style={{textAlign:"center",color:"#212020", fontWeight:"bold"}}>Pulse y arrastre para mover</h4>
            <LottieSwipe ></LottieSwipe>
        </div>
    }
    const loadAllTridiComponents=()=>{
        if(objetoData){
            let escenas=objetoData.escenas;
            let escenasSrcImages=[];
            let show=false;
            for (let index in escenas){

                show=activeEscena===index
                let imagesSrcOneScene = getArraySrcPath(escenas[index]);
                try{
                    if(imagesSrcOneScene.length === 0 ){
                    escenasSrcImages.push(
                        <div className="emptyEscena">
                            <h2 className="texto-blanco">Escena vacia</h2>
                            <br></br>
                            <LottieEmptyEscenas></LottieEmptyEscenas>
                        </div>
                    )}

                else{
                    escenasSrcImages.push(
                            <Tridi ref={  show  && loadStatus ? tridiRef :null}
                                   hintOnStartup={index === '0'}
                                   hintText={"Arraste para mover"}
                                   renderHint={myHint}

                                  key={index}
                                  count={imagesSrcOneScene.length-1}
                                  className={`${ addHotspotMode===true ? " addHotspotCursor " : ""} ${show && loadStatus === true ? "visible" : "oculto"}`}
                                  images={imagesSrcOneScene}
                                  autoplaySpeed={70}
                                  zoom={1}
                                   indexcurrent = {100}
                                  maxZoom={3}
                                  minZoom={1}
                                  onZoom={zoomValueHandler}
                                  onFrameChange={frameChangeHandler}
                                  touch={true}
                                  touchDragInterval={1}
                                  onAutoplayStart={
                                      () => {
                                          if (show ===true){
                                              setIsAutoPlayRunning(true)
                                          }
                                      }
                                  }
                                  onAutoplayStop={
                                      () =>{
                                          if(show === true){
                                              setIsAutoPlayRunning(false)
                                          }
                                      }
                                  }
                                  onPinClick={pinClickHandler}
                                  setPins={setPins}
                                  renderPin={myRenderPin}
                                   showStatusBar={true}
                                   pins={pins}
                                  onLoadChange={()=>updateEscenas(index)}
                                  showControlBar={false}
                            />
                    )
                }
                }catch (e) {
                    console.log(e)
                    escenasSrcImages.push(
                        <LottieErrorScene></LottieErrorScene>
                    );
                }
            }

            return (
                <>
                    <div className={`tridi-container`}    onWheel={handleWheel} >
                        <div className={`loader-container ${ loadStatus===false ? "arriba" : "oculto"}`} >
                            <div className={ `sweet-loading`} >
                                <DotLoader color="#0087D1"
                                           size={70}/>
                            </div>
                        </div>


                        {<div  {...doubleTap} className={`imagesContainer ${ loadStatus===true ? "" : "abajo"}`}
                              //onClick={clickOnTridi}
                              onDoubleClick={doubleClickOnTridi}
                              ref={containerRef}>

                            {escenasSrcImages}
                        </div>}

                    </div>
                </>

            );
        }
        return <h1>holaa</h1>
    }
    const doubleTap = useDoubleTap((e) => {
        console.log("double tap")

        if(isMobile){
            handleAddNewHotspot(e);
        }



    });
    const replicateFrames = (indexEscena, lastPin) => {

        let move = 0.014;
        let j=20;
        let aux=j;
        let arrayHotspots=[];

        let originalX = parseFloat(lastPin.x);
        let originalY = lastPin.y;


        if(lastPin.frameId > frames[indexEscena]){
            lastPin.frameId = frames[indexEscena]-1;
            lastPin.idFrame = frames[indexEscena]-1;
        }

        if(lastPin.frameId -j > 0  && lastPin.frameId + j <=frames[indexEscena]){

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
            let h= lastPin.frameId -j +frames[indexEscena]+1
            //console.log(frames[indexEscena])

            for(let i = lastPin.frameId -j;i<lastPin.frameId;i++){
                let newPin={};
                if(h===frames[indexEscena]+1){
                    h=0;
                }
                if(h!==0){
                     newPin={
                        idframe:h,
                        nombreHotspot:nameHotspot,
                        idExtra:extraSelected.idextra,
                        x:originalX+move*-k,
                        y:parseFloat(originalY),
                        tipo:hotspotType

                    }
                    arrayHotspots.push(newPin);
                }


                h++;
                k++;

            }


        }
        else if(lastPin.frameId+j > frames[indexEscena]){
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
                                    toast.update(newHotspotToast, { render:`Hotspot  ${nameHotspot} creado en escenas 1 y 2`, type: "success", isLoading: false, autoClose: 2000,draggable: true});
                                    setUpdateObjectData(true);
                                    setUpdateExtras(true);
                                    setAwaitAddHotspot(false);
                                    setAddHotspotMode(false)
                                    setUpdateHotspots(true);
                                }

                            }).catch(
                            (e)=>{

                                toast.update(newHotspotToast, { render:`Error creando hotspot`+e, type: "error", isLoading: false, autoClose: 2000,draggable: true});
                                setAddHotspotMode(false);
                                setAwaitAddHotspot(false);
                            }
                        )
                    }

                }
            ).catch(
                (e)=>{

                    toast.update(newHotspotToast, { render:`Error creando hotspot` +e, type: "error", isLoading: false, autoClose: 2000,draggable: true});

                    console.log(e)
                    setAwaitAddHotspot(false);
                    setAddHotspotMode(false)
                }
            )
            setAwaitAddHotspot(false);
        }else{
            let arrayEscena = replicateFrames(activeEscena,lastPin);

            postNewHotspots(id, objetoData.escenas[activeEscena].nombre ,arrayEscena).then(
                response => {
                    setUpdateObjectData(true);
                    setUpdateExtras(true);
                    setAwaitAddHotspot(false);
                    setAddHotspotMode(false)
                    setUpdateHotspots(true);
                    toast.update(newHotspotToast, { render:`Hotspot  ${nameHotspot} creado`, type: "success", isLoading: false, autoClose: 2000,draggable: true});

                }).catch(
                (e)=>{
                    toast.update(newHotspotToast, { render:`Error creando hotspot` +e, type: "error", isLoading: false, autoClose: 2000,draggable: true});
                    console.log(e)
                    setAwaitAddHotspot(false);
                    setAddHotspotMode(false)
                }
            )
        }

    }
    const calculaUbicacionHotspot=(e)=>{

        let element =  document.getElementsByClassName("_lqEjs visible")[0].firstChild;
        let viewerWidth = element.clientWidth;
        let viewerHeight = element.clientHeight;
        let clientX = e.clientX;
        let clientY = e.clientY;
        let viewerOffsetLeft = element.getBoundingClientRect().left;
        let viewerOffsetTop = element.getBoundingClientRect().top;
        let x = ((clientX - viewerOffsetLeft) / viewerWidth).toFixed(6) ;
        let y = ((clientY - viewerOffsetTop) / viewerHeight).toFixed(6) ;

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

    const handleAddNewHotspot=(e)=>{
        console.log("entra una vez")
        if(addHotspotMode  && activeEscena!=="2"){
            setAwaitAddHotspot(true);
            frameReplicateOneReference(calculaUbicacionHotspot(e));
        }

        if(addHotspotMode && activeEscena === "2" && interior360===false ){
            setAwaitAddHotspot(true);
            frameReplicateOneReference(calculaUbicacionHotspot(e));
        }

        if(addHotspotMode  && activeEscena === "2" && interior360===true ){
            if(panellumRef.current!= null){
                let coordenadas =  panellumRef.current.getViewer().mouseEventToCoords(e);
                let newPin = {
                    x: coordenadas[0],
                    y: coordenadas[1],
                    idframe: 1,
                    tipo:hotspotType,
                    nombreHotspot:nameHotspot,
                    idExtra:extraSelected.idextra
                }
                let data = [];
                data.push(newPin)
                const newHotspots360 = toast.loading("Creando hotspot");

                axios.post(postAddHotspot(id, "interior",idUsuario), data,{headers:{'Authorization': `${token}`}}).then(r  =>{
                    if (r.status === 200){

                        toast.update(newHotspots360, { render:`Hotspot  ${nameHotspot} creado`, type: "success", isLoading: false, autoClose: 2000,draggable: true});
                        setUpdateObjectData(true);
                        setUpdateExtras(true);
                        setAwaitAddHotspot(false);
                        setAddHotspotMode(false)
                        setUpdateHotspots(true);
                    }
                }).catch(e=>{
                    toast.update(newHotspots360, { render:`Error creando hotspot`+e, type: "error", isLoading: false, autoClose: 2000,draggable: true});
                    setAddHotspotMode(false);
                    setAwaitAddHotspot(false);
                });
            }
        }
    }
    const doubleClickOnTridi = (e) =>{

        if(!isMobile){
            console.log("tambien entra")
            handleAddNewHotspot(e);
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

    const newBotonCompartir = useMemo(() => {
        if (marketa){
            return null
        }else{
            return <>
                {
                    webview ==='false' ?<Link to={"compartir"}>
                            <FaShare/>
                        </Link>
                        : null
                }

            </>
        }
    }, []);
    const botonInformacion = useMemo(() => {
        return  <Link to={'info'}>
        <div className={`button-escena_navigation-item`}  onClick={()=>{}} >
            <button  data-for='soclose6' data-tip="info" className={`button-escena-btn `} >
                <img style={{width:"20px"}} src="/iconos/information.png" alt=""/>
            </button>
            <ReactTooltip  id="soclose6" place="right" effect="solid"  disable={isMobile}> Información
            </ReactTooltip>
        </div>
        </Link>
    }, []);
    const botonAutoGiro= useMemo(
    ()=>{
        return <div className={`button-escena_navigation-item`}  onClick={()=>{setIsAutoPlayRunning(!isAutoPlayRunning);
            tridiRef.current.toggleAutoplay(!isAutoPlayRunning)}} >
            <button  data-for='soclose1' data-tip="Girar" className={`button-escena-btn ${isAutoPlayRunning===true ? " activo":""}`} >
                <img src="/iconos/giro-carro.png" alt=""/>
            </button>
            <ReactTooltip  id="soclose1" place="right" effect="solid"  disable={isMobile}> Girar
            </ReactTooltip>
        </div>
    },[isAutoPlayRunning,isMobile]
);

    const logoCompany = ()=>{

        if(marketa){
            return null
        }else{
            return <div key={"logo"} className="logo-company">

                <img src={logoEmpresa} onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src="/logo3dobjeto.png";
                }} />
            </div>
        }


    }
    const returnRoute=()=>{
        navigate(-1);
        let myTridi=document.getElementsByClassName("_lqEjs visible")
        let imagenActual=null;
        if(myTridi.length>0){
            imagenActual=myTridi[0].getElementsByClassName("_3zqPm")[0];
            imagenActual.classList.remove("efecto-zoom");
        }
    }
    const searchHotspots=(extraId)=>{
        let hotspotsEliminar=[]
        Object.keys(hotspotsMap).forEach(key => {
            let hotspotsImagen = structuredClone(hotspotsMap[key])
            hotspotsEliminar=hotspotsEliminar.concat(hotspotsImagen.filter(hotspot => hotspot.idExtra === extraId))
        });
        let nombresHotspots = [...new Set(hotspotsEliminar.map(x=> x.nombreHotspot))];
        if(nombresHotspots.length>0){
            for (const nombre of nombresHotspots) {
                //handleDeleteHotspot(nombre);
            }
        }
    }
    return (
        <>
        <div className="visualizador dragging" onContextMenu={(e)=> {e.preventDefault();}}>
            {logoCompany()}
            {buttonOpenReel()}
            <ToastContainer />
            <div key={"buttons"} className="visualizador_top-buttons ">
                {botonCompartir()}
                {botonVisibleHotspots()}

                {/*botonInfoObject()*/}
                {botonAgregarHotspot()}
                {/*botonQuitarFondo()*/}
            </div>
            {/*botonModoEdicion()*/}
            <div key={"reel"} ref={extraContainerRef} className="visualizador_reel">
                {buttonCloseReel()}
                <ReelImages idV={id}
                            currentElement={currentImage}
                            key={'reel'}
                            ref={extraInViewRef}
                            extrasImages={extras}
                            isEditMode={isEditMode} searchHotspots={searchHotspots}></ReelImages>
            </div>
            <div  key={"tridi-container-div"} ref={tridiContainerRef}  className="tridi-container-div">
                {
                    loadAllTridiComponents()
                }
            </div>
            {
                <div className="visualizador_navigation-container" key={"escenas-giro"} >
                    {botonesEscenas}
                    {botonAutoGiro}
                    {botonInformacion}
                </div>
            }
            {
                awaitAddHotspot
                    ?  <div key={"await-hotspot"} className="await-hotspot"><DotLoader color="#0087D1"></DotLoader> </div>
                    : null
            }
            <div className={"bottomBar"}>

                        <div className={"buttonBottomBar"}>
                            {
                                isMobile
                                ?<a href={"https://www.3dspaceinc.com/contenido/motors/3DSpaceINC-Gu%C3%ADa-de-carros-2022-3.pdf"} target="_blank">
                                        <img  src={"/logo3dobjeto.png"}  alt={"d"}/>
                                    </a>
                                    :  <a href={"https://3dspaceinc.com/motors"} target="_blank"><img  src={"/motors_logo.png"}  alt={"d"}/></a>
                            }
                        </div>
                <div className={"buttonBottomBar"}><Link className={"textBottomBar"} to={"terminos"}>términos</Link></div>
                <div className={"separator"}>|</div>
                <div className={"buttonBottomBar"}><Link className={"textBottomBar"} to={"ayuda"}>ayuda</Link></div>
            </div>
        </div>
            <Outlet/>
            <Routes>
                <Route  path="/info" element={<PopupInfoObjetct imgForInfoModal={imgForInfoModal} infoObjectData={infoObjectData}></PopupInfoObjetct>
                }/>
                <Route path="/compartir" element={<PopupCompartir ></PopupCompartir>
                }/>
                {
                    /*
                    * <Route path="/agregarHotspot" element = {<PopupNewHotspot id={id} extras={extras} addPdfVis={addPdfVis} handleCreateHotpotsExtra={handleCreateHotpotsExtra}
                                                                          listaHotspots={hotspotsMap[activeEscena]} onClickDeleteHotspot={handleDeleteHotspot} ></PopupNewHotspot>}/>
                    * */
                }
                <Route path="/extravideo" element={ <ModalVideo channel='youtube' autoplay isOpen={true} videoId={youtube_parser(extraPdfOrVideo.enlace)} onClose={() => {
                    returnRoute();
                }} />
                }></Route>
                <Route path="/extraPdf" element={<div className={"modal-pdf-container"} >
                    <Popup open={true} className={`${isMobile && webview==='false' ? "pdf-modal-celular" : webview==='true' ?"pdf-modal-webview" :"pdf-modal "}`}  onClose={()=> returnRoute()} position="right center">
                        <div className={"container-iframe-modal"}>
                            <iframe id="iframepdf" src={viewResource(id,extraPdfOrVideo.path)}  title="myFrame"></iframe>
                            <button className={"button-option-pdf-modal"} onClick={()=>{returnRoute()}}>Cerrar</button>
                        </div>
                    </Popup>
                </div>
                }></Route>
                <Route path={"/ayuda"} element={<AyudaPopup/>}></Route>
                <Route path={"/terminos"} element={<PopupTerminos/>}></Route>
            </Routes>
        </>
    );
}
