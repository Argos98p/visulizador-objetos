import { useState } from "react";
import { PuffLoader } from "react-spinners";
const ImagenComponent = ({imgURL}) => {

    const [loading, setLoading] = useState(true);
    return (
        <>
        
            <PuffLoader loading={loading} color={"#4F6689"}/>
        
            <img  onLoad={()=>setLoading(false)} style={{display: loading ? "none" : "block" }} className='cursor-pointer reel_borde-redondo ' src={imgURL} alt={'hola'}
                 />
        
        

        </>
    );
}

export default ImagenComponent;