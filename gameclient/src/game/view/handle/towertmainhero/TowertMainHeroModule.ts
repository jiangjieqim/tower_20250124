import { BaseModel } from "../../../../frame/util/ctl/BaseModel";
import { E } from "../../../G";
import { EViewType } from "../../../common/defines/EnumDefine";
import { HeroInit_revc, Hero_revc } from "../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../network/protocols/ProtoDef";
import { TowertMainHeroModel } from "./model/TowertMainHeroModel";
import { HeroHuanZhuangView } from "./view/HeroHuanZhuangView";
import { HeroSkinView } from "./view/HeroSkinView";
import { HeroTip } from "./view/HeroTip";
import { HeroTip1 } from "./view/HeroTip1";

export class TowertMainHeroModule extends BaseModel{
    private static _ins:TowertMainHeroModule;
    public static get Ins(){
        if(!this._ins){
            this._ins = new TowertMainHeroModule();
        }
        return this._ins;
    }

    public onInitCallBack():void{}

    public initMsg(){
        E.MsgMgr.AddMsg(SERVER_MSGID.HeroInit, this.HeroInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.Hero, this.Hero,this);

        this.Reg(new HeroTip(EViewType.HeroTip));
        this.Reg(new HeroTip1(EViewType.HeroTip1));
        this.Reg(new HeroHuanZhuangView(EViewType.HeroHuanZhuangView));
        this.Reg(new HeroSkinView(EViewType.HeroSkinView));
    }

    private HeroInit(value:HeroInit_revc){
        TowertMainHeroModel.Ins.heroList = value.heros;
    }

    private Hero(value:Hero_revc){
        if(value.type == 1){
            TowertMainHeroModel.Ins.heroList = TowertMainHeroModel.Ins.heroList.concat(value.heros);
        }else{
            for(let i:number=0;i<value.heros.length;i++){
                let index = TowertMainHeroModel.Ins.heroList.findIndex(ele=>ele.id == value.heros[i].id);
                if(index != -1){
                    TowertMainHeroModel.Ins.heroList[index] = value.heros[i];
                }
            }
            if(value.type == 0){
                TowertMainHeroModel.Ins.event(TowertMainHeroModel.UPDATE_UP);
            }
        }
        TowertMainHeroModel.Ins.event(TowertMainHeroModel.UPDATE_HERO);
    }
}