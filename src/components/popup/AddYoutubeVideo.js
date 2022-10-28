import React from "react";

const AddYoutubeVideo= ({onHandleInputYoutube})=>{

    return (
        <>
                <input type="text" onChange={(e)=>onHandleInputYoutube(e.target.value)} placeholder={" Ingrese un link de youtube"} name="video-youtube"/>

        </>
    );
}

export default AddYoutubeVideo;