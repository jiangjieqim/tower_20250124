// import { ui } from "../../../../../ui/layaMaxUI";
// import { ItemViewFactory } from "../model/ItemViewFactory";
// import { MainModel } from "../model/MainModel";
// import { ItemVo } from "../vos/ItemVo";

// export class SmallItemIcon{
//     private skin:ui.views.main.ui_slot_item1UI;
//     private itemVo:ItemVo;
//     constructor(skin){
//         this.skin = skin;
//         this.skin.on(Laya.Event.CLICK,this,this.onClickHandler);
//     }

//     private onClickHandler(e:Laya.Event){
//         e.stopPropagation();
//         let _vo = this.itemVo;
//         MainModel.Ins.showSmallTips(_vo.getName(),_vo.getDesc(),this.skin);
//     }
//     public setData(data:string){
//         this.skin.yilingqu.visible = false;
//         ////////////////////////////////////////

//         let _l:ItemVo[] =  ItemViewFactory.convertItemList(data);
//         let _itemVo:ItemVo = _l[0];
//         this.itemVo = _itemVo;
        
//         this.skin.tf1.text = "×"+_itemVo.count;
//         this.skin.icon.skin = _itemVo.getIcon();
//     }
// }