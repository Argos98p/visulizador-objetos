import React, { useEffect, useState } from "react";
import imagenes from './bd_images.json';

const imageUrl = "https://i.postimg.cc/m2tw612H/1.jpg";



export default function Imagen() {
  const [img, setImg] = useState();

  const fetchImage = async () => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <>
      <img src={img} alt="icons" />
    </>
  );
}
