// import { DebugUtil } from "../../../../frame/util/DebugUtil";
import { ui } from "../../../../ui/layaMaxUI";
import { ComposeConfig } from "../compose/ComposeConfig";
import { FightUtils } from "../compose/FightUtils";
import { EMonsterPos } from "../compose/vos/FightValueConfig";
import { GuideModel } from "./GuideModel";
import { GuideRect } from "./GuideRect";

// 手指
export class SmallFingerView extends ui.views.compose.guide.ui_guide_handUI {
    private readonly useTime: number = 1000;
    private targetSpr: Laya.Sprite = new Laya.Sprite();
    private tween: Laya.Tween;
    // private bg:Laya.Sprite = new Laya.Sprite();
    private _start: Laya.Point = new Laya.Point();
    private _end: Laya.Point = new Laya.Point();
    // private _effect:NoContainerSimpleEffect;
    private readonly useAnim:boolean;
    constructor() {
        super();
        this.tween = new Laya.Tween();
        this.targetSpr.alpha = GuideRect.Alpha;
        this.addChildAt(this.targetSpr,0);
        // this.addChildAt(this.bg,0);
        // this.bg.graphics.drawRect(0, 0, ComposeConfig.cellW * ComposeConfig.mapW, ComposeConfig.cellH * ComposeConfig.mapH, "#00ff00");
        // this.bg.alpha = 0.5;
        // this.bg.mask = this.targetSpr;

        // D:\Project1\Client\towertrunk\resource\o\spine\scene\TX_jiantou

        // this.targetSpr.alpha = 0.75;
        DebugUtil.draw(this,"#ff0000",30,30,0,0,true);
    }
    // private disposeEffect(){
    //     if(this._effect){
    //         this._effect.dispose();
    //         this._effect = null;
    //     }
    // }
    // 0-2|4-2
    show(posStr: string) {
        // this.disposeEffect();
        // this._effect = SpineEffectMgr.createLoopNoSimpleEffect(`o/spine/scene/TX_jiantou/TX_jiantou`,this);

        const startX:number  = 0;
        const startY:number  = 2;

        // posStr = "5-1|3-2";//"3-2|5-1";
        let arr: string[] = posStr.split("|");
        let a: string[] = arr[0].split("-");
        let b: string[] = arr[1].split("-");

        let posX1:number = parseInt(a[0]);
        let posY1:number = parseInt(a[1]);
        // let posX:number = parseInt(a[0]);
        // let posY:number = parseInt(a[1]);

        let posX2:number = parseInt(b[0]);
        let posY2:number = parseInt(b[1]);

        let owner: EMonsterPos = EMonsterPos.Owner;
        let sx = FightUtils.IsoxToPosX(posX1);
        let sy = FightUtils.IsoyToPosY(posY1, owner);

        let ex = FightUtils.IsoxToPosX(posX2);
        let ey = FightUtils.IsoyToPosY(posY2, owner);

        let ox:number = sx - startX;// = Math.abs(ex - sx);
        let oy:number = sy - startY;;//Math.abs(ey - sy);

        let offsetX = 0;//ComposeConfig.cellW / 2;
        let offsetY = 0;//ComposeConfig.cellH / 2;

        this._start.x = offsetX + ox;
        this._start.y = offsetY + oy;

        this._end.x = ex - sx + offsetX + ox;
        this._end.y = ey - sy + offsetY + oy;
        //=================================================
        // this.targetSpr.graphics.clear();
        //this.targetSpr.graphics.drawRect(this._end.x - ComposeConfig.cellW / 2, this._end.y - ComposeConfig.cellH / 2, ComposeConfig.cellW, ComposeConfig.cellH, "#FF9C00");
        //this.targetSpr.graphics.drawRect(ox - ComposeConfig.cellW / 2, oy - ComposeConfig.cellH / 2, ComposeConfig.cellW, ComposeConfig.cellH, "#FF9C00");
        
        let checkList:Laya.Point[] = [];
        checkList.push(
            new Laya.Point(posX1,posY1),
            new Laya.Point(posX2,posY2),
        )
        this.drawGreen(checkList);

        if (this.useAnim) {
            this.img1.visible = true;
            this.img1.x = this._start.x;
            this.img1.y = this._start.y;
            this.onPlayEnd();
        } else {
            this.img1.visible = false;
        }
    }

    private drawGrid(ox: number, oy: number) {
        let graphics = this.targetSpr.graphics;
        // let offset: number = 0;//-ComposeModel.Ins.fightTypeAdaper.offsetIsoY / 2;
        let offset = 0;//-GuideModel.Ins.model.fightTypeAdaper.offset_ISO_Y * ComposeConfig.cellH/2;
        graphics.drawRect(ox * ComposeConfig.cellW, (oy - 1) * ComposeConfig.cellH + offset, ComposeConfig.cellW, ComposeConfig.cellH, "#000000");
    }

    private drawGreen(posList:Laya.Point[]){
        // posX1:number,posY1:number,posX2:number,posY2:number
        this.targetSpr.graphics.clear();
        /*
            +-----------------+
            |02 12 22 32 42 52|
            |01 11 21 31 41 51|
            |00 10 20 30 40 50|
        */
        for(let i = 0;i < ComposeConfig.mapW;i++){
            for(let n = 0;n < ComposeConfig.mapH;n++){
                let find:boolean;
                for(let u = 0;u < posList.length;u++){
                    // if(posList[i].)
                    let o = posList[u];
                    if(o.x == i && o.y == n){
                        find = true;
                    }
                }
                if(!find){
                    this.drawGrid(i,ComposeConfig.mapH-n);
                }
            }
        }
    }

    private onPlayEnd() {
        this.img1.x = this._start.x;
        this.img1.y = this._start.y;
        this.tween.to(this.img1, { x: this._end.x, y: this._end.y }, this.useTime, null, new Laya.Handler(this, this.onPlayEnd));
    }

    hide() {
        // this.disposeEffect();
        if (this.parent) {
            this.removeSelf();
        }
        this.tween.clear();
    }
}