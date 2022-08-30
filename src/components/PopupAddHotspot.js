import Popup from 'reactjs-popup';
import React, {useEffect, useState, useRef} from 'react';
import 'reactjs-popup/dist/index.css';
import './modal.css'
import {useParams} from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import InputHotspot from './inputHotspotInfo';
import {ImagePath} from '../Api/apiRoutes'

export default function PopupNewHotspot({extras,handleCreateHotspot}) {

    let {id} = useParams();
    var getExtrasURL = "http://redpanda.sytes.net:8084/api/objects/getextras?idobjeto=";
    const [allExtras, setAllExtras] = useState([]);
    const [imageSelected, setImageSelected] = useState(null);
    const inputRef = useRef();
    const [noImageSelected, setNoImageSelected] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {

      //inputRef.current.value="";


        axios.get(getExtrasURL + id).then((response) => {
            if (response.status === 200) {
                let temp = [];
                setAllExtras(response.data)
                /*
        response.data.forEach((item,index)=>{
          
          var srcImage=showImages+item.imagen.path;
          temp.push(srcImage);
          //temp.push( <Carousel.Item key={index} ><img width="100%" src={srcImage} key={index}  onClick={ () => openImageViewer(index)}/> </Carousel.Item>)
        }
        );
        setImagesListSrc(temp)*/
            } else {
                console.log('error al recibir las imagenes');
            }
        }).catch((e) => {
            console.error("Error obteniendo las imagenes:" + e);
            /*setImagesListSrc([]);*/
        });

    }, []);

    function handleClickOnImageModal(event, item){
      if(imageSelected===item)
      {
        setImageSelected(null)
      }else{
        setImageSelected(item)
      }
      
        
    }

    function onCrear(image,input){
      console.log(imageSelected);
      console.log(input);

      //FUNCION PARA CONTROLAR SELECCION DE EXTRAS
      if(/*image === null || */inputRef.current.value === ""){
        if (image === null){
          console.log('as');
        }
        if(inputRef.current.value ===""){
          console.log('is');
        }
      }else{
        console.log('todo ok');
            
        handleCreateHotspot(imageSelected,inputRef.current.value)
        setOpen(false);
        setImageSelected(null)
        inputRef.current.value=""
      }

      //handleCreateHotspot(imageSelected,inputRef.current.value)
      //handleCreateHotspot(imageSelected,inputRef.current.value,close)
    }


    function onClickHotspotPopup(){
      setOpen(true)
    }

    function onCancelHotspotModal(){
      setOpen(false)
      if(inputRef.current!==null){
        inputRef.current.value=""    
      }
          
      setImageSelected(null)
    }

   


    return (
      <>
    <button className="button-option" disabled={true} onClick={onClickHotspotPopup}>Hotspot</button>
    <Popup 
    onClose={onCancelHotspotModal}
    open={open}
        modal
        nested >
        {
      }
      

<div className="modalp">
                    
                    <div className="header"> Añadir hotspot </div>
                    <div className="content-popup">

                      <div className='container-lista-extras'>
                      <div>Seleccione un extra</div>
                      <div className='lista-extras'>
                          {
                             allExtras.map((item, index) => (                               
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
                      { imageSelected === null
                            ? <p>Esta opcion es obligatoria</p>
                            : null
                          }


                      </div>
                     
                    
                      <div className='container-input-hotspot'>
                                    
                          <InputHotspot inputRef={inputRef}></InputHotspot>
                          
                      </div>
                    </div>
                    <div className="actions">
                    <button className="button-option" 
                    disabled={
                      //FUNCION PARA CONTROLAR SELECCION DE EXTRAS                     
                      (/*imageSelected === null ||*/  inputRef.current && inputRef.current.value === "")
                      ? true
                      : false
                    }

                    onClick={()=>{ onCrear(imageSelected,inputRef.current.value) }}

                    
                    >Crear</button>         
                    <button onClick={onCancelHotspotModal}>Cancelar</button>             
                    </div>
                  </div>
              </Popup>
              </>
    );


    }
