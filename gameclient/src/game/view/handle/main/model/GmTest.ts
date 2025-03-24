import { buildDebugStat } from "../../../../../frame/view/OverrideCore";
import { E } from "../../../../G";
import { DebugClientCmd } from "../../compose/views/debug/DebugClientCmd";
import { DebugCmdShow } from "../../compose/views/debug/DebugCmdShow";
import { BaseDebugShow, DebugTxtShow, IDebugDecorator } from "../../compose/views/debug/DebugTxtShow";
/*
//#region 参数

==============================================================
initconfig.js

asset:"https://winserver-game.wanhuir.com/Project1/Client/towertrunk/resource/",
platform:1,
sy_url:"https://dev-server.game.wanhuir.com/tower",
ver:"dev",

//renderDebug:true,

==============================================================

//#endregion

https://developer.taptap.cn/273897/app/724994/tapdb?path=%2Fsql_ide

tap
uid:18115
5062d5538ec0ebb3748c53de61ef6ffe

SELECT name, syReportTime, syEventId, syAppSize, syWebSize, height, width FROM hive_saas1.tapdb."events" 
WHERE "$part_date" = '2024-11-29' And user_id like '%5062d5538ec0ebb3748c53de61ef6ffe%'
order by time desc
LIMIT 1000
*/

export class GmTest {
    private _debugDecorator:IDebugDecorator;
    onStartGame(){
        this.initDebugDecorator();
    }

    private initDebugDecorator(){
        // Laya.Browser.onPC ||
        // if( initConfig.debug || Laya.Utils.getQueryString("debug") == "1"){
            if(!this._debugDecorator){
                let _dec:IDebugDecorator = new BaseDebugShow()
                _dec = new DebugCmdShow(_dec);
                _dec = new DebugClientCmd(_dec);
                this._debugDecorator = _dec;
            }

            if(Laya.Utils.getQueryString("debug")||debug || E.sdk.isWhite){
                this._debugDecorator = new DebugTxtShow(this._debugDecorator);
            }
            this._debugDecorator.init();
        // }
    }
    constructor() {
        this.initDebugDecorator();
        //=========================================================
        let that = this;
        window["gm"] = function (str: string) {
            console.log(`gm("${str}")`);
            if(that._debugDecorator){
                if(that._debugDecorator.clientCmd(str)){
                    that._debugDecorator.parseCmd(str);
                }
            }else{
                LogSys.Warn(`_debugDecorator is null...`);
            }
        }

        if (debug) {
            buildDebugStat();
        }
    }
}


/*
//测试服配置
var initConfig={
	asset:"https://winserver-game.wanhuir.com/Project1/Client/towertrunk/resource/",
	platform:1,
	sy_url:"https://dev-server-game.wanhuir.com/tower",
	appid: "tower_kaifazhong",
	ver:"dev",
	debug:true,
	openid:"dwh715",
	
	debugshow:true,

	Stat:1,
	memoryDebugCount:10,
	// disableBullet:true,
	// disableNormalHit:true,
	// disableHitSkill:true,
	// disableBloodTxt:true,
	debug_monsterId:1,
	debug_hero_imageid:35,
	disableSpineCache:true
}
window["initConfig"] = initConfig;
*/