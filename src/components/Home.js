 import './Home.css'
 import React from "react";
 import {

     Link
 } from "react-router-dom"

const Home =  () =>{
    return (
        <>
            <div className={"home-page-container"}>
                <h1 className={"Titulo blanco weigth"}>¿Como vender tu auto?</h1>
                <div className={"image-container3"}>
                    <img className={"images-marketa"} src={"../../auto-marketa.png"} alt={"e"}/>
                </div>

            </div>
        </>
    );
}


export default  Home;