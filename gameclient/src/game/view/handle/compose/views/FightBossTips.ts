// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { SommonBoss_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemVo } from "../../main/vos/ItemVo";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { EBattle_Config, t_Battle_Config } from "../t_Battle_Config";
import { t_Monster_Template } from "../t_Monster_Template";
import { ITowerMonster } from "./ITowerMonster";
/**Boss的tips */
export class FightBossTips extends ViewBase{
    protected mMask:boolean = true;
    protected maskAlpha = 0.0;

    private model:ComposeModel;
    private _ui:ui.views.compose.ui_fight_boss_tipsUI;
    private okBtn:ButtonCtl;
    private monster:ITowerMonster;
    protected autoFree:boolean = true;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        if(this.monster){
            this.monster.dispose();
            this.monster = null;
        }
        if(this.okBtn){
            this.okBtn.dispose();
            this.okBtn = null;
        }
        // Laya.Loader.clearTextureRes(this._ui.bg.skin);
        // Laya.Loader.clearTextureRes(this._ui.bg1.skin);
        // Laya.Loader.clearTextureRes(this._ui.bg2.skin);
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_fight_boss_tipsUI();
            this._ui.titileTf.text = E.getLang("fightboss");
            this.bindClose(this._ui.close1);
            this.okBtn = ButtonCtl.CreateBtn(this._ui.okBtn, this, this.onOkHandler);
        }
    }

    private onOkHandler() {
        let req: SommonBoss_req = new SommonBoss_req();
        SocketMgr.Ins.SendMessageBin(req);
        this.Close();
    }

    protected onInit(): void {
        // throw new Error("Method not implemented.");
        let _monsterId = this.model.bossMonsterId;
        if(!_monsterId){
            _monsterId = 1;
        }
        //================================================================
        this.monster = FightFactory.createFrameMonster(_monsterId,this,this.onLoadComplete);
        //================================================================

        this._ui.timeTf.text = TimeUtil.subTimeHMS_EN(parseInt(t_Battle_Config.Ins.getValueById(EBattle_Config.KILLBOSS_MAX_TIME)));
        
        let cfg: Configs.t_Monster_dat = this.model.getMonsterCfg(_monsterId);
        
        let tempCfg: Configs.t_Monster_Template_dat = t_Monster_Template.Ins.getMonsterTemplate(cfg.f_monster_template_id);
        this._ui.nameTf.text = tempCfg.f_monster_name;
        this._ui.descTf.text = tempCfg.f_des;
        let _rewardVo: ItemVo = ItemViewFactory.convertItem(cfg.f_kill_reward);
        this._ui.stoneTf.text = _rewardVo.count + "";
        this._ui.icon.skin = _rewardVo.getIcon();
        this._ui.lvTf.text = `${E.getLang("LV")}${cfg.f_limitboss_sort.split("|")[1]}`;
    }
    private onLoadComplete() {
        this._ui.avatarCon.addChild(this.monster.skeleton);
    }
}