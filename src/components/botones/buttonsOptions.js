import {
    FaPlus,
    FaMinus,
    FaPlay,
    FaChevronLeft,
    FaChevronRight,
    FaPause,
    FaCrosshairs
} from "react-icons/fa/index.js";
import "../visualizador_style.css";
export default function OptionButtons({
    onPrev,
    onNext,
    onZoomIn,
    onZoomOut,
    onAutoPlay,
    isAutoPlayRunning,
    onAddHotspot,
    isEditMode
}) {

    return (
        <div className="button-option-container-flex">

            <div className="option-item">
                <button className="semi-transparent-button"  disabled={isEditMode}
                        onClick={onZoomIn}>
                    <FaPlus/>
                </button>
            </div>
            <div className="option-item">
                <button className="semi-transparent-button"  disabled={isEditMode}
                        onClick={onZoomOut}>
                    <FaMinus/>
                </button>
            </div>
            <div className="option-item">
                <button className="semi-transparent-button" disabled={isEditMode}
                    onClick={onPrev}>
                    <FaChevronLeft/>
                </button>
            </div>

            <div className="option-item">
                <button className="semi-transparent-button"  disabled={isEditMode}
                    onClick={onNext}>
                    <FaChevronRight/>
                </button>
            </div>

            {
                /*
                * <div className="option-item">
                <button className="semi-transparent-button"  disabled={isEditMode}
                    onClick={onAutoPlay}>
                    {
                    isAutoPlayRunning ? <FaPause/>: <FaPlay/>
                } </button>
            </div>
                * */
            }

        </div>
    );
}
