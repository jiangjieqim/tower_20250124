import { E } from "../../../../G";
import { stElement } from "../../../../network/protocols/BaseProto";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { EInnerSoundType, t_Inner_Sound } from "../t_Inner_Sound";
import { EComposeUpdateType } from "../vos/EComposeUpdateType";
import { IDelHeroUpdate } from "../vos/EFightEnum";
import { ITrailDecorator } from "./TrailDecorator";

/**
 * 音效装饰器
 */
export class TrailSoundDecorator implements ITrailDecorator 
{
    private _target: ITrailDecorator;
    constructor(target: ITrailDecorator) {
        this._target = target;
    }

    play(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[],isInit:boolean) {
        this._target.play(o,type,delList,isInit);
        if(type ==  EComposeUpdateType.Summon){
            t_Inner_Sound.Ins.play(EInnerSoundType.SommonHero);
        }
        let cfg:Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(o.fid);
        if(!isInit && cfg && cfg.f_sound > 0){
            E.AudioMgr.PlaySound1(`${cfg.f_sound}.mp3`);
        }
    }
    convert(o: stElement, type: EComposeUpdateType, delList: IDelHeroUpdate[]) {
        this._target.convert(o,type,delList);
    }
    startPlay() {
        this._target.startPlay();
    }
    setXY(x: number, y: number): void {
        this._target.setXY(x,y);
    }
}