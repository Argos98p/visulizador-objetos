//import { useState, useEffect } from "react";
import {  GiCarDoor } from "react-icons/gi/index.js";
export default function NavigationObjectButttons({ imagesFramesScenes }) {
  return (
    <div className="navigation-container">
      {Array.from(imagesFramesScenes.keys()).map((e) => 
        <div className="navigation-item">
        <button className="semi-transparent-button">
          
          <GiCarDoor size="50" />
        </button>
      </div>
      )}
    </div>
  );
}
