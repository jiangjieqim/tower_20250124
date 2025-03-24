import { E } from "../../../../G";
import { stFCardInner } from "../../../../network/protocols/BaseProto";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { ComposeModel } from "../ComposeModel";
/**局内卡牌数据结构 */
export class FuncCardVo{
    sortNum:number = 0;
    /**解锁的时间戳(毫秒) */
    cdTime:number = 0;
    data:stFCardInner;
    // uid:number;
    // cardId:number;
    private _cfg:Configs.t_Function_Card_dat;
    // private _needItemVo:ItemVo;
    constructor(){
        this.sortNum = Number.MAX_VALUE;
    }

    get cfg():Configs.t_Function_Card_dat{
        if(!this._cfg){
            this._cfg = t_Function_Card.Ins.getCfgById(this.data.fCardId);            
        }
        if(!this._cfg){
            E.debugMsgBox(`没有卡牌配置fCardId:${this.data.fCardId}`);
            this._cfg = t_Function_Card.Ins.getCfgById(1);
        }
        return this._cfg;
    }

    get needItemVo(){
        let cfg = this.cfg;
        
        
        
        // if(!this._needItemVo){
        //     this._needItemVo = ItemViewFactory.convertItem(cfg.f_card_price);
        // }
        // return this._needItemVo;

        // 6-30
        let arr:string[] = cfg.f_card_price.split("-");
        let needCount:number = parseInt(arr[1]) * ComposeModel.Ins.gainVo.priceDoubles;
        return ItemViewFactory.convertItem(`${arr[0]}-${needCount}`);
    }


    playSound(){
        // E.AudioMgr.PlaySound1(`4001.mp3`);
        if(this.cfg.f_card_sound){
            E.AudioMgr.PlaySound1(`${this.cfg.f_card_sound}.mp3`);
        }
    }
}
export class CardMoveVo{
    /**移动 -1左移动 1右移动 */
    x:number;

    /**流水号 */
    uid:number;
}

export interface IPlayPieResult{
    /**正在使用的卡牌流水号id */
    serialNum:number;
}

export enum EFuncCardUsed{
    /**未使用 */
    NotUsed = 0,
    /**已经使用 */
    Used = 1,
    /**无效使用 */
    UsedDisable = 2,
    /**丢弃卡牌 */
    Discard = 3,
    /* 4消失（pve卡槽满了*/
    PVE_Destory = 4,
}