import { stElement, stFuncCardEffect, stMonsterBirth } from "../../../../network/protocols/BaseProto";
import { ETemplateCardId } from "../../guide/t_FightGuideConfig";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { EComposeUpdateType } from "./EComposeUpdateType";
import { ICardEffectVo } from "./ICardEffectVo";
import { t_Battle_Effect } from "./t_Battle_Effect";

export enum EFightLayer {
    /**血条层 */
    BLOOD = 1,
    /**怪物受击特效层 */
    HitMonsterLayer = 2,
    /**光圈层级 */
    HaloLayer = 3,
    /**技能条层级 */
    SkillBarLayer = 4,
    /**地板层 */
    Ground = 5,
    /**弹道层 */
    ShootLayer = 6,
}
/**角色层级 */
export enum EAvatarLayar {
    Bottom = 0,
    Top = 1,
    TopCenter = 2,
}
export interface IBaseAvatarCheckTarget {
    type: EEffectTarget;
    /**英雄或者怪物uid */
    uid: number;
}
export interface IPlayOnceAvatar extends IBaseAvatarCheckTarget {
    url: string;
    layer: EAvatarLayar;
    offsetY: number;
}
export class CardUiEffectVo implements ICardEffectVo {
    url: string;
    cardSerialNum: number;
    status: EEffectStatus;
    cardId: number;
    reset() {
        this.status = EEffectStatus.Close;
    }

    /**卡牌倍率 */
    get priceDouble() {
        // let cfg = t_Function_Card.Ins.getCfgById(this.cardId);
        let cfg = this.cfg;
        if (cfg.f_card__templateid == ETemplateCardId.DoublePriceCard) {
            return Math.floor(parseInt(cfg.f_card_effect.split("|")[2]) / 10000);
        }
    }

    get cfg() {
        return t_Function_Card.Ins.getCfgById(this.cardId);
    }
    private get model() {
        return ComposeModel.Ins;
    }
    update(cell: stFuncCardEffect) {
        this.cardId = cell.cardId;
        let cfg = this.cfg;
        this.cardSerialNum = cell.serialNum;
        this.status = EEffectStatus.Open;
        let effcetCfg: Configs.t_Battle_Effect_dat = t_Battle_Effect.Ins.getByEffectId(cfg.f_effect_id);
        this.url = `${effcetCfg.f_spine_path}/${effcetCfg.f_effect_name}/${effcetCfg.f_effect_name}`;
        this.model.event(ComposeEvent.CardUiEffectAdd);
    }
}

export enum EFightSceneStatus {
    /**重连模式 */
    ReConnect = 1,//"ReConnect",
    /**旧的PVP引导模式 */
    PVP_Fight_Guide = 2,
    /**PVE引导模式 */
    PVE_Guide = 3,
    /**新pvp引导模式 */
    PVP_Fight_New_Guide = 4,//"PVP_Fight_New_Guide",

    EnterBattle = 5
}

// export class FightSource{
//     /**源 */
//     source:EFightSceneStatus;
//     constructor(){
//         // this.source = _source;
//     }
// }

export enum EEffectTarget {
    /**怪物 */
    Monster = 1,
    /**英雄 */
    Hero = 2,
    /**棋盘单个格子 */
    Grid = 3,
    /**卡牌 */
    Card = 4,
    /** 召唤/祈愿按钮*/
    SommonBtn = 5,
    /**阵营类型 */
    CampTarget = 6,
}
export enum EEffectStatus {
    Open = 1,
    Close = 0
}
export enum EEffectLoop {
    Once = 0,
    Loop = 1,
}

export interface IIceMapData {
    status: boolean;
    playerId: number;
    cardUid: number;
}

export interface IDelEffectCardUid {
    playerId: number;
    cardSerialNum: number;
}

export enum EEffectButtonType {
    /**召唤按钮 */
    Sommon = 1,
    /**祈愿按钮 */
    Supplication = 2,
    /**增益效果卡牌按钮 */
    // Gain = 3,
}

export enum EFightUIColor {
    Red = "#FF5C5C",
    Green = "#28E555",
    White = "#FFFFFF"
}

export interface IDelHeroUpdate {
    uid: number;
    type: EComposeUpdateType;
    cardId: number;
    delayTime: number;
    x: number;
    y: number;
}
/**更新英雄 */
export interface IUpdateHero {
    delList: IDelHeroUpdate[];
    type: EComposeUpdateType;
    cardId: number;
    cardSerialNum: number;
    vo: stElement;
    // time:number;
}
/**新增英雄 */
export interface IAddHero {
    /**是否是初始化 */
    isInit: boolean;
    delList: IDelHeroUpdate[];
    /**操作类型 */
    type: EComposeUpdateType;
    cardId: number;
    cardSerialNum: number;
    heroList: stElement[];
}
export class IceCardStatusVo {
    cardSerialNum: number;
    /**是否冰冻住卡牌 */
    bCardIce: boolean;
    playerId: number;

    reset() {
        this.bCardIce = false;
    }
}
export class LoopMonsterCreateVo {
    /**当前局部时钟(毫秒)*/
    clienttime: number;
    /**怪物列表 */
    monsterList: stMonsterBirth[];

}
/**怪物出生信息 */
export class ClientMonsterBirthVo {
    /**流水号id */
    uid: number;
    /**出生时间(毫秒) 引导时钟 */
    birthTime: number;
    /**当前血量 */
    curBlood: number = 0;
    /**最近停止的时间戳 */
    // stopTimeMs:number;
}

export class newStMonsterBirth extends stMonsterBirth {
    /**出身时间 */
    birthTime: number;

    /**缩放比例 */
    scale:number;
}

export enum ECreateHero {
    HeroId = 1,//英雄id
    ImageId = 2,//imageid
}

export enum EHeroClone {
    /**是分身 */
    IsClone = 1,
    /**不是分身 */
    None = 0,
}

/**战斗模式 */
export enum EFightMode {
    /**竞赛模式 */
    PVP = 1,
    /**合作模式 */
    PVE = 2,
    /** PVP回合制 */
    PVP_Round = 3,
    /**困难模式PVE */
    HARDPVE = 4,
    /**新春活动 */
    NewYear = 5
}