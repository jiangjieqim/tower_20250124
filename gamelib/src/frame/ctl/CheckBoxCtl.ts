import { ButtonCtl } from "./ButtonCtl";

export interface ICheckBoxSkin {
    bg: Laya.Image;
    gou: Laya.Image;
    content: Laya.Label;
}

export class CheckBoxCtl {
    // public clickhadnler:Laya.Handler;
    public bg: Laya.Image;
    public skin: ICheckBoxSkin;

    private gou: Laya.Image;
    private content: Laya.Label;
    // private _selected:boolean = false;
    private btn:ButtonCtl;
    public selectHander: Laya.Handler;
    checkHandler:Laya.Handler;
    constructor(skin: ICheckBoxSkin, contentStr?: string) {
        this.skin = skin;
        // bg:Laya.Image,gou:Laya.Image,content:Laya.Label
        this.bg = skin.bg;
        this.gou = skin.gou;
        this.content = skin.content;
        this.gou.mouseEnabled = false;
        if (this.content) {
            this.content.mouseEnabled = false;
            if (contentStr) {
                this.content.text = contentStr;
            }
        }
        this.bg.mouseEnabled = true;
        this.btn = ButtonCtl.CreateBtn(this.bg, this, this.onClick, false);
        // this.bg.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick() {
        if (this.checkHandler && this.checkHandler.run() == false) {
            return
        }
        this.selected = !this.gou.visible;
        if (this.selectHander) {
            this.selectHander.runWith(this.selected);
        }

    }
    public set selected(v) {
        // this._selected = v;
        this.gou.visible = v;
    }

    public get selected() {
        return this.gou.visible;
    }

    public set visible(v) {
        this.bg.visible = this.gou.visible = v;
        if (this.content) {
            this.content.visible = v;
        }
    }

    dispose() {
        // this.bg.off(Laya.Event.CLICK, this, this.onClick);
        this.btn.dispose();
    }

    set disable(v: boolean) {
        this.bg.mouseEnabled = !v;
    }

    set gray(v: boolean) {
        this.bg.gray = v;
        this.gou.gray = v;
        if (this.content) {
            this.content.gray = v;
        }
    }
}

// export class CheckBoxList {
//     public itemRender: Laya.Handler;
//     public callClickHandler:Laya.Handler;
//     private l2: CheckBoxCtl[];

//     public init(skinlist: ICheckBoxSkin[]) {
//         this.l2 = [];
//         for (let i = 0; i < skinlist.length; i++) {
//             this.l2.push(new CheckBoxCtl(skinlist[i]));
//         }
//         for (let i = 0; i < this.l2.length; i++) {
//             let ctl: CheckBoxCtl = this.l2[i];
//             ctl.bg.on(Laya.Event.CLICK, this, this.onClickHandler, [i]);
//         }
//     }

//     public setData(data){
//         let l2 = this.l2;
//         for(let i = 0;i < l2.length;i++){
//             let ctl:CheckBoxCtl = l2[i];
//             let cellData = data[i];
//             if(cellData){
//                 ctl.visible = true;
//                 this.itemRender.runWith([ctl.skin,i]);
//             }else{
//                 ctl.visible = false;
//             }
//         }
//     }

//     private onClickHandler(index:number)
//     {
//         this.refreshSelect(index);
//         this.callClickHandler.runWith(index);
//     }

//     public setSelectIndex(v){
//         this.refreshSelect(v);
//     }

//     private refreshSelect(index:number){
//         let l2 = this.l2;
//         for(let i = 0;i < l2.length;i++){
//             let ctl:CheckBoxCtl = l2[i];
//             if(i == index){
//                 ctl.selected = true;
//             }else{
//                 ctl.selected = false;
//             }
//         }
//     }
// }