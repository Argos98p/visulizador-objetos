import Popup from 'reactjs-popup';
import React, {useEffect, useState, useRef, memo} from 'react';
import 'reactjs-popup/dist/index.css';
import '../modal.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {ImagePath, getExtrasUrl} from '../../Api/apiRoutes'
import Form from 'react-bootstrap/Form';
import AddYoutubeVideo from "./AddYoutubeVideo";
import AddVinculateExtra from "./AddVinculateExtra";
import AddPdf from "./AddPdf";
import Dropzone from "react-dropzone";
import {FaInfo, FaRecordVinyl} from "react-icons/fa";
import {TiArrowBack} from "react-icons/ti";
import {BsPlayCircle} from "react-icons/bs";
import {BiArrowToTop} from "react-icons/bi";
import {FiDownload} from "react-icons/fi";
import PopupListaHotspot from "./PopupListaHotspots";
import {SiAddthis} from "react-icons/si";


const  PopupNewHotspot =({id, extras,handleCreateHotspot,listaHotspots,onClickDeleteHotspot, handleCreateHotpotsExtra,addPdfVis}) =>{

    const [imageSelected, setImageSelected] = useState(null);
    const [noImageSelected, setNoImageSelected] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [nameValue, setNameValue] = useState("");
    const [extraType, setExtraType] = useState("video_youtube");
    const [acceptedFiles,setAcceptedFiles] = useState([])
    const [linkYoutube, setLinkYoutube] = useState("");
    const [extrasOnlyImages, setExtrasOnlyImages]= useState(extras.filter(extra => extra.hasOwnProperty("imagen")))
    const [ inputTituloHotspotValue, setInputTituloHotspotValue ] = useState("")

    //const [extras, setExtras] = useState([])
    /*
        useEffect(() => {
            console.log('render tirir')
            axios.get(getExtrasUrl(id))
                .then((response)=>{
                        if(response.status===200){
                            console.log(response.data)
                            setExtras(response.data)
                        }else{
                            console.log('error al recibir las imagenes');
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
                console.error("Error obteniendo las imagenes:"+error);
                setExtras([]);
            });
        }, []);
*/

    function handleClickOnImageModal(event, item){
        if(imageSelected===item)
        {
            setImageSelected(null)
        }else{
            setImageSelected(item)
        }
    }

    function onCrear(){

        if(extraType==="video_youtube"){
            handleCreateHotpotsExtra(inputTituloHotspotValue,'video_youtube',null,linkYoutube);
            setOpen(false)
        }else if(extraType ==="vincular_extra"){
            handleCreateHotpotsExtra(inputTituloHotspotValue,"vincular_extra",null,null,imageSelected);
            setOpen(false)
        }else if(extraType ==="pdf"){

            handleCreateHotpotsExtra(inputTituloHotspotValue,"pdf",acceptedFiles[0]);
            setOpen(false)
        }
    }


    function onClickHotspotPopup(){
        setOpen(true)
    }

    function onCancelHotspotModal(){
        setOpen(false)
        setNameValue("");
        setImageSelected(null)
    }

    function onChangeInput(nombreHotspot){
        setNameValue(nombreHotspot.target.value)
    }

    const onHandleInputYoutube=(linkYoutube)=>{
        setLinkYoutube(linkYoutube);
    }

    const loadPopupContent=()=>{
        if(extraType==="video_youtube"){
            return <AddYoutubeVideo onHandleInputYoutube={onHandleInputYoutube} addPdfVis={addPdfVis}></AddYoutubeVideo>
        }
        if(extraType==="vincular_extra"){
            return(
                <div className='container-lista-extras'>
                    <div className='lista-extras'>
                        {
                            extrasOnlyImages.map((item, index) => (
                                <div className='imagen-modal-container ' key={index}>
                                    <figure onClick={(event) => handleClickOnImageModal(event,item)}>
                                        <img className={`imagen-modal  ${
                                            item===imageSelected
                                                ? "image-modal-selected" : ""
                                        }`} src={ImagePath(item.imagen.path)}  />
                                        <figcaption>
                                            {item.nombre}
                                        </figcaption>
                                    </figure>
                                </div>
                            ))
                        }
                    </div>
                </div>
            );

        }
        if(extraType==="pdf"){
            let baseStyle = {
                marginTop:'10px',
                marginBottom:'10px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                borderWidth: 2,
                borderRadius: 2,
                borderColor: '#eeeeee',
                borderStyle: 'dashed',
                backgroundColor: 'rgba(53, 92, 106,0.89)',
                color: '#bdbdbd',
                outline: 'none',
                transition: 'border .24s ease-in-out'
            };
            const style = {
                ...baseStyle,
            }
            return (
                <div >
                    <Dropzone onDrop={acceptedFiles => setAcceptedFiles(acceptedFiles)} >

                        {({getRootProps, getInputProps}) => (
                            <section>
                                <aside>
                                    {acceptedFiles.map(file => (
                                        <li key={file.path}>
                                            {file.path} - {file.size} bytes
                                        </li>))}
                                </aside>

                                <div {...getRootProps({style})} className="pdf-input-container">
                                    <input {...getInputProps()} />
                                    <h1>PDF</h1>
                                    <FiDownload className={"icon"}></FiDownload>
                                    <p>Arraste o pulse para subir un archivo PDF</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
            );

        }

        if(extraType === "hotspots"){
            return <PopupListaHotspot listaHotspots={listaHotspots} onClickDeleteHotspot={onClickDeleteHotspot}></PopupListaHotspot>
        }
    }

    const onChangeInputTitulo = (e)=>{
        setInputTituloHotspotValue(e.target.value);
        console.log(e.target.value);
    }

    const inputTituloHotspot = () => {
        if(extraType === "hotspots"){
            return null;
        }
        return (
                <input type="text" onChange={(e)=>onChangeInputTitulo(e)} placeholder={"Ingrese un titulo o descripcion"} name="input-titulo"/>
    );
    }

    return (
        <>
            <img onClick={onClickHotspotPopup} className="cursor-pointer visualizador_btn-share-img popupAddHotspot_btn_hotspot" src="../iconos/btn-editar-hotspot.png" alt=""/>
            <Popup className="popup-add-hotspot"
                onClose={onCancelHotspotModal}
                open={open}
                modal
                nested >
                <div className="modalp">
                    <div className="header">
                        <div className="icono-anadir">
                            <TiArrowBack className="icon" fontSize={40}></TiArrowBack>
                            <h5>Añadir hotspot</h5>
                        </div>

                        <div className="buttons-container">

                            <div className={"button-type-extra " + (extraType === "vincular_extra" ? "activo" : "" )}  onClick={()=>setExtraType("vincular_extra")}>
                                <img src="../iconos/enlace.png"/>
                                <button>Vincular con extra</button>
                            </div>
                            <div className={"button-type-extra " + (extraType === "video_youtube" ? "activo" : "" )}  onClick={()=>setExtraType("video_youtube")}>
                                <BsPlayCircle fontSize={25}></BsPlayCircle>
                                <button>Video de youtube</button>
                            </div>
                            <div className={"button-type-extra " + (extraType === "pdf" ? "activo" : "" )}  onClick={()=>setExtraType("pdf")}>
                                <BiArrowToTop fontSize={25}></BiArrowToTop>
                                <button>Subir PDF</button>
                            </div>
                            <div className={"button-type-extra " + (extraType === "hotspots " ? "activo" : "" )}  onClick={()=>setExtraType("hotspots")}>
                                <img src="../iconos/lista_hotspot.png"/>
                                <button>Lista de hotspot</button>
                            </div>

                        </div>


                    </div>

                    <div className="content-popup">

                        {inputTituloHotspot()}

                        {loadPopupContent()}

                    </div>

                    <div className="actions">
                        <div>

                            { (extraType === "hotspots") ? null
                                : <div className="button-cancel-container">

                                    <SiAddthis></SiAddthis>

                                    <button className="button-option"
                                            disabled={false/*
                      //FUNCION PARA CONTROLAR SELECCION DE EXTRAS
                      !!(imageSelected === null ||  nameValue === "")*/
                                            }
                                            onClick={()=>{ onCrear() }}
                                    >Crear</button>
                                </div>

                            }

                        </div>


                    </div>
                </div>
            </Popup>
        </>
    );
}

export default PopupNewHotspot