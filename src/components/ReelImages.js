import React,{useState,useEffect,useCallback} from 'react';
import Carousel from 'react-grid-carousel';
import imagenes from "../bd_images.json";
import './ReelImages.css'
import ImageUploading from 'react-images-uploading';
import axios from "axios";
import ImageViewer from 'react-simple-image-viewer';



export default function ReelImages ({id})  {

  const [imageList, setImageList]=useState([])
  const [images, setImages] = useState([]);
  const [imagesListSrc, setImagesListSrc]= useState([])
  
  
  var uploadExtraURL=`http://redpanda.sytes.net:8084/api/objects/addextra?idobjeto=${id}&archivo=`;
  var getExtrasURL="http://redpanda.sytes.net:8084/api/objects/getextras?idobjeto=";
  var showImages="http://redpanda.sytes.net:8085/api/images/getimage?path=";


  const onChange = (imageListUpload, addUpdateIndex) => {
    // data for submit
    uploadExtra(imageListUpload[0].file)
    
    setImages([]);
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
 
  const openImageViewer = useCallback((index) => {
    console.log(index);
    setCurrentImage(index);
    console.log(currentImage);
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
          var srcImage=showImages+item.imagen.path;
          temp.push(srcImage)
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

  function handleImageClick(){
    console.log('q onda');
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
          
          var srcImage=showImages+item.imagen.path;
          temp.push(srcImage);
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

  return (
    <div className='reel-images-container'>

<div>
     

      {isViewerOpen && (
        <ImageViewer
          src={ imagesListSrc }
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
          // write your building UI
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
              {
                breakpoint: 720,
                cols: 4
              }
            ]}>        
      {imagesListSrc.map((src, index) => (
        <Carousel.Item key={index} ><img width="100%" className='cursor-pointer' src={src} key={index} alt={'hola'} onClick={ () => openImageViewer(index)}/> </Carousel.Item>
      ))}    
    </Carousel>
      </div>
    
  )
}