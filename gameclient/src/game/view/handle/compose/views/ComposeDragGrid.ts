// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { stElement } from "../../../../network/protocols/BaseProto";
import { EAvatarDir } from "../../avatar/AvatarView";
import { EGuideEvent, GuideModel } from "../../guide/GuideModel";
import { MainModel } from "../../main/model/MainModel";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightUtils } from "../FightUtils";
import { FightValueConfig } from "../vos/FightValueConfig";
import { AnimalAvatar } from "./AnimalAvatar";
import { HeroCirleYellow } from "./HeroCirleYellow";

/**
 * 单个格子(多个格子组合的一个组件)
 */
export class ComposeDragGrid extends Laya.Sprite{
    private moveTween:Laya.Tween;
    private _yollowCirle:HeroCirleYellow;
    // parent:Laya.Sprite;
    setParent(p:Laya.Sprite){
        // this.parent = p;
    }
    data:stElement;
    /**当前的区块坐标X */
    curIsoX:number;
    /**当前的区块坐标Y */
    curIsoY:number;
    /**动物流水号 */
    uid: number;

    /**角色 */
    animal: AnimalAvatar;

    constructor() {
        super();
        this.moveTween = new Laya.Tween();
        this.width = ComposeConfig.cellW;
        this.height = ComposeConfig.cellH;
        DebugUtil.draw(this,"#00ff00",undefined,undefined,undefined,undefined,undefined,2);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onDisplay(){
        GuideModel.Ins.on(EGuideEvent.ShowCirleYellow,this,this.onShowCirleYellow);
        Laya.timer.frameLoop(60,this,this.onLoopCheck);
    }

    private onShowCirleYellow(uid:number){
        if(this.data.uid == uid){
            if(!this._yollowCirle){
                this._yollowCirle = new HeroCirleYellow();
            }
            this._yollowCirle.show(this.data);
            this.addChild(this._yollowCirle);
        }
    }

    private onUnDisplay(){
        GuideModel.Ins.off(EGuideEvent.ShowCirleYellow,this,this.onShowCirleYellow);
        Laya.timer.clear(this, this.onLoopCheck);
    }

    private onLoopCheck() {
        let vo = this.data;

        let _l = ComposeModel.Ins.refreshList;
        let obj = _l.find(o => o.uid == vo.uid && o.playerId == MainModel.Ins.mRoleData.AccountId);
        if (obj) {
            if (obj.x != this.curIsoX || obj.y != this.curIsoY) {
                // 数据不同步引起的位置错误,容错处理设置位置
                LogSys.Warn(JSON.stringify(vo)+"to fixed " + JSON.stringify(obj));
                this.data = obj; 
                this.curIsoX = obj.x;
                this.curIsoY = obj.y;
                this.refresh();
            }
        }
    }

    /**加载*/
    load() {
        if (!this.animal) {
            this.animal = new AnimalAvatar();
            this.animal.curParent = this;
        }
        this.animal.load(this.data);
    }

    dispose() {
        if(this._yollowCirle){
            this._yollowCirle.close();
            this._yollowCirle = null;
        }
        this.uid = 0;
        if (this.animal) {
            this.animal.dispose();
            this.animal = null;
        }
        this.removeSelf();
    }

    refresh(){
        let type = ComposeModel.Ins.getOwnerType(this.data.playerId);
        let sx = FightUtils.IsoxToPosX(this.curIsoX);
        let sy = FightUtils.IsoyToPosY(this.curIsoY, type);
        this.x = sx - ComposeConfig.cellW/2;
        this.y = sy - ComposeConfig.cellH/2;
    }

    /**移动 */
    moveTo(tx: number, ty: number) {
        let dir:EAvatarDir = EAvatarDir.Right;
        if(this.curIsoX > tx){
            dir = EAvatarDir.Left;
        }
        let len: number = FightUtils.getLength(this.curIsoX, this.curIsoY, tx, ty);
        this.animal.moveTo(len,dir);

        let useTime: number = FightValueConfig.MOVE_GRID_TIME * len;//移动时间
        //=============================================================================
        let type = ComposeModel.Ins.getOwnerType(this.data.playerId);
        let sx = FightUtils.IsoxToPosX(tx);
        let sy = FightUtils.IsoyToPosY(ty, type);
        let nx = sx - ComposeConfig.cellW/2;
        let ny = sy - ComposeConfig.cellH/2;
        //============================================================================='
        this.moveTween.clear();
        this.moveTween.to(this,{x:nx,y:ny},useTime);
        // let timer = new Laya.Timer();
        Laya.timer.clear(this,this.onMoveEnd);
        Laya.timer.once(useTime,this,this.onMoveEnd,[tx,ty]);
        this.curIsoX = this.data.x;
        this.curIsoY = this.data.y;
        return useTime;
    }

    private onMoveEnd(tx:number,ty:number){
        this.refresh();
        if(MainModel.Ins.isInsideGuide){
            MainModel.Ins.event(TowerMainEvent.MainViewLayerChange);
        }
    }
}