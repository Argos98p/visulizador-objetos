export class Escena {
    constructor(index,nombre) {
        this.index=index;
        this.frames=[];
        this.nombre=nombre;
    }

    setFrames(frames){
        this.frames=frames;
    }

    getSrcPath(){
        let srcArray=[]
        for(let src of this.frames){
            srcArray.push(src.path);
        }
        return srcArray;
    }


}