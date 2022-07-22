import React from 'react';
import Carousel from 'react-grid-carousel';
import imagenes from "./bd_images.json";


let itemList=[];
imagenes.images.forEach((item,index)=>{
    itemList.push(
        <Carousel.Item><img width="100%" src={item}/></Carousel.Item>
    )
});
export const ReelImages = () => {
  return (
    <Carousel cols={7} rows={1} gap={10} loop containerStyle={{height:"100%"}}>
        
      {itemList}
      
    </Carousel>
  )
}