import { FuncardDanMu_revc } from "../../../../network/protocols/BaseProto";
import { QualitycolorProxy } from "../../common/CommonProxy";
import { EFunccardEffectId, ETemplateCardId } from "../../guide/t_FightGuideConfig";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel, IEffectAnimVo } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { StealEffectVo } from "../views/StealEffect";
import { t_Battle_Effect } from "./t_Battle_Effect";

/**弹幕消息结构体 */
export class CardMsgVo{
    
    /**是否是客户端的弹幕 */
    client:boolean = false;
    /**是否点击消失 */
    // bClickHide:boolean;

    /**消失的时间戳ms */
    hideTime:number;

    cardId:number;
    playerId:number;
    private _cfg:Configs.t_Function_Card_dat;
    private datalist:number[];
    private _effectCfg:Configs.t_Battle_Effect_dat;
    protected model:ComposeModel;
    protected playerName1:string;
    protected playerName2:string;
    headUrl:string;
    /**是否可显示 */
    get isShow(){
        return !StringUtil.IsNullOrEmpty(this.cfg.f_card_broadcast);
    }
    constructor(){
        this.model = ComposeModel.Ins;
    }

    init(revc:FuncardDanMu_revc){    
        this.cardId = revc.cardId;
        this.datalist = revc.datalist;
        this.playerId = revc.playerId;
    }

    play(){
        let _effectCfg = t_Battle_Effect.Ins.getByEffectId(this.cfg.f_effect_id);
        if(_effectCfg){
            if(this.cfg.f_card__templateid == ETemplateCardId.StealMoney){
                if(_effectCfg.f_effect_id == EFunccardEffectId.StealMoney){
                    let vo = new StealEffectVo();
                    if(this.playerId == this.model.ownerPlayer.playerId){
                        vo.type = 1
                    }else{
                        vo.type = 0;
                    }
                    let k = _effectCfg.f_effect_name;
                    vo.url = `${_effectCfg.f_spine_path}/${k}/${k}.skel`;
                    this.model.event(ComposeEvent.PlayStealEffect,vo);
                }
            }
            else if(this.cfg.f_card__templateid != ETemplateCardId.GetMoney && _effectCfg.f_effect_id == EFunccardEffectId.MoneyShow){
                let o:IEffectAnimVo = this.model.getTargetLayerXY(_effectCfg.f_target, this.playerId);
                if(o){
                    let layer = o.layer;
                    let curX: number = o.curX;
                    let curY: number = o.curY;
                    FightFactory.createGetMoney(this.cardId,_effectCfg.f_effect_id,layer,curX,curY);
                }
            }
        }
    }

    get cfg():Configs.t_Function_Card_dat{
        if(!this._cfg){
            this._cfg = t_Function_Card.Ins.getCfgById(this.cardId);
        }
        return this._cfg;
    }
    protected updateData(){
        let playerName1:string = "";
        let playerName2:string = "";
        if(this.model.ownerPlayer){
            if(this.playerId == this.model.ownerPlayer.playerId){
                playerName1 = this.model.ownerPlayer.nickName;
                playerName2 = this.model.enemyPlayer.nickName;
                this.headUrl = this.model.ownerPlayer.headUrl;
            }else{
                playerName1 = this.model.enemyPlayer.nickName;
                playerName2 = this.model.ownerPlayer.nickName;
                this.headUrl = this.model.enemyPlayer.headUrl;
            }
        }
        this.playerName1 = playerName1;
        this.playerName2 = playerName2;
    }
    get desc(){
        this.updateData();
        //13---->  {-1}窃取成功，从{-2}那获得布币x{1}！
        let tempCardId:number = this.cfg.f_card__templateid;
        let _str = this.cfg.f_card_broadcast;
       
        // atlasUrl = atlasUrl.replace(/\\/g,"/");
        _str = _str.replace('{-1}',this.playerName1);
        _str = _str.replace('{-2}',this.playerName2);
        for(let i = 0;i < this.datalist.length;i++){
            //f_card__templateid
            let val:number = this.datalist[i];
            let s1:string = val + "";

            if(tempCardId == ETemplateCardId.BreakMyHero && i + 1 == 2){
                // 卡牌模板id 30 第二个参数，万分比
                // 想要得到就必须先失去，{-1}献祭{1}个英雄换取了{2}的英雄伤害加成！
                s1 = Math.floor(val/100) + "%";
            }
            else if(tempCardId == ETemplateCardId.RandomKill){
                // 卡牌模板id 35 品质 涅槃
                s1 = QualitycolorProxy.Ins.getCfgByQua(val).f_name;
            }
            else if(tempCardId == ETemplateCardId.SwitchMyHero){
                // {-1}使用【移形换影】，使用{1}交换了对方的{2}。
                s1 = HeroListProxy.Ins.getCfgById(val).f_hero;
            }
            _str = _str.replace(`{${(i+1)}}`,s1);
        }
        if(debug && this.client){
            _str = "客户端:"+_str;
        }
        return _str;
    }

    get isSelf(){
        return this.model.ownerPlayer.playerId == this.playerId;
    }
}