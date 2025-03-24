// import { HttpUtil } from "../../../../frame/util/HttpUtil";
import { ViewBase } from "../../../../frame/view/ViewBase";
import { InitConfig, PlatformConfig } from "../../../../InitConfig";
import { ui } from "../../../../ui/layaMaxUI";
import { E } from "../../../G";
import { stServerItem } from "../../../network/protocols/BaseProto";
import { MainEvent } from "../main/model/MainEvent";
import { MainModel } from "../main/model/MainModel";
import { t_Server_Name } from "./t_Server_Name";

export class LoginQuFuView extends ViewBase{
    private _ui:ui.views.login.ui_loginQuFuViewUI;
    protected mMask = true; 
    protected checkGuide:boolean = false;
    protected autoFree: boolean = true;
    protected onAddLoadRes() {
        this.addAtlas("xuanfu.atlas");
    }

    protected onFirstInit(){
        if(!this.UI){
            this.UI = this._ui = new ui.views.login.ui_loginQuFuViewUI;
            this.bindClose(this._ui.close1);

            this._ui.list.itemRender = ui.views.login.ui_loginQuFuItemUI;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onItemRender);
            this._ui.list.selectEnable = true;
            this._ui.list.selectHandler = new Laya.Handler(this,this.onSelectHandler);

            this._ui.list1.itemRender = ui.views.login.ui_loginQuFuItem1UI;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onItemRender1);
            this._ui.list1.selectEnable = true;
            this._ui.list1.selectHandler = new Laya.Handler(this,this.onSelectHandler1);
        }
    }

    protected onInit() {
        this._ui.list.array = this._ui.list1.array = [];
        this.upDataView();
    }

    protected onExit() {
        
    }

    private onItemRender1(item:ui.views.login.ui_loginQuFuItem1UI,index:number){
        let data = item.dataSource;
        item.lab_sname.text = data.serverName;
        if(data.playerId){
            item.lab_lv.text = "lv:" + data.roleLevel;
            if(data.serverID == MainModel.Ins.serverID){
                item.img_sel.visible = true;
            }else{
                item.img_sel.visible = false;
            }
        }else{
            item.lab_lv.text = "";
            item.img_sel.visible = false;
        }
       
        if(data.isNew){
            item.img_new.visible = true;
        }else{
            item.img_new.visible = false;
        }
    }

    private _serverState:number;
    private _serverID:number;
    private _serverIsNew:number;
    private _serverName:string;
    private _serverplayerId:number;
    private onSelectHandler1(index:number){
        if(index == -1){return};

        this._serverState = this._ui.list1.array[index].serverState;
        this._serverID = this._ui.list1.array[index].serverID;
        this._serverIsNew = this._ui.list1.array[index].isNew;
        this._serverName = this._ui.list1.array[index].serverName;
        this._serverplayerId = this._ui.list1.array[index].playerId;

        HttpUtil.httpGet(`${InitConfig.getSyURL()}/server/appoint?appid=${E.sdk.getAppId()}&openid=${this.getOpenId()}
        &ver=${this.getVer()}&server_id=${this._ui.list1.array[index].serverID}`, new Laya.Handler(this, this.onSelServerHandler));
    }

    private onSelServerHandler(data: string){
        let obj = JSON.parse(data);
        if (obj.code == 0) {
            MainModel.Ins.serverState = this._serverState;
            MainModel.Ins.serverID = this._serverID;
            MainModel.Ins.serverIsNew = this._serverIsNew;
            MainModel.Ins.serverName = this._serverName;
            MainModel.Ins.serverplayerId = this._serverplayerId;
            MainModel.Ins.event(MainEvent.UpdateServer);
            this.Close();
        }
    }

    private onItemRender(item:ui.views.login.ui_loginQuFuItemUI,index:number){
        let data = item.dataSource;
        item.lab_name.text = data.name;
        if(data.isSelect){
            item.img.skin = "remote/xuanfu/bottom_dl_s.png";
        }else{
            item.img.skin = "remote/xuanfu/bottom_dl_n.png";
        }
    }

    private onSelectHandler(index:number){
        if(index == -1){return};
        for(let i:number=0;i<this._ui.list.array.length;i++){
            if(index == i){
                this._ui.list.array[i].isSelect = true;
            }else{
                this._ui.list.array[i].isSelect = false;
            }
        }
        this._ui.list.refresh();
       
        HttpUtil.httpGet(`${InitConfig.getSyURL()}/server/list?appid=${E.sdk.getAppId()}&openid=${this.getOpenId()}
        &ver=${this.getVer()}&serverZuID=${this._ui.list.array[index].id}`, new Laya.Handler(this, this.onSelServerZuHandler));
    }

    private onSelServerZuHandler(data: string){
        let obj = JSON.parse(data);
        if (obj.code == 0) {
            let arr = [];
            let arr1 = [];
            for(let i:number=0;i<obj.result.length;i++){
                if(obj.result[i].serverID == MainModel.Ins.serverID){
                    arr.push(obj.result[i]);
                }else{
                    arr1.push(obj.result[i]);
                }
            }
            this._ui.list1.array = arr.concat(arr1);
        }
    }

    private getOpenId(){
        return E.sdk.getOpenId();
    }

    private getVer(){
        return E.ver;
    }

    private upDataView(){
        let arr = [];
        arr.push({name:"我的服务器",isSelect:false,id:20000});
        for(let i:number = MainModel.Ins.serverZu;i > 0;i--){
            let cfg:Configs.t_Server_Name_dat = t_Server_Name.Ins.getCfg(i,initConfig.platform);
            let st;
            if(cfg){
                st = cfg.f_warzone_name;
            }else{
                st = "测试区";
            }
            arr.push({name:st,isSelect:false,id:i});
        }
        this._ui.list.array = arr;

        if(MainModel.Ins.serverplayerId){
            this._ui.list.selectedIndex = 0;
        }else{
            this._ui.list.selectedIndex = 1;
        }
    }
}