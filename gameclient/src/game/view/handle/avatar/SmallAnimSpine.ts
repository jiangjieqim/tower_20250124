import { ISpineTempletTower } from "./spine/ISpineTemplet";
import { SpineFactory } from "./spine/SpineFactory";
import { ESpineTemplateType, SpineTemplateCache, TemplateCache } from "./spine/SpineTemplateCache";

export class SmallAnimSpine{

    public skeleton:Laya.SpineSkeleton;
    public templet:ISpineTempletTower;
	//=========================================
    // private readonly useCache:boolean = GameConfig.spineCache;//使用缓存
	
	useSpineCache:boolean = false;
	
	private isLoading:boolean = false;
	private that;
	private callBack:Function;

	public dispose(){
        this.isLoading = false;
		this.that = null;
		this.callBack = null;
		if(this.skeleton){
			this.skeleton.offAll(Laya.Event.LABEL);
		}
		if (this.useSpineCache) {
			// if(this.templet){
			if(this.skeleton){
				spineRes.free(this.skeleton);
			}
		} else {
            if(this.skeleton){
                this.skeleton.stop();
                this.skeleton.destroy();
            }
			if(this.templet){
            	this.templet.destroy();
			}
		}

        this.templet = null;
        this.skeleton = null;
	}

	load(url:string,that,callBack:Function){
		this.that = that;
		this.callBack = callBack;
        if(this.isLoading){
			return;
		}
        this.isLoading = true;
		let type:ESpineTemplateType = ESpineTemplateType.Ver_3_8;
        if(this.useSpineCache){
			SpineTemplateCache.Ins.getTemp(url,this,this.onLoadFinish,type);
		}else{
			let _templet:ISpineTempletTower = SpineFactory.createByType(type);//new SpineTemplet_3_8_v1();//new SpineTempletTower();
			this.templet = _templet;
			_templet.once(Laya.Event.COMPLETE, this, this.onTemplateComplete);
			_templet.loadAni(url);
		}
    }
	toString(){
		if(this.templet){
			return this.templet.jsonOrSkelUrl||"";
		}
        return "";
    }

    private onTemplateComplete() {
		Laya.timer.callLater(this,this.onLoadFinish);
    }
    private onLoadFinish(cache:TemplateCache){
        let skel: Laya.SpineSkeleton;
		if(cache){
        	skel = cache.skel;
			this.templet = cache.temp as any;
		}else{
			if(this.templet){
				skel = this.templet.buildArmature();
			}
		}
		if(!this.templet){
            return;
        }
        this.skeleton = skel;

		DebugUtil.drawCross(skel,undefined,undefined,undefined,"#00ff00");

		if(this.that){
			this.callBack.call(this.that,this);
			this.that = null;
			this.callBack = null;
		}
	}
}