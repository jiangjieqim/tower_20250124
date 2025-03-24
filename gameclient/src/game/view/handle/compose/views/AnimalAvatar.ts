import { stElement } from "../../../../network/protocols/BaseProto";
import { EAvatarDir } from "../../avatar/AvatarView";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { EHeroQua } from "../t_Battle_Config";
import { EFightLayer } from "../vos/EFightEnum";
import { HeroAvatarView } from "./HeroAvatarView";

/**角色逻辑容器 */
export class AnimalAvatar {
    private readonly heroCount:number = 3;
    curParent:Laya.Sprite;
    private vo:stElement;
    /**英雄列表 */
    private _heroList:HeroAvatarView[];

    get heroList(){
        return this._heroList;
    }
    constructor() {
        // super();
        this._heroList = [];
    }

    getHeroIndex(index:number):HeroAvatarView{
        return this._heroList[index];
    }

    /**创建英雄 */
    private createHero(vo:stElement,index:number) {
        let _monster = FightFactory.createFightHeroAvatar(vo.fid, this.curParent,0,0,index,vo,ComposeModel.Ins.fightView.getLayer(EFightLayer.HaloLayer));
        this._heroList.push(_monster);
        this.updateHeroUp();
    }
    get randomPos(){
        return new Laya.Point(0,0); //this.showPositions[Math.floor(Math.random() * this.showPositions.length)];
    }

    getHeroAvatar(i:number){
        if(this._heroList[i]){
            return this._heroList[i];
        }
        let len = this._heroList.length;
        let index = Math.floor(Math.random() * len);
        return this._heroList[index];
    }

    load(vo:stElement){
        this.vo = vo;
        this.clearHero();
        
        for(let i = 0;i < vo.num;i++){
            this.createHero(vo,i);
        }
        // Laya.timer.frameLoop(1,this,this.onFrameLoop);
        this.updatePosition();
    }

    /**增加一个英雄 */
    addOneHero(vo:stElement){
        this.vo = vo;
        this.createHero(this.vo,this._heroList.length);
        //===============================================
    }

    /**删除一个英雄 */
    delOneHero(){
        if(this._heroList.length > 0){
            let hero = this._heroList.pop();
            hero.dispose();
        }else{
            LogSys.Warn(`${JSON.stringify(this.vo)}删除失败`);
        }
        this.updateHeroUp();
    }

    private updateHeroUp(){
        let url:string = `o/spine/scene/jiantou/jiantou`;
        if(this._heroList.length < this.heroCount){
            for(let i = 0;i < this._heroList.length;i++){
                let cell = this._heroList[i];
                cell.disposeBindEffect(url);
                
            }
        }
        else if (this._heroList.length >= this.heroCount) {

            let cell = this._heroList[this._heroList.length - 1];
            if (this.vo.playerId == ComposeModel.Ins.ownerPlayer.playerId) {
                let cfg = HeroListProxy.Ins.getCfgById(this.vo.fid);
                if (cfg && cfg.f_qua < EHeroQua.Orange) {
                    cell.bindEffect(url, ComposeConfig.cellW / 4 + ComposeConfig.cellW, ComposeConfig.cellH);
                }
            }
        }
    }

    private updatePosition(){
        for(let i = 0;i < this._heroList.length;i++){
            let cell = this._heroList[i];
            cell.laterUpdatePos();
        }
    }

    /**清理英雄 */
    clearHero(){
        // Laya.timer.clear(this,this.onFrameLoop);
        while (this._heroList && this._heroList.length) {
            let _hero = this._heroList.shift();
            _hero.dispose();
        }
    }
    dispose(){
        this.clearHero();
        this.vo = null;
    }

    moveTo(dis:number,dir:EAvatarDir){
        // Laya.timer.clear(this,this.onFrameLoop);
        for(let i = 0;i < this._heroList.length;i++){
            let cell = this._heroList[i];
            cell.walkTo(dis,dir);
        }
    }

}