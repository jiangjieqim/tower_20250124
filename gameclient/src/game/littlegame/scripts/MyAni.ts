import {Global} from "../Global";

export class MyAni extends Laya.Animation{
    constructor(){
        super();
       
    }

    set source(value:string){
        super.source = Global.subPath + value;
    }

    
}