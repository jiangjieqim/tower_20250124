import { EMsgBoxType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { MainEvent } from "../main/model/MainEvent";
import { MainModel } from "../main/model/MainModel";
import { WeiXinSDK } from "../weixin/WeiXinSDK";
import { meituan } from "./IMeiTuan";
import { ESdkValChange } from "./ISdk";
let LXAnalytics = window['LXAnalytics'];
let cur_cid:string = `c_game_4zk2nelx`;
let curType:number = 2;

/**美团SDK 
 * 
 * 接口不能用
 * 分包
 * loadFont
*/
export class MeiTuanSDK extends WeiXinSDK {
    
    //  美团添加到桌面
    //  https://game.meituan.com/#/docs
    addShortcut() {
        let that = this;
        let labelVal:string = initConfig.channel_key||"game1";
        // https://cdnserver.game.wanhuir.com/cbsg/ts_fengzh54/rev_out/
        let _icon:string = `${initConfig.asset}static/gameloog.png`;
        let targetVal:string = `imeituan://www.meituan.com/mgc?mgc_id=${that.getAppId()}&inner_source=10790_desk&query=inner_source%3D10790_desk&_page_new=1`;
        // if(typeof meituan.supportShortcut != "function"){
        //     this.Log("接口supportShortcut不支持");
        //     return;
        // }
        if(typeof meituan.addShortcut != "function"){
            this.Log("接口addShortcut不支持");
            return;
        }
        
        // meituan.queryShortcut({
        //     id:that.getAppId(),
        //     label:labelVal,
        //     target:targetVal,
        //     success: (e) => {
        //         //==================================================
        //         // that.isAddShortcut(()=>{

        //         // })

        //         meituan.supportShortcut({
        //             operation: 1,
        //             type: curType,
        //             success: (e) => {
                        // that.Log("queryShortcut succeed:" + JSON.stringify(e));
                        meituan.addShortcut({
                            id:that.getAppId(),
                            icon:_icon,
                            label:labelVal,
                            target:targetVal,
                            success:(e)=>{
                                console.log("addShortcut succeed:" + JSON.stringify(e));
                            },
                            fail: (e) => {
                                console.log("addShortcut fail:"+JSON.stringify(e));

                                /*
                                let obj = JSON.parse(e.errMsg);
                                let _code = obj.code;
                                // that.Log("addShortcut fail:" + JSON.stringify(obj) + "---->" + _code);
                                if(_code == 10002){
                                    // that.Log(`code :${_code}`);
                                    //已经添加了桌面快捷方式
                                    that.hasShortcut = true;
                                    MainModel.Ins.event(MainEvent.UpdateListView);
                                }
                                */
                            }
                        })

            //         },
            //         fail: (e) => {
            //             that.Log("supportShortcut fail:" + JSON.stringify(e));
            //         }
            //     });
            //     //==================================================       
            // },
            // fail:(e)=>{
            //     that.Log("queryShortcut fail:" + JSON.stringify(e));                
            // }
        // })  
    }

    private Log(s: string) {
        if(debug){
            E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, s);
        }
    }

    // mt.getLaunchOptionsSync().query.inner_source
    /**数据上报 */
    public valChange(type:ESdkValChange,v:number){
        super.valChange(type,v);

        if (type == ESdkValChange.CreateRole) {
            if (typeof LXAnalytics == "function") {
                LXAnalytics(
                    'moduleView',
                    'b_game_tg6t1x6t_mv',
                    {
                        'page_id': cur_cid,
                        'inner_source': this.inner_source,
                        'game_id': E.sdk.getAppId(),
                        'create_time': Date.now(),
                        //   'level': ,
                        'role_id': MainModel.Ins.mRoleData.AccountId.toString(),
                        //   'service_id': ''
                    },
                    {
                        cid: cur_cid
                    })
            }
        }
        else if (type == ESdkValChange.LevelUp) {
            if (typeof LXAnalytics == "function") {
                LXAnalytics(
                    'moduleView',
                    'b_game_fa7pxwns_mv',
                    {
                        'page_id': cur_cid,
                        'inner_source': this.inner_source,
                        'game_id': E.sdk.getAppId(),
                        'level': MainModel.Ins.mRoleData.lv.toString(),
                        'role_id': MainModel.Ins.mRoleData.AccountId.toString()
                    },
                    {
                        cid: cur_cid
                    })
            }
        }
    }
    private _inner:string;
    get inner_source(){
        if(!this._inner){
            if(typeof meituan.getLaunchOptionsSync == "function"){
                if(meituan.getLaunchOptionsSync().query){
                    this._inner = meituan.getLaunchOptionsSync().query.inner_source || "";
                }
            }
        }
        return this._inner;
    }
    // private inner_source:string;
    public onShow(query) {
        super.onShow(query);
        // this.Log(`query:${JSON.stringify(query['query'])}`);

        // if (query && query['query'] && query['query']['inner_source']) {   
        //     this.inner_source = query['query']['inner_source'];
        //     this.Log(`inner_source:${this.inner_source}`);
        // }
        // this.Log(`inner:[${this.inner}]`);
        // this.Log(`LXAnalytics type is [${typeof LXAnalytics}]`);

        if(typeof LXAnalytics=="function"){
            LXAnalytics('pageView', {'custom': { 'inner_source': this.inner_source }}, {}, cur_cid);
        }
    }

    public onHide(){
        if(typeof LXAnalytics=="function"){
            LXAnalytics('pageDisappear', {}, cur_cid);
        }
    }
    public recharge(orderId: string, cfg:Configs.t_Recharge_dat){
        // if(this.isBigVersion("12.17.400","12.18.200")){
        //     super.recharge(orderId,cfg);
        // }else{
        //     E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`当前美团APP版本过低，未开通iOS支付，请升级最新版本`);
        // }
        if(this.isIOS){
            if(this.isBigVersion(wx.getSystemInfoSync().SDKVersion,"12.18.200")){
                super.recharge(orderId,cfg);
            }else{
                E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk,`当前美团APP版本过低，未开通iOS支付，请升级最新版本`);
            }
        }else{
            super.recharge(orderId,cfg);
        }
    }
}