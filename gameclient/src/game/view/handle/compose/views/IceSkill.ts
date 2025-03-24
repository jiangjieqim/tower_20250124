import { GameTex } from "../../../../../frame/view/GameList";
import { ComposeModel } from "../ComposeModel";
import { EFightLayer } from "../vos/EFightEnum";
import { ESkillBuffType } from "../vos/ESkillBuffType";
import { TowerAvatarView } from "./TowerAvatarView";

/**冰块特效 */
export class IceSkill{
    protected _target:TowerAvatarView;
    protected curType:ESkillBuffType = ESkillBuffType.Ice;
    protected _scale:number = 1;
    private _ice:GameTex;
    private readonly ICE_KEY:string = "ICE";
    private needMS:number = 0;
    private curTime:number;
    protected get layer(){
        let model = ComposeModel.Ins;
        if(model && model.fightView){
            return model.fightView.getLayer(EFightLayer.HitMonsterLayer);
        }
    }
    constructor(){
        Laya.timer.frameLoop(1,this,this.onFrameLoop);
    }

    protected onInit(){
        this._ice = Laya.Pool.getItemByClass(this.ICE_KEY,GameTex);
        this._ice.anchorX = 0.5;
        this._ice.anchorY = 1;
        this._ice.skin = `o/skill/ice.png`;
    }
    private _tmpTime:number;
    /**在目标对象上ms毫秒之后消失 */
    setTarget(target: TowerAvatarView, ms: number = 0,_scale:number = 1) {
        this._target = target;
        this.curTime = 0;
        this.needMS = ms;
        this._scale = _scale;

        this._tmpTime = Laya.timer.currTimer;
        // LogSys.Log(`开始冰冻`);
        this.onInit();
    }

    protected setView() {
        let curLayer = this.layer;
        if(!curLayer){
            return;
        }
        let heroSkel: Laya.Sprite = this._target.coreSpine.skeleton;
        this._target.coreSpine.animpause();
        // if(curLayer){
            if (!this._ice.parent) {
                // this._target.coreSpine.skeleton.addChild(this._ice);
                curLayer.addChild(this._ice);
                this._ice.scaleX = this._ice.scaleY = this._scale;
            }
            let pos = (heroSkel.parent as Laya.Sprite).localToGlobal(new Laya.Point(heroSkel.x, heroSkel.y));
            let offset = (curLayer.parent as Laya.Sprite).localToGlobal(new Laya.Point(curLayer.x, curLayer.y));
            this._ice.pos(pos.x - offset.x, pos.y - offset.y);
        // }else{
        // this.dispose();
        // }
    }

    protected onFrameLoop() {
        if (this._target && this._target.coreSpine && 
            this._target.coreSpine.skeleton && 
            this._target.coreSpine.skeleton.parent) 
        {
            this.setView();
        }
        this.curTime+=Laya.timer.delta;
        if(this.curTime >= this.needMS || this._target.isDestory){
            if(!this._target.isDestory){
                this._target.coreSpine.animplay();
            }
            // LogSys.Log(`需要消耗时间${this.needMS},冰冻时间消耗${(Laya.timer.currTimer - this._tmpTime)}`);
            this.dispose();
        }
    }
    dispose() {
        Laya.timer.clear(this, this.onFrameLoop);
        if (this._target) {
            let index: number = this._target.skillBuffList.findIndex(o => o == this.curType);
            if (index != -1) {
                this._target.skillBuffList.splice(index, 1);
            }
        }

        if (this._ice) {
            // this._ice.clearTex();
            this._ice.removeSelf();
            Laya.Pool.recover(this.ICE_KEY, this._ice);
            this._ice = null;;
        }
    }
}