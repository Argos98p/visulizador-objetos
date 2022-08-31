let BaseURL="http://redpanda.sytes.net";

function statusEsceneUrl(id,escenaNombre){
    return `${BaseURL}:8084/api/objects/getstatusescene?idobjeto=${id}&nombre_escena=${escenaNombre}`
}

function infoObjectUrl(id){
    return `${BaseURL}:8084/api/objects/getobject?idobjeto=${id}`;
}

function numberFramesInScene(id,escena){
    return `${BaseURL}:8084/api/objects/getnumberframes?idobjeto=${id}&nombre_escena=${escena}`
}

function completeImageUrl(path){
    return `${BaseURL}:8085/api/images/getimage?path=${path}`;
}

function getExtrasUrl(id){
    return `${BaseURL}:8084/api/objects/getextras?idobjeto=${id}`
}

function ImagePath(pathImage){
    return `${BaseURL}:8085/api/images/getimage?path=${pathImage}`;
}


function  postAddHotspot(id,nombreEscena){
    return `${BaseURL}:8084/api/objects/addhotspot?idobjeto=${id}&nombre_escena=${nombreEscena}`;
}

function deleteExtra(idObjeto,idExtra){
    return `${BaseURL}:8084/api/objects/deleteextra?idobjeto=${idObjeto}&idextra=${idExtra}`;
}

function uploadExtraUrl(id,archivo){
    return `${BaseURL}:8084/api/objects/addextra?idobjeto=${id}&archivo=${archivo}`
}

function getHotspots(id, nombreEscena){
    return `${BaseURL}:8084/api/objects/gethotspots?idobjeto=${id}&nombre_escena=${nombreEscena}`;
}

function deleteHotspot(id, nombreEscena,nombreHotspot,nombreImagen){
    return `${BaseURL}:8084/api/objects/deletehotspot?idobjeto=${id}&nombre_escena=${nombreEscena}&nombreHotspot=${nombreHotspot}&nombre_imagen=${nombreImagen}`
}


export {deleteHotspot,statusEsceneUrl,uploadExtraUrl,infoObjectUrl,getHotspots,numberFramesInScene,completeImageUrl,getExtrasUrl,ImagePath,postAddHotspot,deleteExtra}