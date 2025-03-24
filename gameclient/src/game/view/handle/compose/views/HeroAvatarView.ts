import { stElement } from "../../../../network/protocols/BaseProto";
import { EAvatarDir } from "../../avatar/AvatarView";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { FightUtils } from "../FightUtils";
import { ECreateHero, EEffectTarget, IBaseAvatarCheckTarget } from "../vos/EFightEnum";
import { FightValueConfig } from "../vos/FightValueConfig";
import { SkillBarView } from "./cells/SkillBarView";
import { HeroHalo } from "./HeroHalo";
import { ITowerMonster } from "./ITowerMonster";
import { TowerAvatarView } from "./TowerAvatarView";
/**英雄 */
export class HeroAvatarView extends TowerAvatarView{
    /**资源id */
    resId:number;
    resType:ECreateHero = ECreateHero.HeroId;

    heroVo: stElement;
    defaultAnim:EAvatarAnim;
    defaultScale:number = 1;
    /**技能条句柄 */
    skillBar:SkillBarView;
    resKey:string;
    offsetX:number = 0;
    offsetY:number = 0;
    // heroCfg:Configs.t_Hero_dat;
    /**索引号 */
    index:number;
    /**光圈层级 */
    haloLayer:Laya.Sprite;
    /**光圈 */
    private _halo:HeroHalo;
    constructor(){
        super();
    }
    protected checkTarget(obj:IBaseAvatarCheckTarget){
        if(obj.type == EEffectTarget.Hero && this.heroVo && obj.uid == this.heroVo.uid){
            return true
        }
    }
    protected onSpine1Complete() {
        this.isLoaded = true;
        if (!this.isDestory) {
            
            if (this.heroVo) {
                this.addHalo();
            }
            this.addToParent();
            this.laterUpdatePos();
        }
    }
    /**增加脚底的光圈*/
    private addHalo(){
        if(this.haloLayer){
            this._halo  = new HeroHalo();
            this._halo.haloLayer = this.haloLayer;
            this._halo.setHero(this);
        }
    }
    protected initEvt(){
    }
    init(){
        this.initEvt();
        this.coreSpine = this.create();
    }

    create():ITowerMonster{
        return FightFactory.createHero(this.resId,this.resKey,this.defaultScale,this.defaultAnim,this,this.onSpine1Complete,this.resType);
    }

    laterUpdatePos(){
        let x:number;
        let y:number;
        if(this.heroVo){
            let type = ComposeModel.Ins.getOwnerType(this.heroVo.playerId);
            let pos = FightUtils.getAvataLocalrPos(this.heroVo.fid,this.index,type);
            x = pos.x;
            y = pos.y;
        }else{
            x = this.offsetX;
            y = this.offsetY;
        }
        this.setPos(x,y);
    }

    private setPos(x:number,y:number){
        if(this.coreSpine && this.coreSpine.skeleton){
            // console.log(`setPos... hero${this.heroCfg.f_heroid},设置坐标${x} ${y}`);
            this.coreSpine.skeleton.pos(x,y);
        }else{
            LogSys.Warn(`this.coreSpine.skeleton is not init...x:${x} y:${y}`);
        }
    }
    dispose(){
        this.haloLayer = null;
        this.index = 0;
        this.heroVo = null;
        // this.quaCir && this.quaCir.removeSelf();
        if(this._halo){
            this._halo.dispose();
            this._halo = null;
        }
        if (this.skillBar) {
            this.skillBar.dispose();
            this.skillBar = null;
        }
        // this.disposeHeroUpTips();
        super.dispose();
    }

    walkTo(dis:number,dir:EAvatarDir){
        this.dir = dir;
        this.playMove();
        Laya.timer.once(FightValueConfig.MOVE_GRID_TIME*dis,this,this.onPlayIdle);
    }

    playAtk(anim:EAvatarAnim){
        if(this.coreSpine){
            this.coreSpine.play(anim,this,this.onPlayIdle);
        }
    }
    private playMove(){
        if(this.coreSpine){
            this.coreSpine.play(EAvatarAnim.TowerMove,null,null,null,false,true,true);
        }
    }
    private onPlayIdle(){
        if(this.coreSpine){
            this.coreSpine.play(EAvatarAnim.TowerIdle,null,null,null,false,true,true);
        }
    }
}