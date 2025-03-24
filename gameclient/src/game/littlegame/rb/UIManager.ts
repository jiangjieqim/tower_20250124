import {Global} from "../Global";
import Sprite = Laya.Sprite;

export class UIManager {

    private static _inst: UIManager;
    static get inst(): UIManager {
        if (!UIManager._inst) {
            UIManager._inst = new UIManager();
        }
        return UIManager._inst;
    }

    rootContainer:Laya.Sprite;

    uiLayer: Sprite;
    uiCommonLayer: Sprite;
    popLayer: Sprite;
    guideLayer: Sprite;
    tipLayer: Sprite;
    fitLayer: Sprite;

    layers:Sprite[];


    constructor() { 
        this.layers = [];

        this.uiLayer = new Sprite();
        this.uiCommonLayer = new Sprite();
        this.popLayer = new Sprite();
        this.guideLayer = new Sprite();
        this.tipLayer = new Sprite();

        this.layers.push(this.uiLayer,this.uiCommonLayer,this.popLayer,this.guideLayer,this.tipLayer);

        this.rootContainer = new Laya.Sprite();
        this.rootContainer.width = Laya.stage.width;
        this.rootContainer.height = Laya.stage.height;
        // this.rootContainer.mouseThrough = true;
        // Laya.stage.addChild(this.rootContainer);

        for(let i=0;i<this.layers.length;i++){
            let sp = this.layers[i];
            sp.width = Laya.stage.width;
            sp.height = Laya.stage.height;
            sp.mouseThrough = true;
            this.rootContainer.addChild(sp);
        }

        this.fitLayer = new Sprite();
        let gc = this.fitLayer.graphics;
        let w = (Laya.stage.width - Global.inst.getRealW()) / 2;
        let h = (Laya.stage.height - Global.inst.getRealH()) / 2;
        gc.drawRect(0, 0, w, h, 0x000000);
        gc.drawRect(Laya.stage.width - w, 0, w, Laya.stage.height, 0x000000);
        this.rootContainer.addChild(this.fitLayer);

    }

    addRoStage(){
        Laya.stage.addChild(this.rootContainer);
    }

    removeToStage(){
        if(this.rootContainer && this.rootContainer.parent){
            this.rootContainer.parent.removeChild(this.rootContainer);
        }
        
    }



}