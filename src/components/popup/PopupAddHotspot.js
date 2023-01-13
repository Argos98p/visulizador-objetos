import Popup from 'reactjs-popup';
import React, {useEffect, useRef, useState} from 'react';
import 'reactjs-popup/dist/index.css';
import '../modal.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import {ImagePath} from '../../Api/apiRoutes'

import AddYoutubeVideo from "./AddYoutubeVideo";

import Dropzone from "react-dropzone";
import {TiArrowBack} from "react-icons/ti";
import {BsPlayCircle} from "react-icons/bs";
import {BiArrowToTop} from "react-icons/bi";
import {FiDownload} from "react-icons/fi";
import PopupListaHotspot from "./PopupListaHotspots";
import { useNavigate } from 'react-router-dom';

const  PopupNewHotspot =({id, extras,listaHotspots,onClickDeleteHotspot, handleCreateHotpotsExtra,addPdfVis}) =>{

    const navigate = useNavigate();
    const [imageSelected, setImageSelected] = useState(null);
    const [extraType, setExtraType] = useState("");
    const [acceptedFiles,setAcceptedFiles] = useState([])
    const [linkYoutube, setLinkYoutube] = useState("");
    const [extrasOnlyImages, setExtrasOnlyImages]= useState(extras.filter(extra => extra.hasOwnProperty("imagen")))
    const [ inputTituloHotspotValue, setInputTituloHotspotValue ] = useState("")
    const nombreInputRef = useRef();


    function handleClickOnImageModal(event, item){
        if(imageSelected===item)
        {
            setImageSelected(null)
        }else{
            setImageSelected(item)
        }
    }

    function onCrear(){
        let aux;
        if(inputTituloHotspotValue===""){
            aux="hotspot";
        }else{
            aux= inputTituloHotspotValue
        }

        if(extraType==="video_youtube"){
            handleCreateHotpotsExtra(aux ,'video_youtube',null,linkYoutube);
        }else if(extraType ==="vincular_extra"){
            handleCreateHotpotsExtra(aux,"vincular_extra",null,null,imageSelected);
        }else if(extraType ==="pdf"){
            handleCreateHotpotsExtra(aux,"pdf",acceptedFiles[0]);
        }
        navigate(-1);
    }


    const onHandleInputYoutube=(linkYoutube)=>{
        setLinkYoutube(linkYoutube);
    }

    useEffect(() => {
        setInputTituloHotspotValue("");
    }, [extraType]);


    const loadPopupContent=()=>{

        if(extraType===""){
            return <div style={{textAlign:"center"}}>
                <h4>Seleccione un tipo de hotspot</h4>
            </div>
        }
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
                                    <figure onClick={(event) => {handleClickOnImageModal(event,item);setInputTituloHotspotValue(item.descripcion)}}>
                                        <img className={`imagen-modal  ${
                                            item===imageSelected
                                                ? "image-modal-selected" : ""
                                        }`} src={ImagePath(item.imagen.path)}   alt=""/>
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

                    <Dropzone onDrop={acceptedFiles => {setAcceptedFiles(acceptedFiles);
                        setInputTituloHotspotValue(acceptedFiles[0].name.replace(".pdf",""));
                        console.log(acceptedFiles)}} >

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

    }

    const inputTituloHotspot = () => {
        if(extraType === "hotspots"){
            return null;
        }
        return (
                <input type="text" ref={nombreInputRef} autoComplete="false" value={inputTituloHotspotValue} onChange={(e)=>onChangeInputTitulo(e)} placeholder={"Ingrese un titulo o descripcion"} name="input-titulo"/>
    );
    }



    return (
        <>
            <div >
            <Popup className="popup-add-hotspot"
                onClose={()=>navigate(-1)}
                open={true}
                modal
                nested >
                <div className="modalp">
                    <div className="header">
                        <div className="icono-anadir">
                            <TiArrowBack className="icon cursor-pointer" onClick={()=>navigate(-1)} fontSize={40}></TiArrowBack>
                            <h5>Añadir hotspot</h5>
                        </div>
                        <div className="buttons-container">
                            <div className={"button-type-extra " + (extraType === "vincular_extra" ? "activo" : "" )}  onClick={()=>setExtraType("vincular_extra")}>
                                <img src="/iconos/enlace.png" alt=""/>
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
                                <img src="/iconos/lista_hotspot.png" alt =""/>
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


                                    <img src="/iconos/btn-crear-hospots.png" alt=""/>


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
            </div>
        </>
    );
}

export default PopupNewHotspot