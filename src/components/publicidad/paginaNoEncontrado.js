import LottieNotFound from "../../Animations/lottieNotFound";
import Gallery from 'react-grid-gallery';

import posts from "./posts";
import {useEffect} from "react";

export default function NoEncontrado({idObjeto}){

/*
            <div>
            <h2>Elemento con el id {idObjeto} no encontrado</h2>
            <h1>Su publicidad aqui</h1>
            <LottieNotFound></LottieNotFound>
        </div>*/

  useEffect(() => {
    window.location.replace('https://marketa3d.com/product-category/vehiculos/');
    return () => {

    };
  }, []);


    return (

      <div>
      {/*<h2>Elemento con el id {idObjeto} no encontrado</h2>*/}
      
      {/*<LottieNotFound></LottieNotFound>*/}
      {/*<h2>Otros automoviles disponibles</h2>*/}
      {/*<Gallery images={posts}/>*/}
  </div>
      
        
    );
    
    
    
}