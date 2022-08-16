import Popup from 'reactjs-popup';
import React, {useEffect, useState, useRef} from 'react';
import 'reactjs-popup/dist/index.css';
import './modal.css'
import {useParams} from "react-router-dom";
import axios from "axios";
import Carousel from 'react-grid-carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputHotspot from './inputHotspotInfo';
import {ImagePath} from '../Api/apiRoutes'

export default function PopupNewHotspot({extras,handleCreateHotspot}) {

    let {id} = useParams();
    var getExtrasURL = "http://redpanda.sytes.net:8084/api/objects/getextras?idobjeto=";
    const [allExtras, setAllExtras] = useState([]);
    const [imageSelected, setImageSelected] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        axios.get(getExtrasURL + id).then((response) => {
            if (response.status === 200) {
                let temp = [];
                console.log(response.data)
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
        setImageSelected(item)
        
    }

    function handleCrearHotspot(){
      //console.log(imageSelected);
      //console.log(inputRef.current.value);
      handleCreateHotspot(imageSelected,inputRef.current.value)
      
    }

    return (<Popup trigger={
            <button
        className="button-option">Open Modal</button>
        }
        modal
        nested>
        {close => (
                  <div className="modalp">
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                    <div className="header"> Añadir hotspot </div>
                    <div className="content-popup">
                      <div className='lista-extras'>
                          {
                             allExtras.map((item, index) => (                               
                                 <div className='imagen-modal-container ' key={index}>                                   
                                   <figure onClick={(event) => handleClickOnImageModal(event,item)}>
                                   <img className={`imagen-modal  ${
                                     item===imageSelected
                                     ? "image-modal-selected" : ""
                                   }`} src={ImagePath(item.imagen.path)}  onClick={(event) => handleClickOnImageModal(event,item)} />
                                        <figcaption> 
                                         {item.nombre}
                                        </figcaption>
                                  </figure>
                                 </div>    
                            ))
                          }             
                                {                                
                                
                                /*

                        <Carousel cols={2} rows={1} gap={10} loop>
                            <Carousel.Item>
                            <img width="100%" src="https://picsum.photos/800/600?random=1" />
                            </Carousel.Item>
                        </Carousel>
                                    
                                    allExtras.map((item, index) => (
                                    <h1>as</h1>
                                ))
                                    */}



                      </div>
                      <div className='container-input-hotspot'>
                          <InputHotspot inputRef={inputRef}></InputHotspot>
                      </div>
                    </div>
                    <div className="actions">
                    <button className="button-option" onClick={()=>{handleCreateHotspot(imageSelected,inputRef.current.value); close();}}>Crear</button>                      
                    </div>
                  </div>
                )}
              </Popup>
    );


    }
