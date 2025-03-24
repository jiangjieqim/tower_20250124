// import { AnimConfig } from "../../../../InitConfig";
// import { EAvatarDir } from "./AvatarView";
// import { SpineTemplet_3_8_v1 } from "./SpineTemplet_3_8_v1";
// import { EAvatarAnim } from "./vos/EAvatarAnim";
// import SpineTemplet = Laya.SpineTemplet;//3.8之后特有的，适用结尾为.skel的资源
// import SpineSkeleton = Laya.SpineSkeleton;
// export class BaseSpineAvatar extends Laya.EventDispatcher{
// 	private _dir:EAvatarDir;
// 	private url:string;

// 	public templet:SpineTemplet_3_8_v1;	//SpineTemplet
//     public skeleton:SpineSkeleton;//骨骼
// 	public anim: EAvatarAnim = EAvatarAnim.NormalStand;
// 	private _currentTime:number = 0;
// 	private target;
// 	private callBack;
// 	private args;
// 	private _once:boolean = false;
// 	private _initStop:boolean = false;
// 	// private _percentStart:number = 0;
// 	// private container:Laya.Sprite;
// 	/**当前动作总时间(秒) */
//     public get duration():number{
// 		if(this.skeleton){
// 			return this.skeleton['_duration'];
// 		}
// 		return 0;
// 	}

// 	/**设置动画跳转到具体(秒) */
// 	public set currentTime(v:number){
// 		if(this.skeleton){
// 			this.skeleton.currentTime = v * 1000;
// 		}
// 		this._currentTime = v;
// 	}
// 	/**当前播放所在的的时间(秒)*/
// 	public get currentPlayTime():number{
// 		// currentTime
// 		return this.skeleton["currentPlayTime"];
// 	}
//     constructor(){
// 		super();
// 	}
// 	public load(url:string){
// 		this.url = url;
// 		this.start();
// 		// this.parseComplete();
// 	}

// 	public stop(){
// 		if(this.skeleton){
// 			this.skeleton.stop();
// 		}
// 		this._initStop = true;
// 		// this.skeleton.destroy();
// 		// this.skeleton = null;
// 		// FashionModel.Ins.recoverTemplate(this.templet,this.url);
// 		// this.templet.destroy();
// 		// this.templet = null;
// 	}

// 	public start(){
// 		if(!this.templet){
// 			// this.templet = FashionModel.Ins.getTemplatePool(this.url);
// 			this.templet = new SpineTemplet_3_8_v1();
// 			this.templet.loadAni(this.url);
//             this.templet.once(Laya.Event.COMPLETE, this, this.parseComplete);
// 			this.templet.once(Laya.Event.ERROR, this, this.onError);
// 		}
// 	}

//     private onError(){
//         console.log("SpineTemplet_3_8_v1 parse error");
//     }

// 	public set dir(v:EAvatarDir){
// 		if(this.skeleton){
// 			this.skeleton.scaleX = v;
// 		}
// 		this._dir = v;
// 	}

// 	public playbackRate(v){
// 		this.skeleton.playbackRate(v);
// 	}

//     private parseComplete(): void {
//         this.skeleton = this.templet.buildArmature();
// 		this.skeleton.pos(0,0);
// 		this.skeleton.playbackRate(AnimConfig.AnimScale);
// 		this.dir = this._dir;
// 		if(this._initStop){
// 			this.stop();
// 		}else{
// 			this.play(this.anim,this.target,this.callBack,this.args,this._once);
// 		}
// 		this.currentTime = this._currentTime;
// 		this.event(Laya.Event.COMPLETE);
//     }

// 	public dispose(){
// 		this.stop();
// 		this.templet.destroy();
// 		// this.templet = null;
// 		this.skeleton.destroy();
// 		// this.skeleton = null;
// 	}

// 	/**
// 	 * 播放动画
// 	 * @param anim number动画索引从0开始
// 	 * @param target 函数域
// 	 * @param callBack function
// 	 * @param args 参数
// 	 * @param _once boolean 是否只播放一次
// 	 * @param _percentStart从百分比多少位置开始播放 0~1
// 	 */
// 	public play(anim: EAvatarAnim, target?, callBack?, args?, _once: boolean = false) {
// 		let force: boolean = false;//同动作的是否覆盖
// 		// this._percentStart = _percentStart;
// 		this.anim = anim;
// 		this.target = target;
// 		this.callBack = callBack;
// 		this.args = args;
// 		this._once = _once;
// 		if (this.skeleton) {
// 			// let _need = false;
// 			let _start: number = 0;
// 			// if(!isNaN(this.duration)){
// 			// _start = _percentStart * this.duration * 1000;
// 			// }else{
// 			// _need = true;
// 			// }
// 			if (_once) {
// 				this.skeleton.once(Laya.Event.STOPPED, target, callBack, args);
// 				this.skeleton.play(this.anim, false, force,_start);
// 			} else {
// 				if (target) {
// 					this.skeleton.once(Laya.Event.STOPPED, target, callBack, args);
// 					this.skeleton.play(anim, false, force,_start);	//不循环
// 				} else {
// 					this.skeleton.play(anim, true, force,_start);	//播放循环动画
// 				}
// 			}
// 			// if(_need){
// 			// this.currentTime = _percentStart * this.duration;
// 			// }
// 			return this.duration;
// 		}
// 		return 0;
// 	}
// }