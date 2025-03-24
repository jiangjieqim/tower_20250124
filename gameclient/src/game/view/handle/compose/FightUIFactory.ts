import { EViewType } from "../../../common/defines/EnumDefine";
import { stPlayerInRoom, stTask } from "../../../network/protocols/BaseProto";
import { IconUtils } from "../main/model/IconUtils";
import { ItemViewFactory } from "../main/model/ItemViewFactory";
import { MainModel } from "../main/model/MainModel";
import { TowertMainHeroModel } from "../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../towertmainhero/proxy/HeroProxy";
import { ComposeConfig } from "./ComposeConfig";
import { ComposeModel } from "./ComposeModel";
import { CardMoneyCtl } from "./views/cells/CardMoneyCtl";
import { FightTaskHeroCell } from "./views/cells/FightTaskHeroCell";
import { PreBannerView } from "./views/cells/PreBannerView";
import { EFightUIColor } from "./vos/EFightEnum";
import { FightValueConfig } from "./vos/FightValueConfig";
import { EBattleTaskStatus, EBattleTaskType, t_Battle_Task_Template } from "./vos/t_Battle_Task";
export interface IFightTaskCell extends Laya.View{
    moneyIcon:Laya.Image;
    // ht:Laya.HTMLDivElement;
    lb:Laya.Label;
    moneyTf:Laya.Label;
    rwMask2:Laya.Image;
    completeIcon:Laya.Image;

    // con1:Laya.Sprite;
    // rwMask1:Laya.Image;
}
export interface IPossessPlayerSkin{
    //  bottomImg:Laya.Image;
     headicon:Laya.Image;
     scroeTf:Laya.Label;
     nameTf:Laya.Label;
}

export interface IHeroHeadSkin{
    qua:Laya.Image;
    icon:Laya.Image;
}

export interface ITrophyLabel{
    trophy:number;
    win:number;
}

export class FightUIFactory{
    static bindHtml(ht:Laya.HTMLDivElement){
        ht.style.fontSize = 20;
        ht.style.family = "BOLD";
        ht.style.color = "#ffffff";
        // ht.style.leading = 10;
        ht.style.stroke = 2;
        ht.style.strokeColor = "#3A1C17";
        // this.skin.ht.style.valign = "center";
    }
    /**局内任务cell填充 */
    static setTask(_skin:IFightTaskCell,vo:stTask,rich:boolean = false){
        let model = ComposeModel.Ins;
        
        let battleTask = model.fightTypeAdaper.battleTask;
        if(!battleTask){
            return;
        }
        let cfg = battleTask.getByTaskId(vo.taskId);

        let color:string = "#00ff00";
        if (vo.state == EBattleTaskStatus.Complete) {
            // if(_skin["rwMask1"]) _skin["rwMask1"].visible = true;
            _skin.rwMask2.visible = _skin.completeIcon.visible = true;
        } else {
            color = "#ff0000";
            // if(_skin["rwMask1"]) _skin["rwMask1"].visible = false;
            _skin.rwMask2.visible = _skin.completeIcon.visible = false;
        }

        let taskAmount:string[] = cfg.f_task_amount.split("|");
    
        let str = "";
        if(cfg.f_task_type == EBattleTaskType.SerachHero){
            if(_skin["con1"]){
                let rl = model.convertTaskHeros(taskAmount);
                ItemViewFactory.renderItemSlots(_skin["con1"],rl,false,20,1,"left",FightTaskHeroCell);
            }
        }else{
            let pos:number = t_Battle_Task_Template.Ins.getCfgByType(cfg.f_task_type).f_pos;
            if(rich){
                str = `(<span color='${color}'>${vo.num}</span>/${taskAmount[pos]})`;
            }else{
                str = `${vo.num}/${taskAmount[pos]}`;
            }
        }

        _skin.lb.text = cfg.f_task_dsc + str;
        //======================================================
        // FightUIFactory.bindHtml(_skin.ht);
        // _skin.ht.innerHTML = cfg.f_task_dsc + str;
        // _skin.ht.width = _skin.width;
        //======================================================

        let arr = cfg.f_task_reward.split("-");
        _skin.moneyIcon.skin = IconUtils.getIconByCfgId(parseInt(arr[0]));
        _skin.moneyTf.text = arr[1];
    }

    /**设置用户信息 */
    static setPlayer(skin:IPossessPlayerSkin,vo:stPlayerInRoom){
        if(!vo) return;
        skin.nameTf.text = this.convertNickName(vo);
        // let url =  MainModel.Ins.convertHead(vo.headUrl);
        // MainModel.Ins.setTTHead(skin.headicon,url);
        this.setHerdIcon(skin.headicon,vo.headUrl);
        skin.scroeTf.text = vo.trophy + "";
    }
    
    /**设置头像 */
    static setHerdIcon(img:Laya.Image,headUrl:string){
        let url =  MainModel.Ins.convertHead(headUrl);
        MainModel.Ins.setTTHead(img,url);
    }

    static convertNickName(player: stPlayerInRoom) {
        if(player){
            return StringUtil.IsNullOrEmpty(player.nickName) ? player.playerId + "" : player.nickName;
        }
        return "";
    }

    static createCardMoney(tf:Laya.Label,container:Laya.Sprite,id:number,offsetX:number = 0,offsetY:number = 0){
        let cell = new CardMoneyCtl();
        cell.tf = tf;
        cell.container = container;
        cell.itemId = id;
        cell.offsetX = offsetX;
        cell.offsetY = offsetY;
        return cell;
    }

    static toScore(lb:Laya.Label,vo:ITrophyLabel){
        let str:string = "";
        let color:string = EFightUIColor.Green;//绿色
        if(vo.trophy == 0){
            str = vo.trophy.toString();
        }else{
            let sign:string = "";
            if (vo.win == 1) {
                sign = "+";
            }else{
                sign = "-"
                color = EFightUIColor.Red;//红色
            }
            str = `${sign}${vo.trophy}`;
        }
        lb.text = str;
        lb.color = color;
    }

    /**设置默认的英雄头像 */
    static setDefaultHeroIcon(skin:IHeroHeadSkin,heroId:number){
        let imageId: number = TowertMainHeroModel.Ins.getDefImageIdById(heroId);
        let _heroCfg = HeroListProxy.Ins.getCfgById(heroId);
        skin.qua.skin = HeroListProxy.Ins.getSmallQuaSkin(_heroCfg.f_qua);
        skin.icon.skin = HeroListProxy.Ins.getSmallIconSkin(imageId);
    }
    private static _spr:Laya.Sprite;
    /**增加一个DEBUG区块宽 */
    static createDebugGrid(topY:number,container:Laya.Sprite) {
        if (debug) {
            let ox = FightValueConfig.fightViewX;
            let oy = FightValueConfig.fightViewY;

            if(!this._spr){
                this._spr = new Laya.Sprite();
            }
            let showgrid: Laya.Sprite = this._spr;

            container.addChild(showgrid);
            showgrid.x = ox;//fightView.x;
            showgrid.y = oy;//fightView.y;
            
            showgrid.graphics.clear();

            let mapW = ComposeConfig.mapW;
            let mapH = ComposeConfig.mapH;
            let cellW = ComposeConfig.cellW;
            let cellH = ComposeConfig.cellH;

            for (let i = 0; i < mapH; i++) {
                for (let n = 0; n < mapW; n++) {
                    // this._ui.addChild(showgrid);
                    showgrid.graphics.drawRect(
                        (n + 1) * cellW, cellH * (mapH - i), 
                        cellW, cellH, 
                        null, "#ff00ff", 1);
                }
            }
            for (let i = 0; i < mapH; i++) {
                for (let n = 0; n < mapW; n++) {
                    showgrid.graphics.drawRect(
                        (n + 1) * cellW, cellH * (mapH - i) + topY, 
                        cellW, cellH, 
                        null, "#ff00ff", 1);
                }
            }
        }
    }

    /**创建一个预览栏 */
    static createPreBannerSkin(uiTypes:EViewType[],_cls,con:Laya.Sprite,ox:number = 0,oy:number = 0,bSwitchSkin:boolean = true,algin:string = "top"):PreBannerView{
        let preBanner = new PreBannerView();
        preBanner.uiTypes = uiTypes;
        preBanner.bSwitchSkin = bSwitchSkin;
        preBanner.algin = algin;
        preBanner.skin = new _cls();//new ui.views.compose.fightcell.ui_pre_bannerUI();
        // preBanner.skin.pos(10, FightValueConfig.TopOffsetY);
        preBanner.skin.pos(ox,oy);
        preBanner.init();
        // preBanner.onInit();
        con.addChild(preBanner.skin);
        return preBanner;
    }

}