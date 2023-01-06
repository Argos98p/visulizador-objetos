
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';
import 'react-image-lightbox/style.css';
import ImageUploading from 'react-images-uploading';
import axios from "axios";
import {deleteExtra, getExtrasUrl, ImagePath, uploadExtraUrl} from '../../Api/apiRoutes'
import {Outlet, Route, Routes, useNavigate} from "react-router-dom";
import {FaPlusCircle, FaTrash} from "react-icons/fa";
import Popup from "reactjs-popup";
import ImagenComponent from "../imagen/ImagenComponent";
import {toast, ToastContainer} from "react-toastify";
import ScrollContainer from "react-indiana-drag-scroll";
import 'photoswipe/dist/photoswipe.css'
import Lightbox, { ImagesListType } from 'react-spring-lightbox';

import {IoMdCloseCircle} from "react-icons/io";

const  ReelImages = forwardRef(({idV,extrasImages, currentElement, isEditMode,searchHotspots},ref) => {
  const [imageList, setImageList]=useState([])
  const [images, setImages] = useState([]); //for upload with 
  const [imagesListSrc, setImagesListSrc]= useState([]);


  let token = localStorage.getItem("token");
  let idUsuario = localStorage.getItem("idUser");

  let navigate  = useNavigate()


  useImperativeHandle(ref, () => ({
    onExtra(extraId) {
      setCurrentIndex(searchExtraById(extraId))
      //console.log("entra extra")
      navigate('extra');
    }
  }));

  const searchExtraById=(idExtra)=>{
    for(let i = 0 ; i<imagesListSrc.length;i++){
      let aux=imagesListSrc[i]
      if(  aux[1]===idExtra){
        return i;
      }
    }
    return null;
  }

  const onChange = (imageListUpload, addUpdateIndex) => {
    uploadExtra(imageListUpload[0].file)
    setImages([]);
  };

  const getExtras = async() => {
    axios.get(getExtrasUrl(idV))
        .then((response)=>{
              if(response.status===200){
                let temp= [];
                response.data.forEach((item,index)=>{
                      if(item.hasOwnProperty("imagen")){
                        let srcImage=ImagePath(item.imagen.path);
                        temp.push([srcImage,item.idextra])
                      }
                    }
                );
                setImagesListSrc(temp)
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
      setImagesListSrc([]);
    });
  }

  function uploadExtra(imagenFile){
    const idToast = toast.loading("Subiendo extra...")
    const payload = new FormData();
    payload.append('extra',imagenFile)
    fetch(uploadExtraUrl(idV,imagenFile.name,'hola',idUsuario), {
      method: "POST",
      body: payload,
          headers: {
            'Authorization': token,
          }
    }
    ).then(function (res) {
      if (res.ok) {

        toast.update(idToast, { render: "Extra subido", type: "success", isLoading: false, autoClose: 1000,draggable: true});

        setImageList([...imageList])
        getExtras();
      } else if (res.status === 401) {
        toast.update(idToast, { render: "Error user not authorized", type: "error", isLoading: false, autoClose: 1000,draggable: true});

        //console.log("error")
      }
    }, function (e) {
      console.log("Error submitting form!"+e);
      toast.update(idToast, { render: "Error", type: "error", isLoading: false, autoClose: 1000,draggable: true});

    }).catch(error => {
      if(error.response){
        console.log(error.response);
      }else if(error.request){
        console.log(error.request)
      }else{
        console.log('Error ',error.message);
      }
      console.log(error.config);
      toast.update(idToast, { render: "Error", type: "error", isLoading: false, autoClose: 1000,draggable: true});

    })
  }

  useEffect(()=>{
    axios.get(getExtrasUrl(idV))
        .then((response)=>{
              if(response.status===200){
                let temp= [];
                response.data.forEach((item,index)=>{
                      if(item.hasOwnProperty("imagen")){
                        let srcImage=ImagePath(item.imagen.path);
                        temp.push([srcImage,item.idextra])
                      }
                    }
                );
                setImagesListSrc(temp)

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
      setImagesListSrc([]);
    })


  },[idV]);

  function onClickDeleteExtra(idExtra){

    const idToastEliminar = toast.loading("Eliminando extra...")

    axios.post(deleteExtra(idV,idExtra,idUsuario),{},{headers: {
        'Authorization': `${token}`
      }})
        .then((response)=>{
          if(response.status === 200){
            toast.update(idToastEliminar, { render: "Extra eliminado", type: "success", isLoading: false, autoClose: 1000,draggable: true});
            getExtras();
            searchHotspots(idExtra);
          }else if(response.status === 401){
            toast.update(idToastEliminar, { render: "Error usuario no autorizado", type: "error", isLoading: false, autoClose: 1000,draggable: true});
          }
          else{
           // console.log(response);
          }
        }).catch(error => {
      toast.update(idToastEliminar, { render: error.response, type: "error", isLoading: false, autoClose: 1000,draggable: true});

      if(error.response){
        console.log(error.response);
      }else if(error.request){
        console.log(error.request)
      }else{
        console.log('Error ',error.message);
      }
      console.log(error.config);
    })

  }


  const [currentImageIndex, setCurrentIndex] = useState(0);

  const gotoPrevious = () => setCurrentIndex(currentImageIndex - 1);


  const gotoNext = () =>setCurrentIndex(currentImageIndex + 1);

  const [srcImages, setSrcImages] = useState([]);

  useEffect(() => {
    let arraySrc=[]
    imagesListSrc.forEach((item,index)=>{
      let myObject={
        src:item[0],
        loading:'lazy',
        alt:'eager',
        id:index
      }
      arraySrc.push(myObject);

    })
    setSrcImages(arraySrc)
  }, [imagesListSrc]);


  const imagesInArray=()=>{
  let aux;
  aux =  imagesListSrc.map((src, index) => (
      <>
        <div  className='reel_div-img-container' key={src[1]}>
          <div  className='reel_div-img' onClick={() => {  setCurrentIndex(index);navigate("extra")}}>
            <ImagenComponent   key={src[1]+"_imageComponent"} imgURL={src[0]}></ImagenComponent>
          </div>
          {
            isEditMode
                ?<button  className='btn-eliminar-extra' key={src[1]+"btn_eliminar"} onClick={()=>onClickDeleteExtra(src[1])}> <FaTrash/></button>
                :null
          }


      </div>


      </>));

  return aux}
  const  ImagesReel=()=>{
    return (<>
    <div className={"my-reel"}>
      <ScrollContainer className="scroll-container" horizontal={true} vertical={false}>
        {
          (isEditMode) ?
              <div key={"opok"} className=' div-subirExtra cursor-pointer '>
                <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    dataURLKey="data_url"
                >
                  {({
                      imageListUpload,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (

                      <div className="upload__image-wrapper">
                        <button className={"btn-addExtra"}
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                        >
                          <FaPlusCircle color={"#fff"} fontSize={"30px"}></FaPlusCircle>
                        </button>
                        &nbsp;
                      </div>
                  )}
                </ImageUploading>
              </div>
              :null
        }
        {imagesInArray()}
      </ScrollContainer>
    </div>
    </>);

  }

  const closeViewer=()=>{
    navigate(-1);
    let myTridi=document.getElementsByClassName("_lqEjs visible")
    let imagenActual=null;
    if(myTridi.length>0){
      imagenActual=myTridi[0].getElementsByClassName("_3zqPm")[0];
      imagenActual.classList.remove("efecto-zoom");
    }
  }

  return (
    <>
    <ToastContainer/>
      <div className='reel_container' key={'reel-container-op'}>
        {
          ImagesReel()
        }
        <Outlet></Outlet>
        <Routes>
          <Route path="/extra" element={
            <>
              <Lightbox
                  isOpen={true}
                  onPrev={gotoPrevious}
                  onNext={gotoNext}
                  images={srcImages}
                  currentIndex={currentImageIndex}
                  renderHeader={() => ( <IoMdCloseCircle  onClick={()=>closeViewer()} className={"boton-cerrar-viewer"}/> )}
                  // renderFooter={() => (<CustomFooter />)}
                  // renderPrevButton={() => (<CustomLeftArrowButton />)}
                  // renderNextButton={() => (<CustomRightArrowButton />)}
                  // renderImageOverlay={() => (<ImageOverlayComponent >)}
                  // className="cool-class"
                   style={{ background: "rgba(0, 0, 0, .9)" }}
                  /* Handle closing */
                   onClose={() => closeViewer()}
                  /* Use single or double click to zoom */
                  // singleClickToZoom

                  /* react-spring config for open/close animation */
                  // pageTransitionConfig={{
                  //   from: { transform: "scale(0.75)", opacity: 0 },
                  //   enter: { transform: "scale(1)", opacity: 1 },
                  //   leave: { transform: "scale(0.75)", opacity: 0 },
                  //   config: { mass: 1, tension: 320, friction: 32 }
                  // }}
              />
            </>
          }/>
          <Route path="/subirextra" element={
            <Popup
                onClose={()=>navigate(-1)}
                className="popup-compartir_container"
                open={true}
                modal
                nested >
              <div className="popup-compartir-relative">
              </div>
            </Popup>
          }/>
        </Routes>
      </div>
      </>
  )
})

export default ReelImages;