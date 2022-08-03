import { GiSteeringWheel, GiCarDoor } from "react-icons/gi/index.js";
import {FaCarSide } from "react-icons/fa/index.js";
export default function NavigationCarButtons({onOpenDoors,onCloseDoors,onInterior, imagesFramesScenes}){


  console.log('imagesScenes');
  console.log(imagesFramesScenes);
    return <div className="navigation-container">
    {/* props.buttonsScenes*/}

    <div className="navigation-item">
      <button className="semi-transparent-button activo" onClick={onOpenDoors}>
        <FaCarSide size={50} />
      </button>
    </div>
    <div className="navigation-item">
      <button className="semi-transparent-button " onClick={onCloseDoors}>
        <GiCarDoor size={50} />
      </button>
    </div>
    <div className="navigation-item">
      <button className="semi-transparent-button " onClick={onInterior}>
        <GiSteeringWheel size={50} />
      </button>
    </div>
  </div>
}