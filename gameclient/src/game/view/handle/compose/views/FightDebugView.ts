import { ColorUtil } from "../../../../../frame/util/ColorUtil";
// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ButtonSkin } from "../../../../../frame/view/DefaultButton";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { E } from "../../../../G";
import { stElement } from "../../../../network/protocols/BaseProto";
import { QualitycolorProxy } from "../../common/CommonProxy";
import { MainModel } from "../../main/model/MainModel";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeModel } from "../ComposeModel";
import { EResKey, FightFactory } from "../FightFactory";
import { EHeroQua } from "../t_Battle_Config";
import { EComposeUpdateType } from "../vos/EComposeUpdateType";
import { FightValueConfig } from "../vos/FightValueConfig";
import { FrameMonsterDebug } from "./debug/FrameMonsterDebug";
import { FrameMonster } from "./FrameAvatar";

export function wingm(s:string){
    window['gm'](s);
}

// 示例
//   const color = "#000000";
//   const inverseColor = getColorInverse(color);
//   console.log(inverseColor); // 输出反色的16进制颜色代码，例如 #ffffff
class CardButton extends ButtonSkin{
    private cfg:Configs.t_Function_Card_dat;
    constructor(){
        super();
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        let cfg = this.cfg;
        console.log(cfg);
        wingm(`card_inner ${cfg.f_cardid}`);
    }

    setData(cfg:Configs.t_Function_Card_dat){
        this.cfg = cfg;
        let item = this;
        // item.skin = "";//"remote/base/bottom_js.png";
        item.tf.text = cfg.f_cardid+" " + cfg.f_card_name ;
        let _quaCfg = QualitycolorProxy.Ins.getCfgByQua(cfg.f_qua);
        item.tf.color = "#" + (_quaCfg ? _quaCfg.f_color : "ffffff");
        item.graphics.clear();
        item.graphics.drawRect(0,0,item.width,item.height,ColorUtil.getColorInverse(item.tf.color));
        item.layout();
        item.tf.x = 0;
    }
}
interface ICmd{
    cmd:string;
    lb:string;
}

/**覆写类 */
function debugOverrideFrameAvatar(){
    FrameMonster.prototype.getCurMS = function(){
        let ms = this.delayMs;
        if(FightValueConfig.debugDelayMS){
            return FightValueConfig.debugDelayMS;
        }
        if (!ms) {
            ms = FightValueConfig.delayMS;
        }
        return ms;
    }
}
export class FightDebugView extends ViewBase{
    protected checkGuide:boolean = false;
    protected mShowUpdate:boolean = true;
    private closeCtl1:ButtonCtl;
    private monster:FrameMonster;
    private container:Laya.Sprite = new Laya.Sprite();
    // protected mMask:boolean = true;
    // private _frameAvatr:FrameMonster;
    // PageType: EPageType = EPageType.None;
    private _ui:Laya.View;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    private disposeMonster(){
        if(this.monster){
            this.monster.dispose();
            this.monster = null;
        }
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this.clearView();
    }

    private clearView(){
        this.disposeMonster();
        if(this.closeCtl1){
            this.closeCtl1.dispose();
        }
    }

    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new Laya.View();
            this.UI.width = this.UI.height = 500;
            this._ui.mouseThrough = true;
            // this.container.graphics.drawRect(0,0,50,50,"#ffff00");
        }
    }

    private onSpineHandler(){
        this._ui.addChild(this.monster.skeleton);
        let scr:FrameMonsterDebug = this.monster.skeleton.addComponent(FrameMonsterDebug);
        scr.monster = this.monster;
        // this.monster.getCurMS = function(){
        // }

        this.monster.skeleton.pos(this._ui.width,0);
        
    }

    private layoutUI(container:Laya.Sprite,gap:number){
        let oy:number = 0;
        for(let i = 0;i < container.numChildren;i++){
            let cell = container.getChildAt(i) as Laya.Sprite;
            cell.y = oy;
            oy += (cell.height + gap);
        }
    }
    private onBtn1Click(){
        wingm("end");
    }
    
    private addBg(color:string = '#ffffff',alpha: number = 1.0) {
        let bg1 = new Laya.Sprite();
        bg1.graphics.drawRect(0, 0, this.UI.width, this.UI.height, color);
        this.UI.addChildAt(bg1, 0);
        bg1.alpha = alpha;
    }

    private createCloseBtn(){
        let closeBtn = new Laya.Image(`remote/base/close_tips1.png`);
        // closeBtn.stateNum = 1;
        closeBtn.width = 50;
        closeBtn.height = 50
        closeBtn.x = this._ui.width - closeBtn.width;
        this._ui.addChild(closeBtn);
        this.closeCtl1 = ButtonCtl.CreateBtn(closeBtn,this,this.Close);
    }

    private addAnimBtn(){
        let animIndex: number = 1;
        // this._ui.addChild(new ButtonSkin("playAnim", new Laya.Handler(this, () => {
        // })));
        this.addFuncBtn("playAnim",this,()=>{
            let max = this.monster['frameList'].length-1;
            if (animIndex > max) {
                animIndex = 0;
            }
            this.monster.play(animIndex, undefined, undefined, undefined, undefined, undefined, true);
            animIndex++;
        })
    }

    private addFuncBtn(lb:string,that,func:Function){
        let _btn = new ButtonSkin(`${lb}`,new Laya.Handler(this,(btn:ButtonSkin)=>{
            func.call(that);
        }));
        this.container.addChild(_btn);
    }

    private initMonsterBtn(){
        this.addAnimBtn();//EAvatarAnim.TowerSkillB
        this.addFuncBtn("反转方向",this,()=>{
            this.monster.dir = -this.monster.dir;
        });
        this.layoutUI(this.container, 10);
    }
    private bufferData;
    protected onInit(): void {
        this.clearView();
        // throw new Error("Method not implemented.");
        while(this._ui.numChildren){
            this._ui.getChildAt(0).removeSelf();
        }
        while(this.container.numChildren){
            this.container.getChildAt(0).removeSelf();
        }
        //============================================
        this._ui.addChild(this.container);
        this.disposeMonster();
        //=======================================================
        this.createCloseBtn();
        if (this.Data) {
            let arr = this.Data.split("-");

            let type = parseInt(arr[0]);

            if (type == 1) {
                //英雄
                //  gm('openui 56 1-20')
                let imageId: number = parseInt(arr[1]);
                if (!isNaN(imageId)) {
                    this.initMonsterBtn();
                    this.monster = FightFactory.createFrameHero(imageId, this, this.onSpineHandler);
                }
                return;
            }
            else if(type == 2){
                //模板怪物
                //  gm('openui 56 2-10') // 10代表tempId
                this.initMonsterBtn();
                this.monster = FightFactory.createFrameMonster(0,this,this.onSpineHandler,1.0,parseInt(arr[1]));
                return;
            }
            else if(type == 3){
                //根据imageId创建序列帧
                // gm("openui 56 3-2006")
                debugOverrideFrameAvatar();
                this.initMonsterBtn();
                this.monster = FightFactory.createByImageId(parseInt(arr[1]),this._ui,this._ui.width,0,1,EResKey.Fight).coreSpine as any;
                this.monster.once(Laya.Event.COMPLETE, this, this.onSpineHandler,[this.monster]);
                return;
            }
        }
        this.addFuncBtn("结束战斗",this,this.onBtn1Click);
        
        this.addFuncBtn("添加货币",this,()=>{
            wingm('item_inner 6 10000;item_inner 7 10000');
        });

        let heroid:number = 1;
        this.addFuncBtn("添加英雄",this,()=>{
            wingm(`hero_inner ${heroid} 1`);
            heroid++;
            // gm('hero_inner 23 1')
            // btn.tf.text = `add hero ${heroid}`;
        });

        // this.addFuncBtn("跳过引导",this,()=>{
        //     MainModel.Ins.finishGuideReward();
        // });

        this.initCmdList([
            // {lb:"召唤神话",cmd:s1},
            // {lb:"wave++",cmd:"wave 30"},//英雄配置表 table t_Hero
            {lb:"watch_memory",cmd:"watch_memory"},
        ])

        this.addFuncBtn("wave++",this,this.onWaveAdd);
        this.addFuncBtn("召唤神话",this,this.onAddHero);


        this.addFuncBtn("33",this,()=>{
            // MainModel.Ins.finishGuideReward();
            // this.onDebugTrailHandler();
            wingm("createHero 33 0 2");
        });
        this.addFuncBtn("hero33",this,()=>{
            wingm("hero_inner 33");
        })

        this.addFuncBtn("free_res",this,()=>{
            // oTAGY7aqTU_yB-kYCWCOXTWWijXA
        
            // for(let i = 0;i < 1024*1024;i++){
            // let obj = new Object();
            // console.log(i);
            // }
            // let array = [];
            // function createLargeObject() {
            //     // 创建一个大对象来模拟大内存分配
            //     array = new Array(1000000).fill(null);
            // }

            // function performGCtest() {
            //     // 创建大量的对象并将它们存储在数组中
            //     const objects = [];
            //     for (let i = 0; i < 128; i++) {
            //         objects.push(new createLargeObject());
            //     }

            //     // 清空数组来释放对象，这样可以帮助垃圾回收器回收这部分内存
            //     objects.length = 0;

            //     // // 通过调用原生的GC函数来强制进行垃圾回收（如果存在）
            //     // if (global.gc) {
            //     //   console.log('Attempting to perform a garbage collection...');
            //     //   global.gc();
            //     // } else {
            //     //   console.log('Garbage collection unavailable.');
            //     // }
            // }

            // performGCtest();

            E.EventMgr.emit(EventID.FreeRes);
        });
        this.addFuncBtn(`finish_pveguide`,this,()=>{
            wingm(`finish_pveguide`);
        })

        // this.addFuncBtn("showeffect",this,()=>{
        //     wingm("showeffect");
        // })


    
        // this.addFuncBtn("switchhero",this,()=>{
            // ComposeModel.Ins.curAdapter.switchHero(6,8);
        // });

        // this.addFuncBtn("err",this,()=>{
        // MainModel.Ins.finishGuideReward();
        // E.ViewMgr.ShowMidError('11');
        // });
        //========================================================
        this.layoutUI(this.container, 10);

        this.initList();
    }
    private _wave:number = 0;
    private onWaveAdd(){
        this._wave+=1;
        wingm(`wave ${this._wave}`);
    }

    private onAddHero(){
        let l1 = HeroListProxy.Ins.List;
        let s1 = "";
        for(let i = 0;i < l1.length;i++){
            let heroCfg:Configs.t_Hero_dat = l1[i];
            if(heroCfg.f_qua == EHeroQua.Red){
                s1+=`hero_inner ${heroCfg.f_heroid};`
            }
        }
        wingm(s1);
    }
    private onDebugTrailHandler() {
        for (let n = 0; n < 3; n++) {
            for (let i = 0; i < 6; i++) {
                let o = new stElement();
                o.fid = 1;
                o.num = 1;
                o.x = i;
                o.y = n;
                o.playerId = MainModel.Ins.mRoleData.AccountId;
                ComposeModel.Ins.fightView['_trailDecorator'].play(o, EComposeUpdateType.Compose, [], false);
            }
        }
    }
    private initCmdList(l1:ICmd[]){
        for(let i = 0;i < l1.length;i++){
            let cell = l1[i];
            this.addFuncBtn(cell.lb,this,()=>{
                wingm(cell.cmd);
            });
        }
    }

    private initList(){
        let list1 = new Laya.List();
        list1.vScrollBarSkin = " ";
        list1.x = 150;
        list1.width = 150;
        list1.height =  500;
        this._ui.addChild(list1);
        DebugUtil.draw(list1);
        list1.itemRender = CardButton;
        list1.renderHandler = new Laya.Handler(this,this.onButtonHandler);
        let l1:Configs.t_Function_Card_dat[] = t_Function_Card.Ins.List;
        l1.sort((a:Configs.t_Function_Card_dat,b:Configs.t_Function_Card_dat)=>{
            if(a.f_cardid > b.f_cardid){
                return 1;
            }else if(a.f_cardid < b.f_cardid){
                return 1;
            }
            return 0;
        });
        list1.array = l1;
    }

    private onButtonHandler(item:CardButton){
        let cfg:Configs.t_Function_Card_dat = item.dataSource;
        item.setData(cfg);
    }
    
    protected SetCenter(): void {
        if (this.UI && !this.UI.destroyed) {
            // this.UI.anchorX = this.UI.anchorY = 0.5;
            // this.UI.x = this.ViewParent.width >> 1;
            this.UI.y = this.ViewParent.height >> 1;

            // this.UI.y = (this.ViewParent.height - this.UI.height) >> 1;
        }
        DebugUtil.draw(this.UI,"#ff00ff");
    }
}