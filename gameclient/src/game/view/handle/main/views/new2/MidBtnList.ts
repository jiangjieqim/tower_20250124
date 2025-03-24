// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { MainIconListBase } from "./MainIconListBase";

export class MidBtnBaseList extends MainIconListBase{
     /**更多按钮 */
     moreBtn: Laya.Sprite;
     moreBtnCtl:ButtonCtl;
     /**按钮容器 */
     con: Laya.Sprite;
     /**侧边栏容器 */
     leftCon:Laya.Sprite;
     /**蒙版 */
     mornBg:Laya.Image;
    init(): void {
    }
    refresh(): void {
    }
    getByName(name: string) {
        return null;
    }
}

/**中间按钮 */

// export class MidBtnList extends MidBtnBaseList {
//     //是否展开中 
//     private isTurnOn: boolean = false;
//     private moreplus: Laya.Image;
//     private morntf:Laya.Label;
//     private morered:Laya.Image;
//     // private static clsSkin: string = "ui_main_center_icon";

//     private curIconList: FuncSmallIcon[];
//     protected cellGap: number = 10;
//     private tw: Laya.Tween = new Laya.Tween();

//     private _iconCfgList = [];
//     // private ICON_KEY:string = "icon";
//     init() {
//         this.curIconList = [];
//         let l1 = MainIconProxy.Ins.List;
//         for (let i = 0; i < l1.length; i++) {
//             let cfg: Configs.t_MainIcon_dat = l1[i];
//             if (cfg.f_mid_pos) {
//                 this._iconCfgList.push(cfg);
//             }
//         }

//         let nowCount:number = MainViewConf.MID_MAX_BTN - this._iconCfgList.length;

//         for(let i = 0;i < nowCount;i++){
//             this._iconCfgList.push("Empty");
//         }

//         this._iconCfgList.sort(this.f_sortSortHandler);
//         this.moreBtnCtl = ButtonCtl.CreateBtn(this.moreBtn,this,this.onMoreClick)
//         // this.moreBtn.on(Laya.Event.CLICK, this, this.onMoreClick);

//         this.moreplus = this.moreBtn.getChildByName("moreplus") as Laya.Image;
//         this.morntf = this.moreBtn.getChildByName("morntf") as Laya.Label;
//         this.morered = this.moreBtn.getChildByName("morered") as Laya.Image;
//         this.mornBg.on(Laya.Event.CLICK,this,this.onMaskClick);
//         MainModel.Ins.on(MainEvent.FuncSmallIconUpdate, this, this.onRedUpdate);

//         // this.mornBg.on(Laya.Event.DISPLAY,this,this.onMornBgDisplay);
//         this.moreBtnCtl.visible = false;
//     }

//     public onMornBgDisplay(){
//         // let pos = (this.mornBg.parent as Laya.Sprite).localToGlobal(new Laya.Point(this.mornBg.x,this.mornBg.y));
//         // console.log("onMornBgDisplay:",pos);
//     }

//     private updateRed() {
//         let _dot: boolean = false;

//         for (let i = MainViewConf.MID_FIRST_COUNT - 1; i < this.curIconList.length; i++) {
//             let cell = this.curIconList[i];
//             if (cell && FunctionModel.Ins.getHasRed(cell.funcId)) {
//                 _dot = true;
//                 break;
//             }
//         }
//         this.morered.visible = _dot;
//     }
//     private onRedUpdate(){
//         this.updateRed();
//     }

//     private onMaskClick(e:Laya.Event){
//         // this.bgMask.visible = false;
//         // this.onClickHandler(e);
//         // this.moreBtn.event(Laya.Event.CLICK);
//         this.onMoreClick();
//     }
//     /**更多按钮点击事件 */
//     private onMoreClick() {
//         this.isTurnOn = !this.isTurnOn;
//         this.tw.clear();
//         let useTime: number = 200;
//         let moreplus: Laya.Image = this.moreBtn.getChildByName("moreplus") as Laya.Image;
//         this.moreplus = moreplus;
//         if (this.isTurnOn) {
//             this.tw.to(moreplus, { rotation: 45 }, useTime);
//         } else {
//             this.tw.to(moreplus, { rotation: 0 }, useTime);
//         }
//         this.refresh();
//     }
//     private getEmptyItem(){
//         for(let i = 0;i < this.curIconList.length;i++){
//             let icon:FuncSmallIcon = this.curIconList[i];
//             if(!icon.used && icon.funcId == 0){
//                 icon.used = true;
//                 return icon;
//             }
//         }
//         let icon = new FuncSmallIcon();
//         icon.initSkin(MainViewConf.iconCls);
//         icon.used = true;
//         this.curIconList.push(icon);
//         return icon;
//     }
//     private getItem(funcid:EFuncDef){
//         for(let i = 0;i < this.curIconList.length;i++){
//             let icon:FuncSmallIcon = this.curIconList[i];
//             if(!icon.used && icon.funcId == funcid){
//                 icon.used = true;
//                 return icon;
//             }
//         }

//         let icon:FuncSmallIcon;
//         switch(funcid){
//             // case EFuncDef.CiFu:
//             //     icon = new CiFuIcon();
//             //     break;
//             // case EFuncDef.HeroHouse:
//             //     icon = new YanWuIcon();
//             //     break;
//             default:
//                 icon = new FuncSmallIcon();
//                 break;
//                 // Laya.Pool.getItemByClass(MidBtnList.clsSkin, FuncSmallIcon);
//         }
//         icon.used = true;
//         icon.initSkin(MainViewConf.iconCls);
//         icon.update();
//         this.curIconList.push(icon);
//         return icon;
//     }
//     getByName(name: string) {
//         if (this.curIconList) {

//             for (let i = 0; i < this.curIconList.length; i++) {
//                 let icon = this.curIconList[i];
//                 if (icon.used && icon.skin.name == name) {
//                     return icon.skin;
//                 }
//             }
//         }
//     }
//     refresh() {

//         if (this.isTurnOn) {
//             this.morntf.text = "关闭";
//             this.moreplus.rotation = 45;
//             this.mornBg.visible =  true;
//             this.leftCon && (this.leftCon.visible = false);
//         } else {
//             this.morntf.text = "更多";
//             this.moreplus.rotation = 0;
//             this.mornBg.visible =  false;
//             this.leftCon && (this.leftCon.visible = true);
//         }
//         // while (this.curIconList.length) {
//             // let cell = this.curIconList.pop();
//             // Laya.Pool.recover(MidBtnList.clsSkin, cell);
//             // cell.dispose();
//         // }

//         for(let i = 0;i < this.curIconList.length;i++){
//             let icon:FuncSmallIcon = this.curIconList[i];
//             icon.used = false;
//             icon.dispose();
//         }

//         let sx = this.cellGap;
//         let sy: number = 0;
//         let row: number = 0;
//         let cellHeight: number;
//         this.minRow = MainViewConf.MID_FIRST_COUNT;

//         for (let i = 0; i < this._iconCfgList.length; i++) {
//             let cfg:Configs.t_MainIcon_dat = this._iconCfgList[i];
//             if (row >= this.minRow) {
//                 if (this.minRow == MainViewConf.MID_FIRST_COUNT) {
//                     this.con.addChild(this.moreBtn);
//                     // this.moreBtn.x = sx;
//                     // this.moreBtn.y = sy;
//                     this.moreBtnCtl.setpos(sx,sy);
//                 }
//                 this.minRow = MainViewConf.MID_FIRST_COUNT + 1;
//                 row = 0;
//                 sx = this.cellGap;
//                 sy -= cellHeight;
//                 if (!this.isTurnOn) {
//                     break;
//                 }
//             }

//             let item:FuncSmallIcon;

//             if(typeof cfg == "string" && cfg == "Empty"){
//                 item = this.getEmptyItem();
//                 // item.initSkin(MainViewConf.iconCls);
//                 item.midEmptyStatus();
//                 item.setPos(sx,sy);
//             }else{
//                 item = this.getItem(parseInt(cfg.f_funid));//Laya.Pool.getItemByClass(MidBtnList.clsSkin, FuncSmallIcon);
//                 // item.initSkin(MainViewConf.iconCls);
//                 // item.midReset();
//                 item.skin.name = cfg.f_mid_name;//this.ICON_KEY + (cfg.f_mid_pos - 1).toString();
//                 item.refresh(item.skin as any, parseInt(cfg.f_funid), EButtonStyle.Mid, sx, sy);
//             }
//             cellHeight = item.skin.height + this.cellGap;

//             this.con.addChild(item.skin);
//             item.skin.zOrder = this._iconCfgList.length - i;
//             sx += item.skin.width + this.cellGap;
//             row++;
//         }

//         this.updateRed();
//     }
// }