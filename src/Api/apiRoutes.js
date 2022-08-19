function statusEsceneUrl(id,escenaNombre){
    return `http://redpanda.sytes.net:8084/api/objects/getstatusescene?idobjeto=${id}&nombre_escena=${escenaNombre}`
}

function infoObjectUrl(id){
    return `http://redpanda.sytes.net:8084/api/objects/getobject?idobjeto=${id}`;
}

function numberFramesInScene(id,escena){
    return `http://redpanda.sytes.net:8084/api/objects/getnumberframes?idobjeto=${id}&nombre_escena=${escena}`
}

function completeImageUrl(path){
    return `http://redpanda.sytes.net:8085/api/images/getimage?path=${path}`;
}

function getExtrasUrl(id){
    return `http://redpanda.sytes.net:8084/api/objects/getextras?idobjeto=${id}`
}

function ImagePath(pathImage){
    return `http://redpanda.sytes.net:8085/api/images/getimage?path=${pathImage}`;
}

function postAddHotspot(id, nombre_escena, nombre_imagen,x,y){
    return `http://redpanda.sytes.net:8084/api/objects/addhotspot?idobjeto=${id}&nombre_escena=${nombre_escena}&nombre_imagen=${nombre_imagen}&x=${x}&y=${y}`
}

function deleteExtra(idObjeto,idExtra){
    return `http://redpanda.sytes.net:8084/api/objects/deleteextra?idobjeto=${idObjeto}&idextra=${idExtra}`;
}

export {statusEsceneUrl,infoObjectUrl,numberFramesInScene,completeImageUrl,getExtrasUrl,ImagePath,postAddHotspot,deleteExtra}