 import './Home.css'
 import React from "react";
 import {

     Link
 } from "react-router-dom"
const Home =  () =>{
    return (
        <>
            <div className={"home-page-container"}>
                <div className={"image-container"}>
                    <img src={"../../Motors_1PNG Grande.png"} alt={"e"}/>
                </div>
                <div className={"image-container2"} onClick={()=>{window.location.href = 'https://play.google.com/store/apps/details?id=com.threedspaceinc.appmotors';
                }}>
                    <img src={"../../getonplay.png"} alt={"fe"}/>
                </div>
            </div>
        </>
    );
}


export default  Home;