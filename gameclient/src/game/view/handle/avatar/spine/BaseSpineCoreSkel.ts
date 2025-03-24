// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { GameConfig } from "../../../../../GameConfig";
import { AnimConfig } from "../../../../../InitConfig";
import { ITowerMonster } from "../../compose/views/ITowerMonster";
import { EAvatarDir } from "../AvatarView";
import { EAvatarAnim } from "../vos/EAvatarAnim";
import { SpineFactory } from "./SpineFactory";
import { SpineLoadManager } from "./SpineManager";
import { ESpineTemplateType, SpineTemplateCache, TemplateCache } from "./SpineTemplateCache";
// interface ISpineSkel{
// 	_currAniName;
// 	_playStart;
// 	_playEnd;
// 	_templet;
// 	_duration;
// }
export class BaseSpineCoreSkel extends Laya.EventDispatcher implements ITowerMonster{
	// rateSpeed:number;
    animpause() { 
    }
    animplay() {
    }
	/**播放结束 */
	public static PLAY_END:string = "PLAY_END";
	destroyed:boolean = false;
	url:string;//.skel链接
	private needDel:boolean = false;
	public templet: Laya.SpineTemplet;
    public skeleton: Laya.SpineSkeleton;
    public anim: EAvatarAnim = EAvatarAnim.TowerIdle;//NormalStand
	private readonly useCache:boolean = GameConfig.spineCache;
	private _currentTime:number = 0;
	private target;
	private callBack;
	private args;
	private _once:boolean = false;
	private _initStop:boolean = false;
    private _dir:EAvatarDir;
	private isLoading:boolean = false;
	curScale:number = 1.0;
    public get duration():number{
        if(this.skeleton){
		    return this.skeleton['_duration'];
        }
        return 0;
	}
    
	// private checkCurrentTtime(value:number){
	// 	let skel:ISpineSkel = this.skeleton as any
	// 	if(skel){
	// 		if (!skel._currAniName || !skel._templet)
	// 			return value * 1000;
	// 		value /= 1000;

	// 		if (value < skel._playStart || (!!skel._playEnd && value > skel._playEnd) || value > skel._duration){
	// 			// throw new Error("AnimationPlayer: value must large than playStartTime,small than playEndTime.");
	// 			value = skel._duration;
	// 		}
	// 	}
	// 	return value  * 1000;
	// }


	/**设置动画跳转到具体(秒) */
	public set currentTime(v:number){
		// v = this.checkCurrentTtime(v);
		if(this.skeleton){
			// this.skeleton.
			this.skeleton.currentTime = v * 1000;
		}
		this._currentTime = v;
	}
	/**当前播放所在的的时间(秒)*/
	public get currentPlayTime():number{
		// currentTime
		return this.skeleton["currentPlayTime"];
	}
    /**控制代理 */
    protected loadProxy: SpineLoadManager = new SpineLoadManager();
    public start(){

    }
    constructor() {
        super();
        // this.setWingSkin(0);
    }
	updateScale(v: number) {
		this.curScale = v;
		if(this.skeleton && !this.destroyed){
			this.skeleton.scaleX = this.curScale;
			this.skeleton.scaleY = this.curScale;
		}
	}
    //'o/avatar/hero/hero.skel'
	// protected newTemplate(){
	// return new Laya.SpineTemplet(Laya.SpineVersion.v3_8);
	// }
    public load(url: string) {
		if(this.isLoading){
			return;
		}
		this.url = url;
        this.isLoading = true;
		// this.loadProxy.mHorseMode = url.indexOf("horse") != -1;
		this.loadProxy.skelurl = url;
		// LogSys.Log(`BaseSpineCoreSkel load:${url}`);
		let type:ESpineTemplateType = ESpineTemplateType.Normal;
		if(this.useCache){
			SpineTemplateCache.Ins.getTemp(url,this,this.onLoadFinish,type);
		}else{
			let _templet: Laya.SpineTemplet = SpineFactory.createByType(type);//this.newTemplate();
			this.templet = _templet;
			_templet.once(Laya.Event.COMPLETE, this, this.onTemplateComplete);
			_templet.loadAni(url);
		}
	
	}
    public playbackRate(v:number){
		// this.rateSpeed = v;
		if(this.skeleton){
			this.skeleton.playbackRate(v);
		}
	}
    protected free(){

	}
	public dispose(){
		this.curScale = 1.0;
		this.destroyed = true;
		this.free();
		this.isLoading = false;
		this.stop();
		this.loadProxy.dispose();
		if (this.useCache) {
			// if(this.templet){
			if(this.skeleton){
				spineRes.free(this.skeleton);
			}
		} else {
			if (this.templet) {
				this.templet.destroy();
			}
			if (this.skeleton) {
				this.skeleton.destroy();
			}
		}

		if(!this.skeleton){
			this.needDel = true;
		}

		this.templet = null;
		this.skeleton = null;
	}
    public stop(){
		if(this.skeleton){
			this.skeleton.stop();
		}
		this._initStop = true;
    }
	/**加载解析处理完成 */
    protected onLoadFinish(cache:TemplateCache){
		let skel: Laya.SpineSkeleton
		if(cache){
        	skel = cache.skel;
			this.templet = cache.temp;
		}else{
			if(this.templet){
				skel = this.templet.buildArmature();
			}
		}

		if(!this.templet){
            return;
        }

        this.skeleton = skel;

        this.skeleton.pos(0,0);
		this.skeleton.playbackRate(AnimConfig.AnimScale);
		this.skeleton.scaleX = this.curScale;
		this.skeleton.scaleY = this.curScale;
		if(this._initStop){
			this.stop();
		}else{
			if(this.anim != EAvatarAnim.Invalid){
				this.play(this.anim,this.target,this.callBack,this.args,this._once);
			}
		}
		if(this._dir){
			this.dir = this._dir;
		}
		this.currentTime = this._currentTime;

        this.loadProxy.skel = skel;
        this.loadProxy.end();
        

		if(this.needDel){
			this.dispose();
		}
        // if(debug){
        //     let spr = new Laya.Sprite();
        //     spr.graphics.drawCircle(0,0,5,null,"#ff0000",1);
        //     this.skeleton.addChild(spr);
        // }
		DebugUtil.draw(this.skeleton,"#ff0000");
		Laya.timer.callLater(this,this.onLaterHandler);
	}

	private onLaterHandler(){
		this.event(Laya.Event.COMPLETE);
	}

    private onTemplateComplete() {
		Laya.timer.callLater(this,this.onLoadFinish);
    }

    public set dir(v:EAvatarDir){
		if(this.skeleton){
			if(this.skeleton.getStyle()){
				this.skeleton.scaleX = (v || EAvatarDir.Left)*this.curScale;
				this.skeleton.scaleY = this.curScale;
			}else{
				LogSys.Error(this.url + " style is null");
			}
		}
		this._dir = v;
	}
	public get dir(){
		return this._dir;
	}
	/**根据动画索引获取动画的播放时间 */
	getDurationByAnimIndex(index:number){
		if(this.skeleton){
			let aniName = this.skeleton.getAniNameByIndex(index);
			if(aniName){
				let anim = this.skeleton['state'].data.skeletonData.findAnimation(aniName);
				if(anim){
					return anim.duration;
				}
			}
		}
		return 0;
	}
     /**
	 * 播放动画
	 * @param anim number动画索引从0开始
	 * @param target 函数域
	 * @param callBack function
	 * @param args 参数数组类型
	 * @param _once boolean 是否只播放一次
	 * @param isForce boolean 是否覆盖当前的动画
	 * @param isLoop boolean 动画是否循环
	 */
	public play(anim: EAvatarAnim, target?, callBack?, args?, _once: boolean = false,isForce:boolean = false,isLoop:boolean = false) {
		if(args && !Array.isArray(args)){
			LogSys.Error(`args type is err ` + this.url);
		}

		if(anim == EAvatarAnim.Invalid){
			LogSys.Warn(this.url+" Invalid anim");
			return;
		}
        if(this.skeleton){
            if(anim + 1 > this.skeleton.getAnimNum()){
                LogSys.Error(`${this.url}动作没有${anim},anim num:${this.skeleton.getAnimNum()}`);
				return;
            }
        }
		let force: boolean = isForce;//同动作的是否覆盖
		// this._percentStart = _percentStart;
		this.anim = anim;
		this.target = target;
		this.callBack = callBack;
		this.args = args;
		this._once = _once;
		if (this.skeleton) {
			// let _need = false;
			let _start: number = 0;
			// if(!isNaN(this.duration)){
			// _start = _percentStart * this.duration * 1000;
			// }else{
			// _need = true;
			// }
			if (_once) {
				// this.skeleton.once(Laya.Event.STOPPED, target, callBack, args);
				this.runOnce(target, callBack, args);
				this.skeleton.play(this.anim, isLoop, force,_start);
			} else {
				if (target) {
					// this.skeleton.once(Laya.Event.STOPPED, target, callBack, args);
					this.runOnce(target, callBack, args);
					this.skeleton.play(anim, false, force,_start);	//不循环
				} else {
					this.skeleton.play(anim, true, force,_start);	//播放循环动画
					// LogSys.Warn(`播放循环动画:${this.url}-->${anim}`);
				}
			}
			// if(_need){
			// this.currentTime = _percentStart * this.duration;
			// }
			return this.duration;
		}
		return 0;
	}

	private runOnce(target, callBack:Function, args){
		this.skeleton.once(Laya.Event.STOPPED, this, this.onPlayEnd, [target, callBack, args]);
	}

	private onPlayEnd(target,callBack:Function,args){
        if (!this.destroyed && callBack) {
			// callBack.call(target,args ? args[0] : null);
			callBack.apply(target,args);
        }
    }
	/**为插槽设置纹理 */
	setSlotSkin(slot:string,url:string,useImgUV:boolean=false){
		this.loadProxy.pushSkin(slot, url,useImgUV);
		this.loadProxy.load();
	}
	/**单独的图替换spine */
	setSlotImg(slot:string,url:string){
		this.setSlotSkin(slot,url,true);
	}
	
}
