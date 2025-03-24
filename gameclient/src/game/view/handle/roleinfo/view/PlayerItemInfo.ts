import { RowMoveBaseNode } from "../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { PlayerInfoCellVo, PlayerInfoTxtCellVo } from "./PlayerInfoCellVo";

class PlayerInfoTxtView extends ui.views.rank.ui_player_info_txtUI{
    dispose(){
        this.removeSelf();
    }

    refresh(data:PlayerInfoTxtCellVo){
        if(!StringUtil.IsNullOrEmpty(data.url)){
            this.icon.skin = data.url;
            this.lab0.text = "";
        }else{
            this.icon.skin = "";
            this.lab0.text = data.p0;
        }
        this.lab1.text = data.p1;
        this.lab2.text = data.p2;
        this.lab3.text = data.p3;
    }
}

class PlayerItemInfoView extends ui.views.rank.ui_player_item_infoUI {
    refresh(_data: PlayerInfoCellVo) {
        this.titleTf.text = _data.title;
        for(let i = 0;i < 4;i++){
            let lb:Laya.Label = this[`t${i}`];
            lb.text = _data.titleArr[i]||"";
        }
        while(this.con.numChildren){
            let cell:PlayerInfoTxtView = this.con.getChildAt(0) as any;
            cell.dispose();
        }
        let oy:number = 0;
        for(let i = 0;i < _data.datalist1.length;i++){
            let vo = _data.datalist1[i];
            let cell = new PlayerInfoTxtView();
            cell.x = -cell.width/2;
            cell.y +=oy;
            oy += cell.height;
            cell.refresh(vo);
            this.con.addChild(cell);
        }
        
    }
}

export class PlayerItemInfoNode extends RowMoveBaseNode {
    protected clsKey: string = "PlayerItemInfoView";

    protected createSkin() {
        return Laya.Pool.getItemByClass(this.clsKey, PlayerItemInfoView);
    }
    protected createNode(index: any) {
        let _skin: PlayerItemInfoView = this.createSkin();
        let vo:PlayerInfoCellVo = this.list[index];
        _skin.refresh(vo);
        _skin.bg.height = vo.bgHeight;
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}