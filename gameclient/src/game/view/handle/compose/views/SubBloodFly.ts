import { stSubBlood } from "../../../../network/protocols/BaseProto";
import { FontClipCtl } from "../../avatar/ctl/FontClipCtl";
import { ESubBloodType } from "../vos/ESubBloodType";
import { FightValueConfig } from "../vos/FightValueConfig";
import { TowerAvatarView } from "./TowerAvatarView";

/**掉血飘字 */
export class SubBloodFly{
    subCon:Laya.Sprite;
    // target:Laya.Sprite;
    target:TowerAvatarView;//目标掉血对象
    vo: stSubBlood;
    /**延迟的时间毫秒数 */
    delayTime:number = 0;
    private readonly baseUseTime:number = 500;
    /*滞留的时间毫秒 */
    private _useTime:number = 0;
    private readonly _allOffset:number = 15;
    private readonly scale:number = 1;
    private _startTime:number;
    private con:Laya.Sprite;
    private ctl:FontClipCtl;
    private offsetY:number = 0;
    private end:Laya.Point;
    private offsetPos:Laya.Point;
    /**偏移值 */
    private get dev():number{
        return this._allOffset / (this._useTime / Laya.timer.delta);
    }
    constructor(){
    }
    private onStartPlay(){
        
        this._startTime = Laya.timer.currTimer;
        let con = new Laya.Sprite();
        this.con = con;
        //===================
        let _monster = this.target;
        if(_monster.coreSpine && _monster.coreSpine.skeleton){
            this.end = (_monster.parent as Laya.Sprite).localToGlobal(new Laya.Point(_monster.coreSpine.skeleton.x, _monster.coreSpine.skeleton.y));
            this.offsetPos = (this.subCon.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.subCon.x, this.subCon.y));

            Laya.timer.frameLoop(1,this,this.onLoop);
            let prefix:string;//伤害
            let pre = "";
            let last = "";
            // this.vo.type = 3;//test
            switch(this.vo.type){
                case ESubBloodType.PhysicsHurt:
                    prefix = "sh_";
                    break;
                case ESubBloodType.MagicHurt:
                    prefix = "mf_";
                    break;
                case ESubBloodType.RealHurt:
                    prefix = "zs_";
                    break;
                case ESubBloodType.CriticalStrike:
                    pre = "a";
                    last = "b";
                    prefix = "bj_";
                    break;
            }
            // prefix = "sh_";//等后端改类型
            let ctl:FontClipCtl = new FontClipCtl(`remote/fight/${prefix}`);
            ctl.mScale = this.scale;
            ctl.setValue(con, `${pre}${this.vo.value.toString()}${last}`, "middle");
            this.ctl = ctl;
        }else{
            this.onRemove();
        }
    }

    play(){
        this._useTime = this.baseUseTime / FightValueConfig.speedScale;
        //this.dev = this._allOffset / (this._useTime / Laya.timer.delta);
        Laya.timer.once(this.delayTime,this,this.onStartPlay);
    }

    private onLoop(){
        let _monster = this.target;
        if(_monster.isDestory || Laya.timer.currTimer - this._startTime >= this._useTime){
            Laya.timer.clear(this,this.onLoop);
            this.onRemove();
        }else{
            if(_monster.parent){
               
                if(!this.con.parent){
                    this.subCon.addChild(this.con);
                }
                this.con.x = this.end.x - this.offsetPos.x;
                this.con.y = this.end.y - this.offsetPos.y + FightValueConfig.SubBloodY + this.offsetY;
                this.offsetY -= this.dev;//向上偏移

                // LogSys.Log(`dev:${this.dev},delta:${Laya.timer.delta}`);

                // LogSys.Log(this._useTime / Laya.timer.delta);
                // LogSys.Log("offsetY:"+this.offsetY);
            }
        }
    }

    private onRemove(){
        Laya.timer.clear(this,this.onStartPlay);
        if(!this.target.isDestory){
            let index:number = this.target.bloodFlys.indexOf(this);
            if(index!=-1){
                this.target.bloodFlys.splice(index,1);
            }
        }
        this.delayTime = 0;
        if(this.ctl){
            this.ctl.dispose();
        }
        this.con.removeSelf();
    }
}