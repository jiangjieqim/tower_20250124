// 卡牌：品质4及4以上（品质按t_Function_Card的f_qua，排序按f_rank从大大小）
// 灵宝：品质3及3以上（品质按t_Treasure的f_qua，排序按f_rank从大到小）
// 英雄：品质5（品质按t_Hero的f_qua，排序按f_rank从大到小）
// 皮肤：除了原始皮肤外的所有皮肤，排序按f_rank从大到小

import { ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { E } from "../../../../G";
import { stCareer, stFCard, stHero, stTreasure, WatchCommonRankDetail_revc } from "../../../../network/protocols/BaseProto";
import { t_Competition_Season } from "../../activity/zhanlin/t_Competition_Season";
import { EHeroQua } from "../../compose/t_Battle_Config";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { MainModel } from "../../main/model/MainModel";
import { TowertMainCardModel } from "../../towertmaincard/model/TowertMainCardModel";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { t_Hero_Skin } from "../../towertmainhero/proxy/t_Hero_Skin";
import { TowertMainLinbaoModel } from "../../towertmainlinbao/model/TowertMainLinbaoModel";
import { t_Treasure } from "../../towertmainlinbao/proxy/t_Treasure";
import { RoleInfoModel } from "../model/RoleInfoModel";
import { EPlayerInfoMode, ERankType, PlayerInfoCellVo } from "./PlayerInfoCellVo";
import { CardSkinNode, ERolePlayerInfo, PlayerHeroSkinNode, PlayerInfoHeroCellNode, TreasureSkinNode } from "./PlayerInfoHeroCell";
import { PlayerItemInfoNode } from "./PlayerItemInfo";

export class PlayerInfoFactory {

    /**英雄排序 
     * 
     * 
1、只展示6个英雄的形象
2、展示哪6个：
a.等级越高越靠前展示
b.等级一样，f_rank这个字段的值越大越靠前
     * 
    */
    private static sortHero(a: stHero, b: stHero) {
        let a1 = HeroListProxy.Ins.getCfgById(a.id);
        let b1 = HeroListProxy.Ins.getCfgById(b.id);

        if (a1.f_qua < b1.f_qua) {
            return 1;
        } else if (a1.f_qua > b1.f_qua) {
            return -1;
        }else{
            if(a.level < b.level){
                return 1;
            } else if(a.level > b.level){
                return -1;
            }else{
                if (a1.f_rank < b1.f_rank) {
                    return 1;
                } else if (a1.f_rank > b1.f_rank) {
                    return -1;
                }
            }            
        }
    }

    private static sortCard(a:stFCard,b:stFCard){
        let a1 = t_Function_Card.Ins.getCfgById(a.id);
        let b1 = t_Function_Card.Ins.getCfgById(b.id);
        if(a1.f_rank < b1.f_rank){
            return 1;
        }else if(a1.f_rank > b1.f_rank){
            return -1;
        }
        return 0;
    }
    /**灵宝排序 */
    private static sortLingBao(a:stTreasure,b:stTreasure){
        let a1:Configs.t_Treasure_dat = t_Treasure.Ins.getCfgById(a.id);
        let b1:Configs.t_Treasure_dat = t_Treasure.Ins.getCfgById(b.id);
        
        if (a1.f_qua < b1.f_qua) {
            return 1;
        } else if (a1.f_qua > b1.f_qua) {
            return -1;
        }else{
            if(a.level < b.level){
                return 1;
            } else if(a.level > b.level){
                return -1;
            }else{
                if (a1.f_rank < b1.f_rank) {
                    return 1;
                } else if (a1.f_rank > b1.f_rank) {
                    return -1;
                }
            }            
        }
    }

    private static sortSkins(a:number,b:number){
        let a1 = t_Hero_Skin.Ins.getCfgById(a);
        let b1 = t_Hero_Skin.Ins.getCfgById(b);
        if(a1.f_rank < b1.f_rank){
            return 1;
        }else if(a1.f_rank > b1.f_rank){
            return -1;
        }
        return 0;
    }

    private static isSelf(playerId:number){
        return playerId == MainModel.Ins.mRoleData.AccountId;
    }
    // private static filter(l: any[], type: ERolePlayerInfo) {
    //     let nl: any[] = [];
    //     switch (type) {
    //         case ERolePlayerInfo.Hero:
    //             {
                   
    //             }
    //             break;
    //         case ERolePlayerInfo.Card:
    //             {
                  
    //             }
    //             break;
    //         case ERolePlayerInfo.LingBao:
    //             {
    //                 // // 灵宝只展示品质3和4的
    //                 // for (let i = 0; i < l.length; i++) {
    //                 //     let o: stTreasure = l[i];
    //                 //     let cfg:Configs.t_Treasure_dat = t_Treasure.Ins.getCfgById(o.id);
    //                 //     if (cfg.f_qua >= 3) {
    //                 //         nl.push(o);
    //                 //     }
    //                 // }
    //             }
    //             break;

    //         case ERolePlayerInfo.Skin:
    //             {
    //                 for (let i = 0; i < l.length; i++) {
    //                     let o: number = l[i];
    //                     let cfg = t_Hero_Skin.Ins.getCfgById(o);
    //                     if (cfg.f_rank) {
    //                         nl.push(o);
    //                     }
    //                 }
    //             }
    //             break;
    //     }
    //     return nl;
    // }
    static renderList(panel: ScrollPanelControl, countLb: Laya.Label,
        tips1:Laya.Image,tipsLb:Laya.Label,
        type: ERolePlayerInfo, revc:WatchCommonRankDetail_revc) 
    {
        let playerId:number = revc.playerData.AccountId;
        let listData: any[] = [];
        // let clsName = this.getSkin(type);
        let cls;
        // let h: number;
        let maxRow: number;
        let _maxCount:number;//最大数量
        let _curCount:number = 0;//当前的英雄数量
        switch (type) {
            case ERolePlayerInfo.Hero:
                {
                    let heros: stHero[] = [];
                    if (this.isSelf(playerId)) {
                        heros = TowertMainHeroModel.Ins.getHeroList();
                    } else {
                        //..
                        heros = revc.heros;
                    }
                    // heros = this.filter(heros, type);
                    //=============================================
                    // 英雄只展示神话（品质5）
                    let nl: stHero[] = [];
                    for (let i = 0; i < heros.length; i++) {
                        let o: stHero = heros[i];
                        let cfg = HeroListProxy.Ins.getCfgById(o.id);
                        if (cfg.f_qua == EHeroQua.Red && !cfg.f_if_transform) {
                            nl.push(o);
                        }
                    }
                    heros = nl;
                    //=============================================
                    _curCount = TowertMainHeroModel.Ins.heroList.length;// heros.length;
                    
                    heros = heros.sort(this.sortHero);

                    let limit: number = parseInt(System_RefreshTimeProxy.Ins.getVal(115));
                    while (heros.length > limit) {
                        heros.pop();
                    }
                    listData = heros;
                    cls = PlayerInfoHeroCellNode;
                    maxRow = 3;
                    _maxCount = HeroListProxy.Ins.maxWatchHeroCount;
                    // TowertMainHeroModel.Ins.getHeroList().length;
                    break;
                }

            case ERolePlayerInfo.Skin:
                {
                    let skins: number[] = [];
                    if (this.isSelf(playerId)) {
                        skins = TowertMainHeroModel.Ins.getHeroSkins();
                    } else {
                        skins = revc.heroSkins;
                    }
                    // skins = this.filter(skins, type);
                    _curCount = skins.length;
                    skins = skins.sort(this.sortSkins);
                    listData = skins;
                    cls = PlayerHeroSkinNode;
                    maxRow = 3;
                    _maxCount = HeroListProxy.Ins.maxWacthSkinCount;
                    break;
                }
            case ERolePlayerInfo.Card:
                {
                    let _cards: stFCard[] = [];
                    _maxCount = t_Function_Card.Ins.getList().length;
                    if (this.isSelf(playerId)) {
                        _cards = TowertMainCardModel.Ins.cardList;
                    } else {
                        //...
                        _cards = revc.cards;
                    }
                    // _cards = this.filter(_cards,type);

                    //=============================================
                    let nl = [];
                    // 卡牌只展示品质4的
                    for (let i = 0; i < _cards.length; i++) {
                        let o: stFCard = _cards[i];
                        let cfg = t_Function_Card.Ins.getCfgById(o.id);
                        if (cfg.f_qua >= 4) {
                            nl.push(o);
                        }
                    }
                    _cards = nl;
                    //============================================
                    _curCount = TowertMainCardModel.Ins.cardList.length;//_cards.length;
                    _cards = _cards.sort(this.sortCard);
                    listData = _cards;
                    cls = CardSkinNode;
                    maxRow = 4;
                    break;
                }
            case ERolePlayerInfo.LingBao:
                {
                    let _treasures: stTreasure[] = [];
                    _maxCount = t_Treasure.Ins.List.length;
                    if (this.isSelf(playerId)) {
                        _treasures = TowertMainLinbaoModel.Ins.linbaoList;
                    } else {
                        _treasures = revc.treasures;
                    }
                    // _treasures = this.filter(_treasures, type);
                    _curCount = _treasures.length;//_treasures.length;
                    //===============================================
                    // 灵宝只展示品质3和4的
                    let nl = [];
                    for (let i = 0; i < _treasures.length; i++) {
                        let o: stTreasure = _treasures[i];
                        let cfg: Configs.t_Treasure_dat = t_Treasure.Ins.getCfgById(o.id);
                        if (cfg.f_qua >= 3) {
                            nl.push(o);
                        }
                    }
                    _treasures = nl;
                    //===============================================
                    let limit: number = parseInt(System_RefreshTimeProxy.Ins.getVal(119));

                    _treasures = _treasures.sort(this.sortLingBao);
                    while (_treasures.length > limit) {
                        _treasures.pop();
                    }
                    listData = _treasures;
                    cls = TreasureSkinNode;
                    maxRow = 4;
                    break;
                }
        }
        //=====================================================
        let _showTips:boolean = true;
        if (cls) {
            if(listData.length <= 0){
                //列表中无数据
            }else{
                _showTips = false;
            }
            panel.split(listData, cls, undefined, undefined, maxRow);
            countLb.text = `${_curCount}/${_maxCount}`;
        }
        let lb = E.getLang("infotabs").split("|")[type];
        tipsLb.text = E.getLang("playerInfoTips",lb);
        tips1.visible = _showTips;
        //=====================================================
    }
    static careerUpdate(panel: ScrollPanelControl, revc:WatchCommonRankDetail_revc) {
        let playerId:number = revc.playerData.AccountId;
        let vo0 = new PlayerInfoCellVo(ERankType.PVE);
        let vo1 = new PlayerInfoCellVo(ERankType.PVP_ROUND);
        let normal:stCareer[] = [];
        let hard:stCareer[] = [];
        let life:stCareer[] = [];
        let season:number;//当前的赛季id
        if(this.isSelf(playerId)){
            normal = RoleInfoModel.Ins.pveList || [];
            hard = RoleInfoModel.Ins.pveHardList || [];
            life = RoleInfoModel.Ins.careerList || [];
            season = MainModel.Ins.season;
        } else {
            normal = revc.careerPve;
            hard = revc.careerPveHard;
            life = revc.career;
            season = revc.season;
        }
        //===============================================================
        //突围战
        vo0.addData(normal, EPlayerInfoMode.Normal);
        vo0.addData(hard, EPlayerInfoMode.Hard);

        //========================== 排位赛
        //当前赛季
        let cur = vo1.addData(life, EPlayerInfoMode.CurLife);
        if(cur){
            let cfg = t_Competition_Season.Ins.getCfgBySeason(season||1);
            cur.sessonName = cfg.f_season_name;
        }
        //===============================================================
        panel.split([vo0], PlayerItemInfoNode, vo0.cellHeight);
        panel.split([vo1], PlayerItemInfoNode, vo1.cellHeight);
    }
}