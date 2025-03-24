import { ScreenAdapter } from "../../../../G";
import { stElement } from "../../../../network/protocols/BaseProto";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightUtils } from "../FightUtils";
import { EComposeUpdateType } from "../vos/EComposeUpdateType";
import { IDelHeroUpdate } from "../vos/EFightEnum";
import { EMonsterPos } from "../vos/FightValueConfig";
import { Trail } from "./Trail";

export interface ITrailDecorator {
    /**
     * 
     * @param o 
     * @param type 
     * @param delList 
     * @param isInit 是否是场景初始化创建
     */
    play(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[],isInit:boolean);
    convert(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[]);
    startPlay();
    setXY(x:number,y:number):void;
}
export class BaseTrailDecorator {
   
    protected get model() {
        return ComposeModel.Ins;
    }
}
/**弹道轨迹 */
export class TrailDecorator extends BaseTrailDecorator implements ITrailDecorator {
    private ox:number;
    private oy:number;
    private color:string;
    private sx: number;
    private sy: number;
    /**弹道飞行 */
    play(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[]) {
        this.convert(o, type, delList);
        this.startPlay();
    }
    setXY(x:number,y:number):void{
        this.sx = x;
        this.sy = y;
    }
    parse(o:stElement){
        // let o = this.o;
        let isoX: number = o.x;
        let isoY: number = o.y;
        this.color = HeroListProxy.Ins.getQuaColor(o.fid);
        let ox: number = FightUtils.IsoxToPosX(isoX);
        let oy: number = FightUtils.IsoyToPosY(isoY, EMonsterPos.Owner);
        this.ox = ox;
        this.oy = oy;
    }

    startPlay(){
        let _fight = this.model.fightView;
        let trail: Trail = Laya.Pool.getItemByClass(Trail.CLS_NAME, Trail);
        trail.curColor = this.color;
        this.composeView._ui.addChild(trail);
        let startX: number = this.sx;
        let startY: number = this.sy;
        trail.play(startX, startY,_fight.x - startX + this.ox + ComposeConfig.cellW, _fight.y - startY + this.oy + ComposeConfig.cellH);
    }

    private get composeView() {
        return this.model.composeView;
    }

    convert(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[]) {
        this.parse(o);
        this.sx = ScreenAdapter.UIRefWidth / 2;
        this.sy = 994;
    }
}