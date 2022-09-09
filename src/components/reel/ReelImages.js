import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, {useState, useEffect, useCallback, memo, forwardRef, useImperativeHandle} from 'react';
import Carousel from 'react-grid-carousel';
import ImageUploading from 'react-images-uploading';
import axios from "axios";
import ImageViewer from 'react-simple-image-viewer';
import {ImagePath} from '../../Api/apiRoutes'
import {FaTrash} from "react-icons/fa/index.js";
import {deleteExtra,getExtrasUrl,uploadExtraUrl} from "../../Api/apiRoutes";
import './ReelImages.css'
import Slider from "react-slick";

const  ReelImages = forwardRef(({id,extrasImages, isEditMode},ref) => {

  const [imageList, setImageList]=useState([])
  const [images, setImages] = useState([]); //for upload with 
  const [imagesListSrc, setImagesListSrc]= useState([]);
  const [imagesExtras, setImagesExtras] = useState(extrasImages);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable:false,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,

        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 616,
        settings: {
          slidesToShow: 1,
        }
      },

    ]

  };
  useEffect(()=>{
    console.log("render reel");
  });
  useImperativeHandle(ref, () => ({

    onExtra(extraId) {
        setCurrentImage(searchExtraById(extraId));
        setIsViewerOpen(true);
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


  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const getExtras = async() => {
    axios.get(getExtrasUrl(id))
    .then((response)=>{
      if(response.status===200){
        let temp= [];
        response.data.forEach((item,index)=>{
          let srcImage=ImagePath(item.imagen.path);
          temp.push([srcImage,item.idextra])
        }
        );
        console.log(temp);
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
    const payload = new FormData();
    payload.append('extra',imagenFile)

    fetch(uploadExtraUrl(id,imagenFile.name), {
      method: "POST",
      body: payload
    }).then(function (res) {
      if (res.ok) {
        console.log('imagen cargada');
        setImageList([...imageList])
        getExtras();
      } else if (res.status === 401) {
        alert("Oops! ");
      }
    }, function (e) {
      alert("Error submitting form!"+e);
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
  }


  useEffect(()=>{
    axios.get(getExtrasUrl(id))
    .then((response)=>{
      if(response.status===200){
        let temp= [];
        response.data.forEach((item,index)=>{
          let srcImage=ImagePath(item.imagen.path);
          temp.push([srcImage,item.idextra])
          //temp.push( <Carousel.Item key={index} ><img width="100%" src={srcImage} key={index}  onClick={ () => openImageViewer(index)}/> </Carousel.Item>)
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


  },[id]);


  function onClickDeleteExtra(src){

      axios.post(deleteExtra(id,src[1]))
    .then((response)=>{
      if(response.status === 200){
        console.log(response);
        getExtras();
      }else{
        console.log(response);
      }
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

  }


  function ImagesReel(){

    if (imagesListSrc.length === 0){
      return (
          <Slider key="0" />
      )
    }

    return <Slider {...settings}>

      {imagesListSrc.map((src, index) => (



          <div className='reel-image-extra-container' key={index}>
              {isEditMode
                  ?<button className='btn-eliminar-extra' onClick={()=>onClickDeleteExtra(src)}> <FaTrash/></button>
                  :null
              }
              <img className='cursor-pointer imgReel' src={src[0]} key={index} alt={'hola'}
          onClick={() => openImageViewer(index)}/>

            </div>

      ))}

    </Slider>

  }

  return (
    <div className='reel-images-container'>
      {
          imagesListSrc.length===0 && <div className="extra-vacio"><h4>No hay extras</h4></div>
      }

<div>
      {isViewerOpen && (
        <ImageViewer
          src={ imagesListSrc.map((item,index)=>item[0]) }
          currentIndex={ currentImage }
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={ closeImageViewer }
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
        />
      )}
    </div>
      {
        isEditMode
          ? <ImageUploading
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
                    <button
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                    >
                      Agregar extra
                    </button>
                    &nbsp;

                  </div>
              )}
            </ImageUploading>
          : null
      }


{
  ImagesReel()
}

{/*

      <Carousel cols={6} rows={1} gap={10} loop containerStyle={{height:"100%"}} responsiveLayout={[
              {
                breakpoint: 1200,
                cols: 5
              },
              {
                breakpoint: 990,
                cols: 4
              },


            ]}>
      {imagesListSrc.map((src, index) => (


        <Carousel.Item key={index} >

          <div className='reel-image-extra-container'>
            {isEditMode
          ?<button className='btn-eliminar-extra' onClick={()=>onClickDeleteExtra(src)}> <FaTrash/></button>
          :null
          }
          <img className='cursor-pointer imgReel' src={src[0]} key={index} alt={'hola'} onClick={ () => openImageViewer(index)}/>

          </div>

          </Carousel.Item>

      ))}
        </Carousel>*/}



      </div>

  )
})
//);

export default memo(ReelImages);