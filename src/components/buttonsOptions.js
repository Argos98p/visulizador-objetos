import {  
  FaPlus,
  FaMinus,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaPause,
} from "react-icons/fa/index.js";
import "./visualizador_style.css";
export default function OptionButtons({ onPrev, onNext, onZoomIn, onZoomOut, onAutoPlay, isAutoPlayRunning}) {
  return (
    <>
      <div className="option-item">
        <button className="semi-transparent-button" onClick={onPrev}>
          <FaChevronLeft />
        </button>
      </div>

      <div className="option-item">
        <button className="semi-transparent-button" onClick={onNext}>
          <FaChevronRight />
        </button>
      </div>
      <div className="option-item">
        <button className="semi-transparent-button" onClick={onZoomIn}>
          <FaPlus />
        </button>
      </div>
      <div className="option-item">
        <button className="semi-transparent-button" onClick={onZoomOut}>
          <FaMinus />
        </button>
      </div>
      <div className="option-item">
        <button className="semi-transparent-button" onClick={onAutoPlay}>
            {isAutoPlayRunning
            ?<FaPause/>
            :<FaPlay/>        }
        </button>
      </div>
    </>
  );
}
