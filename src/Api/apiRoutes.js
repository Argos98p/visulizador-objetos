let BaseURL="http://173.255.114.112";



/*
function statusEsceneUrl(id,escenaNombre){
    return `${BaseURL}:8084/api/objects/getstatusescene?idobjeto=${id}&nombre_escena=${escenaNombre}`
}*/

function infoObjectUrl(id){
    return `${BaseURL}:8084/api/objects/getobject?idobjeto=${id}`;
}

/*
function numberFramesInScene(id,escena){
    return `${BaseURL}:8084/api/objects/getnumberframes?idobjeto=${id}&nombre_escena=${escena}`
}*/

function completeImageUrl(path){
    return `${BaseURL}:8085/api/images/getimage?path=${path}`;
}

function getExtrasUrl(id){
    return `${BaseURL}:8084/api/objects/getextras?idobjeto=${id}`
}

function ImagePath(pathImage){
    return `${BaseURL}:8085/api/images/getimage?path=${pathImage}`;
}


function  postAddHotspot(id,nombreEscena,idUsuario){
    return `${BaseURL}:8084/api/objects/addhotspot?idobjeto=${id}&nombre_escena=${nombreEscena}&idusuario=${idUsuario}`;
}

function deleteExtra(idObjeto,idExtra,idUsuario){
    return `${BaseURL}:8084/api/objects/deleteextra?idobjeto=${idObjeto}&idextra=${idExtra}&idusuario=${idUsuario}`;
}

function uploadExtraUrl(id,archivo,descripcion,idUsuario){
    return `${BaseURL}:8084/api/objects/addextra/imagen?idobjeto=${id}&archivo=${archivo}&descripcion=${descripcion}&idusuario=${idUsuario}`;
}

function img360CompleteUrl(path,id){
    return `${BaseURL}:8085/api/images/getimage?path=${path}`;
}
function getHotspots(id, nombreEscena){
    return `${BaseURL}:8084/api/objects/gethotspots?idobjeto=${id}&nombre_escena=${nombreEscena}`
}

function deleteHotspot(id, nombreEscena,nombreHotspot,idUsuario){
    return `${BaseURL}:8084/api/objects/deletehotspot?idobjeto=${id}&nombre_escena=${nombreEscena}&nombreHotspot=${nombreHotspot}&idusuario=${idUsuario}`
}
function addExtraPdf(id,nombre_doc,titulo, descripcion,idUsuario){
    return `${BaseURL}:8084/api/objects/addextra/pdf?idobjeto=${id}&archivo=${nombre_doc}&titulo=${titulo}&descripcion=${descripcion}&idusuario=${idUsuario}`;
}

function addLinkYoutube(id,nombreArchivo, link, titulo, descripcion,idUsuario){
    return `${BaseURL}:8084/api/objects/addextra/link?idobjeto=${id}&nombre=${nombreArchivo}&link=${link}&titulo=${titulo}&descripcion=${descripcion}&idusuario=${idUsuario}`;
}
function getPDF(id,path){
    return `${BaseURL}:8085/api/images/getresource?path=${path}`
}

function viewResource(id,path){
    return `${BaseURL}:8085/api/images/viewresource/pdf?path=${path}`
}

function verificaToken(idUser){
    return `${BaseURL}:8084/api/objects/verificacion?idusuario=${idUser}`;
}

function loginUser(){
    return `${BaseURL}:8086/api/auth/signin`
}
export {verificaToken,viewResource,loginUser,addLinkYoutube,img360CompleteUrl,getPDF,addExtraPdf,deleteHotspot,uploadExtraUrl,infoObjectUrl,getHotspots,completeImageUrl,getExtrasUrl,ImagePath,postAddHotspot,deleteExtra}