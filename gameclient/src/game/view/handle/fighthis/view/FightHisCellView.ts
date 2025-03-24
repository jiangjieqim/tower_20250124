// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { RowMoveBaseNode } from "../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { FightUIFactory, ITrophyLabel } from "../../compose/FightUIFactory";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../../rank/model/RankModel";
import { FightReportVo } from "../vos/FightReportVo";
/**道具item */
class HeroSmallIcon extends ui.views.fighthis.ui_fight_his_heroiconUI {
    static CLS_KEY: string = "HeroSmallIcon";
    constructor() {
        super();
    }
    public setData(heroStr: string) {
        let heroId: number = parseInt(heroStr);
        if(!isNaN(heroId)){
            FightUIFactory.setDefaultHeroIcon(this,heroId);
        }
    }
}
class FightHisCellSkin extends ui.views.fighthis.ui_fight_his_cell_viewUI {
    private vo: FightReportVo;
    constructor() {
        super();
    }

    refresh(vo: FightReportVo) {

        this.vo = vo;
        this.height = vo.cellHeight;
        DebugUtil.draw(this);
        this.leftPlayer.nameTf.text = MainModel.Ins.mRoleData.NickName;
        this.leftPlayer.scroeTf.text = vo.data.trophy0 + "";
        FightUIFactory.toScore(this.leftPlayer.leftScoreTf, { trophy: vo.data.trophy, win: vo.data.win } as ITrophyLabel);
        FightUIFactory.setHerdIcon(this.leftPlayer.headicon, MainModel.Ins.mRoleData.headUrl);
        //=======================================================================
        this.rightPlayer.nameTf.text = vo.data.rivalNickName;
        this.rightPlayer.scroeTf.text = vo.data.enemyTrophy0+"";
        FightUIFactory.toScore(this.rightPlayer.leftScoreTf, { trophy: vo.data.enemyTrophy, win: vo.data.win == 1 ? 0 : 1 } as ITrophyLabel);
        FightUIFactory.setHerdIcon(this.rightPlayer.headicon, vo.data.rivalHeadUrl);
        this.rightPlayer.headicon.on(Laya.Event.CLICK,this,this.onWatchInfo,[vo.data.enemyId]);
        this.resultTf.text = vo.resultDesc;
        if (vo.data.win) {
            this.leftPlayer.bottomTitle.skin = `remote/fight_his/img_sl_d.png`;
            this.rightPlayer.bottomTitle.skin = `remote/fight_his/img_sl_d1.png`;
            this.titleImg.skin = `remote/fight_his/img_sl.png`;
        } else {
            this.rightPlayer.bottomTitle.skin = `remote/fight_his/img_sl_d.png`;
            this.leftPlayer.bottomTitle.skin = `remote/fight_his/img_sl_d1.png`;
            this.titleImg.skin = `remote/fight_his/img_shibai.png`;
        }

        if (vo.data.isFriend) {
            this.sp.visible = true;
        } else {
            this.sp.visible = false;
        }

        if(vo.data.mode == 1){
            this.fightTitle.skin = `remote/fight_his/img_jjs.png`;
        }else if(vo.data.mode == 2){
            this.fightTitle.skin = `remote/fight_his/img_hys.png`;
        }

        this.titleTf.text = E.getLang(`waveCount`, vo.data.wave);

        this.timeTf.text = TimeUtil.timestamtoTime2(vo.data.fightStartUnix);
        this.useTimeTf.text = E.getLang("fightreport01") + TimeUtil.subTimeHMS_EN(vo.data.duration);

        this.updateHero(this.leftCon,vo.selfHeros,this.leftNone);
        this.updateHero(this.righCon,vo.enemyHeros,this.rightNone);

        this.layout();
    }

    private onWatchInfo(playerId:number){
        RankModel.Ins.watchPlayer(playerId);
    }
    private layout(){
        let vo = this.vo;
        this.botContainer.y = vo.botY;
        this.bg.height = vo.cellHeight - this.bg.y;
        this.leftNone.y = this.rightNone.y = this.title2.y + (this.botContainer.y - this.title2.y)/2;
    }

    private updateHero(container:Laya.Sprite,heroids:number[],noneLb:Laya.Label){
        ItemViewFactory.renderItemSlots(container, heroids, undefined, 10, undefined, "left", HeroSmallIcon, this.vo.rowCount);
        if(heroids.length > 0){
            noneLb.visible = false;
        }else{
            noneLb.visible = true;
        }
    }
}

export class FightHisCellViewNode extends RowMoveBaseNode {
    protected clsKey: string = "FightHisCellSkin";
    protected createSkin() {
        return Laya.Pool.getItemByClass(this.clsKey, FightHisCellSkin);
    }
    protected createNode(index: any) {
        let _skin: FightHisCellSkin = this.createSkin();
        _skin.refresh(this.list[index]);
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}