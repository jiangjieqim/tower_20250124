import { ItemVo } from "../vos/ItemVo";

export interface IAttrItem {
    id: number;
    value: number;
}

export interface ISpecialAttrItem {
    id: number;
    value: number;
    addValue?: number;
    title?: string;
}

export interface INextLevelData {
    // 满级满阶
    isNextFinish: boolean;
    // 距离升阶还有多少级
    restLevel: number;
    // 下一级
    nextLevel: number;
    // 下一级对应的阶数
    nextLevelStage: number;
    // 下一阶
    nextStage: number;
    // 下一阶的等级数
    nextStageLevel: number;
}

// export interface INextStageData {
//     restLevel: number;
//     nextLevel: number;
//     nextLevelStage: number;
// }

export interface ILevelListItem {
    stage: number;
    maxLevel: number;
}

/**
 * 翅膀升级属性UI接口
 */
export interface IWingUpgradeAttrSkin {
    // 属性名称Label
    tf1: Laya.Label;
    // 当前属性值Label
    valTf1: Laya.Label;
    // 箭头
    upimg: Laya.Image;
    // 下一级属性值Label
    valTf2: Laya.Label;
    dataSource;
    visible?:boolean;
}

export interface IWingSpecialAttrSkin {
    // 属性名称Label
    tf1: Laya.Label;
    // 当前属性值Label
    valTf: Laya.Label;
    dataSource;
    visible?:boolean;
}

export interface IWingUpgradeAttrListItem {
    // 属性id
    id: number;
    // 当前属性值
    now: number;
    // 下一级属性值
    next: number;
}

export interface IWingListItem {
    wingId: number;
    locked?: boolean;
    selected?: boolean;
    weared?: boolean;
    priceItemVo?: ItemVo;
}

export interface IWing {
    wingId: number;
    wingName: string;
    priceItemVo: ItemVo;
}

export interface IWingTreasureAttrItem {
    id: number;
    value: number;
    level: number;
}

export interface IWingData {
    wingId: number;
    stage: number;
    level: number;
    treasureStage: number;
    isOwner: boolean;
    wingName?: string;
    wingFightCapacity?: number;
    wingTreasureFightCapacity?: number;
}