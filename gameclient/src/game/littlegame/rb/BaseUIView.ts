

import { Global } from "../Global";
import { GameModel } from "../module/game/model/GameModel";
import { BaseScript } from "./BaseScript";
import { BaseViewScript } from "./BaseViewScript";
import { EventCenter } from "./EventCenter";
import { ModuleManager } from "./ModuleManager";
import { SoundManger } from "./sound/SoundManager";

export abstract class BaseUIView {

    effType = 0;
    url: string;
    preLoadRes: any[];
    inloadUI: boolean;
    openParam: any;
    isopen: boolean;
    isIninted: boolean;
    _skin: Laya.Scene;
    isShow: boolean;
    _layer: Laya.Sprite;
    needBg: boolean;
    closeBg: Laya.Sprite;
    bgAlpha: number;
    clickBgHide: boolean;
    viewId: number;
    _script: BaseScript;
    needShowLoading: Boolean;

    /**url: string, layer = UIManager.inst.uiLayer, preLoadRes?: any[] */
    constructor() {
        // this.url = url;
        // this.preLoadRes = preLoadRes;
        // this._layer = UIManager.inst.uiLayer
        this.needBg = false;
        this.bgAlpha = 0.5;
        this.inloadUI = false;
        this.isopen = false;
        this.isIninted = false;
        this.clickBgHide = true;
        this.needShowLoading = false;
    }

    private _evts: { [type: string]: { caller: any, listener: Function, target: Laya.EventDispatcher, args?: any[] }[] };

    onEvt(target: Laya.EventDispatcher, type: string, thisObject: any, listener: Function, args?: any[]) {
        target.on(type, thisObject, listener, args);
        this._evts || (this._evts = {});
        this._evts[type] || (this._evts[type] = []);
        this._evts[type].push({ listener: listener, caller: thisObject, target: target });
    }

    offEvt(target: Laya.EventDispatcher, type: string, thisObject: any, listener: Function, args?: any[]) {
        if (this._evts) {
            for (let type in this._evts) {
                let item = this._evts[type];
                if (item) {
                    for (let i = 0; i < item.length; i++) {
                        if(item[i].target = target){
                            item[i].target.off(type, item[i].caller, item[i].listener);
                            item.splice(i, 1);
                        }
                    }
                }
            }
            this._evts = null;
        }
    }

    /**在这里初始化 ，不需要调用updateUI */
    init() {
        this.isIninted = true;
        this.onEvt(this._skin, Laya.Event.CLICK, this, this.onClick);
        this.onEvt(EventCenter.inst, EventCenter.ON_STAGE_RESIZE, this, this.onResize);
    }


    

    /**一般不需要重写 */
    open(param?: any) {
        this.openParam = param;
        this.isopen = true;

        EventCenter.inst.event(EventCenter.ON_VIEWOPEN, this);
        this.model.view.pushInOpenView(this);

        if (this.isIninted) {
            if (this.needBg && !this.closeBg) {
                this.closeBg = new Laya.Sprite();
                this.closeBg.y = -Laya.stage.y;
                this.closeBg.alpha = this.bgAlpha;
                this.closeBg.width = Laya.stage.width;
                this.closeBg.height = Laya.stage.height;
                this.closeBg.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, 0x000000);
                this.onEvt(this.closeBg,Laya.Event.CLICK, this, this.onClickClose);
            }
            this.onResize();

            let scale = this._skin.scaleX;
            this._layer.addChild(this.closeBg);
            this._layer.addChild(this._skin);

            Laya.Tween.clearTween(this._skin);
            if (this.effType > 0) {
                let prop = {};
                if (this.effType == 1) {
                    prop = { y: Laya.stage.height };
                } else if (this.effType == 2) {
                    prop = { x: -Laya.stage.width };
                } else if (this.effType == 3) {

                    this._skin.x = (this._layer.width - this._skin.width * this._skin.scaleX) / 2;
                    this._skin.y = (this._layer.height - this._skin.height * this._skin.scaleX) / 2;

                    this._skin.pivot(this._skin.width / 2, this._skin.height / 2);
                    // 
                    this._skin.x += this._skin.width / 2 * scale;
                    this._skin.y += this._skin.height / 2 * scale;
                    prop = { scaleX: 0, scaleY: 0 };
                } else if (this.effType == 4) {
                    prop = { x: Laya.stage.width };
                }
                Laya.Tween.from(this._skin, prop, 200, Laya.Ease.linearInOut, Laya.Handler.create(this, this.onShow));
            } else {
                this.onShow();
            }
            this.updateUI();
        } else {
            this.loadUI();
        }
    }

    onClick(e: Laya.Event) {
        if (e.target instanceof Laya.Button) {
            SoundManger.click();
        }
    }

    onClickClose() {
        if (this.clickBgHide) {
            this.close();
        }
    }

    close(isStrict = false) {
        this.model.view.removeOpenView(this);
        if (this.isopen == false) {
            return;
        }
        this.isopen = false;
        if (this.isIninted) {
            Laya.Tween.clearTween(this._skin);
            if (this.effType > 0 && isStrict == false) {
                let prop = {};
                if (this.effType == 1) {
                    prop = { y: Laya.stage.height };
                } else if (this.effType == 2) {
                    prop = { x: -Laya.stage.width };
                } else if (this.effType == 3) {
                    prop = { scaleX: 0, scaleY: 0 };
                } else if (this.effType == 4) {
                    prop = { x: Laya.stage.width };
                }
                Laya.Tween.to(this._skin, prop, 200, Laya.Ease.linearInOut, Laya.Handler.create(this, this.effOut));
            } else {
                this.effOut();
            }
        }
    }

    effOut() {
        this.isShow = false;

        if (this.closeBg) {
            this.offEvt(this.closeBg, Laya.Event.CLICK, this, this.onClickClose)
        }
        this.closeBg && this.closeBg.parent && this.closeBg.parent.removeChild(this.closeBg);
        this._skin && this._skin.parent && this._skin.parent.removeChild(this._skin);

        EventCenter.inst.event(EventCenter.ON_VIEWHIDE, this);
    }

    /**每次打开都会调用 */
    updateUI() {

    }



    private loadUI() {
        if (this.inloadUI) {
            return;
        }
        this.inloadUI = true;
        if (this.needShowLoading) {
            //ExternalUtil.inst.showLoading({ title: '页面加载中...' });
        }

        if (this.preLoadRes && this.preLoadRes.length > 0) {

            for(let i=0;i<this.preLoadRes.length;i++){
                this.preLoadRes[i].url = Global.subPath + this.preLoadRes[i].url;
            }

            Laya.loader.load(this.preLoadRes, Laya.Handler.create(this, this.onPreResLoaded));
        } else {
            this.onPreResLoaded();
        }


    }

    onProgress(percent: number) {

    }

    onComp(scene: Laya.Scene) {
        if (this.needShowLoading) {
            //ExternalUtil.inst.hideLoading();
        }

        if (scene) {
            scene.mouseThrough = true;
            // scene.drawCallOptimize = true;
            this._skin = scene;
            this._script = this._skin.getComponent(BaseViewScript);
            this.onResize();
            this.init();

            if (this.isopen) {
                this.open(this.openParam);
            }
        } else {
            //this.model.view.showNotice("加载失败");
        }


    }

    onPreResLoaded() {

        let proHander: Laya.Handler = Laya.Handler.create(this, function (percent: number) {
            if (this.onProgress) {
                this.onProgress.call(this, percent)
            }
        }, null, false)

        Laya.Scene.load(Global.subPath + this.url, Laya.Handler.create(this, function (scene: Laya.Scene) {
            proHander.recover();
            if (this.onComp) {
                this.onComp.call(this, scene);
            }
        }), proHander)
    }

    onResize() {
        // console.log("77777777777777777777onResize::::");
       
        if (this._layer.height != Laya.stage.height) {
            this._layer.height = Laya.stage.height;
        }

        if (this._layer.width != Laya.stage.width) {
            this._layer.width = Laya.stage.width;
        }


        if (Global.inst.DCompS < 1) {
            this._skin.scaleX = this._skin.scaleY = Global.inst.getRealH() / this._skin.height;
            

        }
        else {
            this._skin.scaleX = this._skin.scaleY = Global.inst.getRealW() / this._skin.width;
        }

        this._skin.height = Laya.stage.height/this._skin.scaleY;



        this._skin.y = (this._layer.height - this._skin.height*this._skin.scaleX) / 2 - Laya.stage.y;
        this._skin.x = (this._layer.width - this._skin.width*this._skin.scaleX) / 2;
       
    }

    onShow() {
        Laya.timer.frameOnce(10, this, this.dipatchOnshow);
        this.isShow = true;
    }
    dipatchOnshow() {
        EventCenter.inst.event(EventCenter.ON_VIEWSHOW, this);
    }

    // get script(): BaseScript {
    //     if (this._skin) {
    //         let script = this._skin["script"]; //["script"];
    //         return script;
    //     }
    // }

    get model(): GameModel {
        return ModuleManager.inst.gameContext.model as GameModel;
    }



    destroy() {
        console.log("66666666666");
        Laya.timer.clearAll(this);
        if (this._skin) {
            this._skin["script"] = null;
            this._skin.offAll();
            this._skin.destroy();
            this._skin = null;
        }
        if (this._evts) {
            for (let type in this._evts) {
                let item = this._evts[type];
                if (item) {
                    for (let i = 0; i < item.length; i++) {
                        item[i].target.off(type, item[i].caller, item[i].listener);
                    }
                }
            }
            this._evts = null;
        }
    }




}
