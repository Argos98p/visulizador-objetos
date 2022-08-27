import {completeImageUrl} from "../Api/apiRoutes";
import {Escena} from "./Escena";
import {Frame} from "./Frame";

export class MiObjeto{
    constructor(escenas,idUsuario,nombre) {
        this.escenas = this.rebaseEscenas(escenas);
        this.nombre= nombre;
        this.idUsuario = idUsuario;
    }

    rebaseEscenas(escenas){
        let misEscenas = [];
        for (const index in escenas){
            let newEscena = new Escena(index,escenas[index].nombre);
            let temp = [];
            let i=1;
            for(let value of escenas[index].imagenes){
                let splitNombre = value.path.split("/");
                let completeUrl=completeImageUrl(`/${
                    splitNombre[1]
                }/${
                    splitNombre[2]
                }/${
                    splitNombre[3]
                }_compresos/${i}.jpg`);

                temp.push(new Frame(completeUrl))
                i++;
            }

            newEscena.setFrames(temp);
            misEscenas.push(newEscena);
        }
        return misEscenas
    }
}

