import {BaseScript} from "./BaseScript";

export class BaseViewScript extends BaseScript {

    _skin: Laya.Scene;
    inited: boolean;
    /** @prop {name:effType, tips:"弹出效果 0没有 1有", type:Int, default:0}*/
    effType: number = 0;

    isShow = false;

    constructor() {
        super();
    }

    init() {
        super.init();
        this._skin = this.owner as Laya.Scene;
        this.onResize();
    }
    
    onResize() {
        
    }





}