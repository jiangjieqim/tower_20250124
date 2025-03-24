import { ui } from "../../../../../../ui/layaMaxUI";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { MainModel } from "../../../main/model/MainModel";
import { ItemSlotCtl } from "../../../main/views/icon/SoltItemView";
import { TowerMainFightModel } from "../../model/TowerMainFightModel";

export class TrophyItem1 extends ui.views.main.ui_trophyItem2UI{
    private _ctl:ItemSlotCtl;

    constructor(){
        super();
        this._ctl = new ItemSlotCtl(this.view);
    }

    public setData(value:Configs.t_God_Road_dat){
        if(!value)return;
        let data = TowerMainFightModel.Ins.godRoadList.find(ele=>ele.id == value.f_id);
        if(!data)return;
        this._ctl.setData(ItemViewFactory.convertItem(value.f_reward));
        this.lab.text = value.f_season_name1;
        this.img.skin = `o/trophyicon/img_sj${value.f_stage}.png`;
        this.img2.skin = `o/trophyicon/mask_${value.f_stage}.png`;
        this.img3.skin = `o/trophyicon/img_sj${value.f_stage}_s.png`;
        if(value.f_season < MainModel.Ins.season){
            this.img.visible = this.img2.visible = true;
            this.img3.visible = false;
        }else if(value.f_season == MainModel.Ins.season){
            this.img.visible = this.img2.visible = false;
            this.img3.visible = true;
        }else{
            this.img.visible = true;
            this.img2.visible = this.img3.visible = false;
        }

        if(data.status == 2){
            this.m.visible = true;
        }else{
            this.m.visible = false;
        }
    }
        
}