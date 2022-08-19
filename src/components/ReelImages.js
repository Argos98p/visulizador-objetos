import React,{useState,useEffect,useCallback} from 'react';
import Carousel from 'react-grid-carousel';
import './ReelImages.css'
import ImageUploading from 'react-images-uploading';
import axios from "axios";
import ImageViewer from 'react-simple-image-viewer';
import {ImagePath} from '../Api/apiRoutes'
import {FaTrash} from "react-icons/fa/index.js";
import {deleteExtra} from "../Api/apiRoutes";


const { forwardRef, useRef, useImperativeHandle } = React;



const  ReelImages = forwardRef(({id,extrasImages, isEditMode},ref) => {

  const [imageList, setImageList]=useState([])
  const [images, setImages] = useState([]); //for upload with 
  const [imagesListSrc, setImagesListSrc]= useState([])
  const [imagesExtras, setImagesExtras] = useState(extrasImages)
  
  
  var uploadExtraURL=`http://redpanda.sytes.net:8084/api/objects/addextra?idobjeto=${id}&archivo=`;
  var getExtrasURL="http://redpanda.sytes.net:8084/api/objects/getextras?idobjeto=";

  useImperativeHandle(ref, () => ({

    getAlert() {
      setCurrentImage(0);
      setIsViewerOpen(true);

    }

  }));

  const onChange = (imageListUpload, addUpdateIndex) => {
    // data for submit
    uploadExtra(imageListUpload[0].file)
    setImages([]);
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
 
  const openImageViewer = useCallback((index) => {   
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const getExtras = async() => {
    axios.get(getExtrasURL+id)
    .then((response)=>{      
      if(response.status===200){ 
        let temp= [];
        response.data.forEach((item,index)=>{
          var srcImage=ImagePath(item.imagen.path);
          temp.push([srcImage,item.idextra])
          //temp.push( <Carousel.Item key={index} ><img width="100%" src={srcImage} key={index}  onClick={ () => openImageViewer(index)}/></Carousel.Item>)
        }
        );
        //setImageList(temp)
        console.log(temp);
        setImagesListSrc(temp)
      }else{
        console.log('error al recibir las imagenes');
      }
    }
    )
    .catch((e)=>{
      console.error("Error obteniendo las imagenes:"+e);
      setImagesListSrc([]);
    });
  }

  
  function uploadExtra(imagenFile){
    const payload = new FormData();
    payload.append('extra',imagenFile)
    
    fetch(uploadExtraURL+imagenFile.name, {      
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
    });
  }

  
  useEffect(()=>{
    axios.get(getExtrasURL+id)
    .then((response)=>{      
      if(response.status===200){
        let temp= [];
        response.data.forEach((item,index)=>{
          console.log(item);
          var srcImage=ImagePath(item.imagen.path);
          temp.push([srcImage,item.idextra])
          //temp.push( <Carousel.Item key={index} ><img width="100%" src={srcImage} key={index}  onClick={ () => openImageViewer(index)}/> </Carousel.Item>)
        }
        );
        setImagesListSrc(temp)
      }else{
        console.log('error al recibir las imagenes');
      }      
    }
    )
    .catch((e)=>{
      console.error("Error obteniendo las imagenes:"+e);
      setImagesListSrc([]);
    });
    
  },[]);


  function onClickDeleteExtra(src){
    try {
      axios.post(deleteExtra(id,src[1]))
    .then((response)=>{
      if(response.status === 200){
        console.log(response);
        getExtras();
      }else{
        console.log(response);
      }
    })
    } catch (error) {
      console.log(error);
    }
    


  }
 

  

  return (
    <div className='reel-images-container'>

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
          <img width="100%" height="100%" className='cursor-pointer' src={src[0]} key={index} alt={'hola'} onClick={ () => openImageViewer(index)}/> 

          </div>

          </Carousel.Item>
          
      ))}    
    </Carousel>
      </div>
    
  )
});

export default ReelImages;