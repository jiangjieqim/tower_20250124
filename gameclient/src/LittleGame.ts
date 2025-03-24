import { E } from "./game/G";
import { Global } from "./game/littlegame/Global";
import { GameModule } from "./game/littlegame/module/game/GameModule";
import { Message } from "./game/littlegame/rb/net/Message";
import { MessageManager } from "./game/littlegame/rb/net/MessageManager";
import { UIManager } from "./game/littlegame/rb/UIManager";
import { MyAni } from "./game/littlegame/scripts/MyAni";
import { MyImage } from "./game/littlegame/scripts/MyImage";

// import GameConfig from "./GameConfig";
// import Global from "./Global";
// import GameModule from "./module/game/GameModule";
// import Message from "./rb/net/Message";
// import MessageManager from "./rb/net/MessageManager";
// import UIManager from "./rb/UIManager";

interface IinitConfig{
	checkcode:string;
	commitId:number;
	platform:number;
	chanelCheck:string;
}
// {"status":4001,"info":"error"}
interface ICheckCode{
	skin_info:string;
	status:number;
	info:string;
}

let initConfig:IinitConfig = window["initConfig"];

export class LittleGame {
	/**是否是提审状态 */
	public isAudit:boolean = false;
    private httpAction(url,callBack:Laya.Handler,type:string="get",data=null){
        function complete(data){
            callBack.runWith(data);
        }

        function err(_url:string,errData){
            // E.sendTrack("HttpRequest", { error: errData, val: url});
        }

		let http:Laya.HttpRequest = new Laya.HttpRequest();
		http.once(Laya.Event.COMPLETE,this,complete);
        console.log("http:"+url+" data:"+data);
		http.send(url,data,type);
        http.once(Laya.Event.ERROR,this,err,[url]);
    }

	constructor() {
		let reg: Function = Laya.ClassUtils.regClass;
		reg("scripts/MyImage.ts", MyImage);
		reg("scripts/MyAni.ts", MyAni);
		console.log("LittleGame is init...");

	}

	// class Main {

	isInited = false;
	isStartW = false;//分包设置false  bin的index.js去掉 loadLib 中laya的库 发布即可
	// constructor() {//独立项目把下面放开
	// 	//根据IDE设置初始化引擎
	// 	if (this.isStartW) {
	// 		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
	// 		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
	// 		Laya["Physics"] && Laya["Physics"].enable();
	// 		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
	// 		Laya.stage.scaleMode = GameConfig.scaleMode;
	// 		Laya.stage.screenMode = GameConfig.screenMode;
	// 		//兼容微信不支持加载scene后缀场景
	// 		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

	// 		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
	// 		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
	// 		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
	// 		if (GameConfig.stat) Laya.Stat.show();
	// 		// Laya.alertGlobalError = true;

	// 		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
	// 		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	// 	}

	// }

	// onVersionLoaded(): void {
	// 	//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
	// 	Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	// }

	skipFun: Function;

	private login(callback: Function){
		this.skipFun = callback;

		if((config && config.key) == "pc" || Laya.Browser.onPC){
			callback();
		}
		else if(initConfig.checkcode){
			//微信自走棋

			//获取是否是买量渠道
			/*
				chanelCheck:"https://docater1.cn/index.php?g=Wap&m=MiniGame&a=checkUserIsFromBuyTunnel"
				status string 状态码，1001代表请求成功
				msg string 提⽰信息
				isFromBuy int 是否来⾃买量，0否、1是
			*/
			let channel = window['sySdk'].channel;
			let openId = window['sySdk'].openid
			console.log("initConfig:"+JSON.stringify(initConfig));
			this.httpAction(initConfig.chanelCheck+`&openId=${openId}&channel=${channel}`,new Laya.Handler(this,(e)=>{
				// console.log("========================>",e);
				// {"status":1001,"msg":"success","isFromBuy":0}
				console.log("检测⽤户是否来⾃买量渠道"+e);
				
				let data = JSON.parse(e);

				if(data.status == 1001 && data.isFromBuy == 0){
					//非买量用户使用,前置小游戏
					this.httpAction(initConfig.checkcode,new Laya.Handler(this,this.onCheckCode,[callback]),"post",`{"commitId":${initConfig.commitId||0}}`)
				}
				else{
					callback();
				}
			}),"get");


		}else{
			let Sygame = window['Sygame'];
			let appid:string =  Sygame.appid;
			let openId:string = Sygame.openid;
			let platform:string = window["initConfig"].platform;
			let little_ver:string = window["initConfig"].little_ver;//小游戏版本
			let sign = "-1"//Version.SIGN;//Version.curValue
			let url:string = `${window["initConfig"]["sy_url"]}/login?appid=${appid}&openid=${openId}&platform=${platform}&ver=${little_ver}${sign}&token=${E.sdk.getToken()}`;
			console.log("littleGame-->"+url);
			this.httpAction(url,new Laya.Handler(this,this.loginComplete,[callback]));
		}
	}

	private onCheckCode(callback:Function,data:string){
		console.log("onCheckCode:"+data);
		let obj:ICheckCode = JSON.parse(data);
		let skin_info:number = parseInt(obj.skin_info);
		if(obj.status == 4001 || skin_info == 4001){
			//已经过审
			this.isAudit = false;
			callback();
		}else if(skin_info == 3003){
			//审核中
			this.isAudit = true;
			this.runGame();
		}
	}

	private loginComplete(callback:Function,data:string){
		console.log("LittleGame loginComplete",data);
		// this.skipFun = callback;

		// if(window["initConfig"]["test_little"]){
		// 	this.runGame();
		// 	return;
		// }

		let obj = JSON.parse(data);

		// console.log("game...=================================================>",obj);
		if(obj.code != 0){
			//登录失败
			callback();
			return;
		}

		let audit = obj.result.audit;
		this.isAudit = audit == 1;

		// this.isAudit = true;// test code...

		let Sygame = window["Sygame_fen"];
		//Sygame.appid = "wx606c8881777b1fc0";//换成自己的
		if (wx) {
			let data = wx.getLaunchOptionsSync();
			let temp = this;
			Sygame.getGameAuditStatus(data).then((res) => {
				temp.start(res, callback);
			});
		}
	}

	private runGame(){
		if (this.isInited) {
			this.gotoGame();
		}
		else {
			this.onConfigLoaded();
		}
	}

	private start(res,callback){
		console.log("getGameAuditStatus::", res);
		if (this.isAudit || res &&  res.status == 1001 && res.auditStatus == 1) {
			//提审的时候必现走入前置小游戏
			this.runGame();
		}
		else {
			callback();
		}
	}

	startGame(callback: Function) {
		console.log("LittleGame is startGame...");
		this.login(callback);
	}

	onConfigLoaded(): void {
		// if (Laya.Browser.onWeiXin) {
			// SoundManger.soundPath = Laya.URL.basePath = Global.inst.CdnPath;//分包资源放这个，临时的，换成自己的
		// }
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		//实例UI界面
		let res = [];
		//怪兽用到了再去加载吧，不然时间太久了
		res.push({ url: "game/cj1_3.png", type: Laya.Loader.IMAGE });
		for (let i = 1; i <= 5; i++) {
			let idxStr = i < 10 ? "0" + i : i;
			res.push({ url: "res/atlas/game/monstor/" + idxStr + ".atlas", type: Laya.Loader.ATLAS });
		}
		res.push({ url: "res/atlas/game.atlas", type: Laya.Loader.ATLAS });
		res.push({ url: "res/atlas/game/levelup.atlas", type: Laya.Loader.ATLAS });
		res.push({ url: "res/atlas/game/set.atlas", type: Laya.Loader.ATLAS });
		res.push({ url: "res/atlas/game/roles/role1.atlas", type: Laya.Loader.ATLAS });
		res.push({ url: "res/atlas/game/dizuo.atlas", type: Laya.Loader.ATLAS });
		for (let i = 1; i <= 16; i++) {
			res.push({ url: "map/" + (i < 10 ? "0" + i : i) + ".jpg", type: Laya.Loader.IMAGE });
		}

		// res.push({ url: "res/atlas/game/attackEff.atlas", type: Laya.Loader.ATLAS });

		for (let i = 0; i < res.length; i++) {
			res[i].url = Global.subPath + res[i].url;
		}

		Laya.loader.load(res, Laya.Handler.create(this, this.onLoaded));
	}

	onLoaded() {
		// console.log("6666");
		let screenW: number = Laya.Browser.clientWidth;
		let screenH: number = Laya.Browser.clientHeight;
		// console.log("screenW::", screenW, "screenH::", screenH);
		Global.inst.initScale(screenW, screenH);//适配用的，用来知道舞台的长宽和长宽比，不用每次都去取

		this.isInited = true;
		this.gotoGame();
	}

	gotoGame() {
		// Laya.Scene.root.visible = true;
		UIManager.inst.addRoStage();

		MessageManager.inst.dealMsg(0, "enter", null, Message.GAME);//这个是通知进入game这个模块，由于模块没有打开，会在列队中，当模块打开，模块的缓存消息会挨个dispatch
		GameModule.inst.open();//打开game模块  这里直接看 module/game/context/GameContext的open，然后会调用GameController的open，GameModel的open，GameView的open
	}


	closeGame() {
		// Laya.Scene.root.visible =false;
		GameModule.inst.close();
		UIManager.inst.removeToStage();
	}

	destroy() {
		GameModule.inst.destory();//这个以后就不能用了，除非不用了不然用close
		UIManager.inst.removeToStage();
	}
// }
//激活启动类
}
// new LittleGame();
window["subSheGame"] = new LittleGame(); // 加载完分包用这个 window["subSheGame"].startGame(callback)  主动关闭用  window["subSheGame"].closeGame()
