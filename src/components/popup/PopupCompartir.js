import Popup from 'reactjs-popup';
import React from "react";
import {
    FacebookIcon,
    FacebookMessengerIcon, FacebookMessengerShareButton,
    FacebookShareButton,
    FacebookShareCount,
    TelegramIcon, TelegramShareButton,
    WhatsappIcon, WhatsappShareButton
} from "react-share";
import copy from 'copy-to-clipboard';
import {MdClose} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

const PopupCompartir = () =>{
    let {id} = useParams();
    const navigate = useNavigate();
    const urlToShare = `http://3dmotores.com/object/${id}`;
    const onClickCopy= () =>{
        copy(`http://3dmotores.com/object/${id}`);
        toast.info('Link copiado al portapapeles',{autoClose: 3000,
            hideProgressBar: true,theme:"dark"});
    }
    return <Popup
        onClose={()=>navigate(-1)}
        className="popup-compartir_container"
        open={true}
        modal
        nested >
        <div className="popup-compartir-relative">
            <button className="popup-compartir-close" onClick={()=>navigate(-1)}>
                <MdClose/>
            </button>
            <div className="popup-compartir-title">
                Compartir
            </div>
            <div className="popup-compartir_social-buttons">
                <WhatsappShareButton url={urlToShare} >
                    <div className="popup-compartir_button-item">
                        <WhatsappIcon round={true} size={42} > </WhatsappIcon>
                        <p>Whatsapp</p>
                    </div>
                </WhatsappShareButton>
                <div className="popup-compartir_button-item">
                    <FacebookMessengerShareButton url={urlToShare}>
                        <FacebookMessengerIcon round={true} size={42}></FacebookMessengerIcon>
                        <p>Messenger</p>
                    </FacebookMessengerShareButton>
                </div>
                <div className="popup-compartir_button-item">
                    <FacebookShareButton url={urlToShare}>
                        <FacebookIcon round={true} size={42}></FacebookIcon>
                        <p>Facebook</p>
                    </FacebookShareButton>
                </div>
                <div className="popup-compartir_button-item">
                    <TelegramShareButton url={urlToShare}>
                        <TelegramIcon round={true} size={42}></TelegramIcon>
                        <p>Telegram</p>
                    </TelegramShareButton>
                </div>
            </div>

            <div className="popup-compartir_button-copiar-enlace">
                    <button onClick={()=>onClickCopy()}> Copiar Enlace</button>
            </div>

        </div>

    </Popup>
}
export default PopupCompartir;