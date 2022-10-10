import ImageViewer from "react-simple-image-viewer";
import React, {useCallback, useState} from "react";
import {useNavigate, } from "react-router-dom";

const PopupImageViewer = ({extrasImagesForView, indexImageSrc}) => {
    const navigate = useNavigate();

    const [currentImage, setCurrentImage] = useState(indexImageSrc);
    const [isViewerOpen, setIsViewerOpen] = useState(true);
    const [images, setImages] = useState(extrasImagesForView);


    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };


    return (
        <div>
            {images.map((src, index) => (
                <img
                    src={ src }
                    onClick={ () => openImageViewer(index) }
                    width="300"
                    key={ index }
                    style={{ margin: '2px' }}
                    alt=""
                />
            ))}

            {/*isViewerOpen && (
                <ImageViewer
                    src={ images }
                    currentIndex={ currentImage }
                    disableScroll={ false }
                    closeOnClickOutside={ true }
                    onClose={ closeImageViewer }
                />
            )*/}
        </div>
    );
}

export default PopupImageViewer;