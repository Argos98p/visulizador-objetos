import Form from 'react-bootstrap/Form';
import React from "react";

const AddYoutubeVideo= ({onHandleInputYoutube})=>{

    return (
        <>
            <label>
                Ingrese un link de youtube<br/>
                <input type="text" onChange={(e)=>onHandleInputYoutube(e.target.value)} name="video-youtube"/>
            </label>
        </>
    );
}

export default AddYoutubeVideo;