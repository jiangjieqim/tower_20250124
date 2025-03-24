import { SpineSubSkin } from "./SpineSubSkin";

function getAtlasNameBySlot(id:string){
    switch(id){
        case ESpineSlotId.HFOOT1_2:
            return "hfoot1";
        case ESpineSlotId.HFOOT2_2:
            return "hfoot1";
        // case ESpineSlotId.WING1:
        // case ESpineSlotId.WING2:
            // return "wing";
    
    }
    return id;
}
export class SpineLoadCell{
    url:string;
    slotName:string;
    // atlasKey:string;
    useImgUV:boolean;
    toString(){
        return `SpineLoadCell:: ${this.url} ${this.slotName}`;
    }
}
export class SpineLoadManager{
    private _destoryed:boolean = false;
    // pngCallBack:Laya.Handler;
    private delList:SpineSubSkin[] = [];
    private _cacheList:Laya.Handler[] = [];
    public skel:Laya.SpineSkeleton;
    /**是否是坐骑 */
    // public mHorseMode:boolean = false;
    skelurl:string;
    /**等待加载的列表 */
    private waitLoadList:SpineLoadCell[] = [];
    private callBack:Laya.Handler;
    
    /**设置插槽的纹理 */
    public pushSkin(slotName:string,url:string,useImgUV:boolean = false){
        let vo = new SpineLoadCell();
        vo.slotName = slotName;
        vo.useImgUV = useImgUV;
        vo.url = url;
        this.waitLoadList.push(vo);
    }

    /** 需要在回调结束的异步完成之后处理一次*/
    public end(){
        this.load();
        while (this._cacheList.length > 0) {
            let _node = this._cacheList.shift();
            _node.run();
        }

    }
    public load(_callBack:Laya.Handler = null){
        if(!this.skel){
            let index = this._cacheList.indexOf(_callBack);
            if(index == -1){
                if(_callBack != null){
                    this._cacheList.push(_callBack);
                }else{
                    // console.log("无需回调");
                }         
            }else{
                // console.log("找到相同的回调引用！");
            }
            // console.log("skel未初始化完成,回调句柄列表缓存的长度:"+this._cacheList.length+" waitloadList.length:"+this.waitLoadList.length);
            return;
        }
        this.callBack = _callBack;
        this.checkLoad();
    }

    /**附件是否是空数据 */
    private isAttachmentNull(skel: Laya.SpineSkeleton, slotName: string) {
        if (skel) {
            let slot: spine.Slot;
            if(skel['skeleton']){
                slot = skel.getSlotByName(slotName);//取出插槽
                if (!slot) {
                    LogSys.Warn(`1.未找到插槽 slot:${slotName}`);
                    return;
                }
                let attachment: spine.RegionAttachment = slot.getAttachment() as spine.RegionAttachment;//取出附件
                if (!attachment) {
                    return true;
                }
            }
        }
    }
    private onSpineSubSkinComplete(cell: SpineLoadCell) {
        let slotName: string = cell.slotName;
        //==========================================================
        if (this.isAttachmentNull(this.skel, slotName)) {
            //该动作中没有此附件 如horse.skel的动作13为马的待机动作,这个动作中没有角色的相关附件可以赋值的(head)
            // console.warn(">>>pngComplete 未找到可用的附件attachment slotName:"+this.slotName);
            LogSys.Warn(`2.未找到插槽${slotName} [${cell.url}],插槽必须在第一帧中可以找到`);
            SpineUtil.forEachSlot(this.skel);
        } else {
            SpineUtil.drawSkel(this.skel, cell.url, slotName, this.skelurl, cell.useImgUV);
        }
        //==========================================================
        this.checkLoad();
    }

    private checkLoad(){
        // this.waitLoadList = [];//test code
        if(!this._destoryed && this.waitLoadList.length > 0){
            let cell:SpineLoadCell = this.waitLoadList.shift();
            let sk1:SpineSubSkin = new SpineSubSkin();
            // sk1.useImgUV = cell.useImgUV;
            // sk1.skel = this.skel;
            // sk1.skelurl = this.skelurl;
            // sk1.slotName = cell.slotName;
            // sk1.url = cell.url;
            sk1.load(this,this.onSpineSubSkinComplete,cell);
            this.delList.push(sk1);
        }else{
            if(this.callBack){
                this.callBack.run();
                this.callBack = null;
            }
        }
    }
    dispose(){
        if(this._destoryed){
            return;
        }
        this._destoryed = true;
        while(this.delList.length){
            let cell = this.delList.shift();
            cell.dispose();
        }
    }
}
///////////////////////////////////////////////////////////////
export class IUvResult{
    
    u:number;
    v:number;
    u2:number;
    v2:number;
    
    //渲染的宽高
    w:number;
    h:number;
}
class TextureAtlasReader {
	private index:number = 0;
	private lines:string;
	constructor(text) {
		this.index = 0;
		this.lines = text.split(/\r\n|\r|\n/);
	}
	readLine() {
		if (this.index >= this.lines.length)
			return null;
		return this.lines[this.index++];
	}
	readValue() {
		let line = this.readLine();
		let colon = line.indexOf(":");
		if (colon == -1)
			throw new Error("Invalid line: " + line);
		return line.substring(colon + 1).trim();
	}
	readTuple(tuple) {
		let line = this.readLine();
		let colon = line.indexOf(":");
		if (colon == -1)
			throw new Error("Invalid line: " + line);
		let i = 0, lastMatch = colon + 1;
		for (; i < 3; i++) {
			let comma = line.indexOf(",", lastMatch);
			if (comma == -1)
				break;
			tuple[i] = line.substr(lastMatch, comma - lastMatch).trim();
			lastMatch = comma + 1;
		}
		tuple[i] = line.substring(lastMatch).trim();
		return i + 1;
	}
}
export interface IMSpineRegions{
	/**图集名*/
    name:string;
	x:number;
	y:number;
	width:number;
	height:number;
    origW:number;
    origH:number;
    offsetX:number;
    offsetY:number;
}

export class AtlasPage{
    regions:IMSpineRegions[];
    w:number;
    h:number;

    /**根据附件获取UV值 */
    public getUV(slotName: string): IUvResult {
        // let atlas: AtlasPage = this;
        let l = this.regions;
        let w = this.w;
        let h = this.h;
        for (let i = 0; i < l.length; i++) {
            let cell: IMSpineRegions = l[i];
            if (cell.name == slotName) {
                let uv = new IUvResult;
                //纹理的UV
                uv.u = cell.x / w;
                uv.u2 = (cell.x + cell.width) / w;

                uv.v = cell.y / h;
                uv.v2 = (cell.y + cell.height) / h;

                uv.w = cell.width;//渲染的宽高
                uv.h = cell.height;
                return uv;
            }
        }
        // console.error("not find slotName!!!:" + slotName);
        return;
    }
}
class TextureAtlasPage{
	width:number;
	height:number;
	name:string;
}
export class AtlasParserV {
    public static parse(atlasText: string):AtlasPage{
        let result:AtlasPage = new AtlasPage();
        let reader = new TextureAtlasReader(atlasText);
        let tuple = new Array(4);
        let page = null;
        let pages = [];
        let regList: IMSpineRegions[] = [];
        while (true) {
            let line = reader.readLine();
            if (line == null)
                break;
            line = line.trim();
            if (line.length == 0)
                page = null;
            else if (!page) {
                page = new TextureAtlasPage();
                page.name = line;
                if (reader.readTuple(tuple) == 2) {
                    page.width = parseInt(tuple[0]);
                    page.height = parseInt(tuple[1]);
                    result.w = page.width;
                    result.h = page.height;

                    reader.readTuple(tuple);
                }
                reader.readTuple(tuple);
                let direction = reader.readValue();
                pages.push(page);
            }
            else {
                let rotateValue = reader.readValue();
                reader.readTuple(tuple);
                let x = parseInt(tuple[0]);
                let y = parseInt(tuple[1]);
                reader.readTuple(tuple);
                let width = parseInt(tuple[0]);
                let height = parseInt(tuple[1]);
                if (reader.readTuple(tuple) == 4) {
                    if (reader.readTuple(tuple) == 4) {
                        reader.readTuple(tuple);
                    }
                }
                reader.readTuple(tuple);

                let origW = parseInt(tuple[0]);
                let origH = parseInt(tuple[1]);
                
                let index = parseInt(reader.readValue());

                let offsetX = parseInt(tuple[0]);
                let offsetY = parseInt(tuple[1]);

                let reg = {} as IMSpineRegions;
                reg.origW = origW;
                reg.origH = origH;

                reg.name = line;
                reg.x = x;
                reg.y = y;
                reg.offsetX = offsetX;
                reg.offsetY = offsetY;
                reg.width = width;
                reg.height = height;
                regList.push(reg);
                // console.log(line,"#",x,y,width,height);
            }
        }
        // console.log(pages);
        result.regions = regList
        return result;
    }
}

export class SpineUtil{
    static f_setSlotUV(_baseSkel:Laya.SpineSkeleton,url,slotName:string,_uv:IUvResult){
        return this.f_setSlot(_baseSkel,url,slotName,_uv.u,_uv.v,_uv.u2,_uv.v2,_uv.w,_uv.h);
    }
     /**打印所有的插槽 */
    public static forEachSlot(skel) {
        if(debug){
            let slots = skel.skeleton.slots;
            let str = "";
            for (let i = 0; i < slots.length; i++) {
                let slot = slots[i];
                str += (`toUpperCase:${slot.data.name.toUpperCase()} = "${slot.data.name}",\n`);
            }
            console.log("插槽\n===========================\n"+str+"===========================");
        }
    }

    // private static _equipAtlas:AtlasPage;
    private static _atlasMap = {};
    public static sell2Atlas:AtlasPage;
    
    // public static baoziAtlas:AtlasPage;

    public static fightEffectAtlas:AtlasPage;

    /**
     * 
     * @param _baseSkel 
     * @param url 
     * @param slotName 
     * @param drawSkel 
     * @param useImgUV  使用外部的纹理UV
     */
    static drawSkel(_baseSkel:Laya.SpineSkeleton,url:string,slotName:string,drawSkel:string,useImgUV:boolean){
        let _uv;
        /*
        if( slotName == ESpineSlotId.WEAPON || 
            slotName == ESpineSlotId.SHIELD ||
            slotName == ESpineSlotId.WING1 || 
            slotName == ESpineSlotId.WING2)
        {
            let tex:Laya.Texture = Laya.loader.getRes(url);
            if(!tex){
                E.debugMsgBox(`load fail for "${url}"!`);
                return;
            }
            _uv = SpineUtil.createSize(tex.width,tex.height);//创建一个定义的纹理宽高
        }
        */
        let str = getAtlasNameBySlot(slotName);
        if (!_uv) {
            let atlas:AtlasPage = this.getAtlas(drawSkel);
            _uv = atlas.getUV(str);
            if(useImgUV){
                _uv =  SpineUtil.createSize(_uv.w,_uv.h);//使用外部纹理,使用spine中的宽高
            }
        }
        if(_uv){
            this.f_setSlot(_baseSkel,url,slotName,_uv.u,_uv.v,_uv.u2,_uv.v2,_uv.w,_uv.h);
        }else{
            // console.warn("atlas drawSkel :"+slotName,'没有此图集');
        }
    }

    private static getAtlas(url:string):AtlasPage{
        // let arr = url.split(".");

        let key = url.replace(".skel",".atlas");
        if(!this._atlasMap[key]){
            let res = Laya.loader.getRes(key);
            this._atlasMap[key] = AtlasParserV.parse(res);
        }
        return this._atlasMap[key];
    }


    static init(callBack:Laya.Handler){
        // let _equipAtlasURL: string = "o/spine/common/equip.atlas";//"o/equip/equip.atlas";
        let  _fightEffectUrl:string = "o/spine/effect2/effect2.atlas";
        let  _sell2Url:string = "o/spine/sell2/sell2.atlas";
        // let  _baoziUrl:string = "o/spine/baozisell/baozisell.atlas";

        Laya.loader.load([
            // { url: _equipAtlasURL, type: Laya.Loader.TEXT },
            // { url: _heroAtlasURL, type: Laya.Loader.TEXT },
            // { url: "o/avatar/horse2/horse2.atlas", type: Laya.Loader.TEXT },


            // { url: _horseAtlasURL, type: Laya.Loader.TEXT },
            { url: _fightEffectUrl, type: Laya.Loader.TEXT },
            { url: _sell2Url, type: Laya.Loader.TEXT },

            // { url: _baoziUrl, type: Laya.Loader.TEXT }

        ], new Laya.Handler(this, () => {
            
            // this._equipAtlas = AtlasParserV.parse(Laya.loader.getRes(_equipAtlasURL));
            this.fightEffectAtlas = AtlasParserV.parse(Laya.Loader.getRes(_fightEffectUrl));
            this.sell2Atlas = AtlasParserV.parse(Laya.Loader.getRes(_sell2Url));
            // this.baoziAtlas =  AtlasParserV.parse(Laya.Loader.getRes(_baoziUrl));
            callBack.run();
        }));
        
    }
    /**
     * 
     * @param skel 骨骼数据
     * @param texName 资源key Laya.loader.getRes(texName);可取的资源key
     * @param u 
     * @param v 
     * @param u2 
     * @param v2 
     * @param sizeW 宽度
     * @param sizeH 高度
     */
    static f_setSlot(skel: Laya.SpineSkeleton, texName:string, slotName: string, u, v, u2, v2, sizeW, sizeH) {
        // let skel:Laya.SpineSkeleton = this.skel;
        // let _tex:Laya.Texture = Laya.loader.getRes(this.equipURL);
        // let tex2d = new Laya.SpineGLTexture(_tex);
        // let tex2d  = _tex;

        // this.forEachSlot(skel);
        // let b1 = tex2d.bitmap["_bitmap"];
        // console.log(b1._id,b1._url,this.slotName);
        // console.log(tex2d);
        if(!skel){
            return;
        }

        let slot: spine.Slot;
        if(skel['skeleton']){
            slot = skel.getSlotByName(slotName);//取出插槽 
        }
        if(!slot){
            LogSys.Warn(`未找到插槽 slot:${slot} ,slotName:${slotName}`);
            return;
        }
        let attachment: spine.RegionAttachment = slot.getAttachment() as spine.RegionAttachment;//取出附件

        //修改附件上的纹理
        const region = new spine.TextureAtlasRegion();
        region.width = sizeW;
        region.height = sizeH;
        region.originalWidth = sizeW;
        region.originalHeight = sizeH;
        region.rotate = false;

        region.u = u //;/ this._atlasPage.w;//0;
        region.v = v //;/ this._atlasPage.h;//0;
        region.u2 = u2;//;/ this._atlasPage.w;//1;//132/168;
        region.v2 = v2; //;/ this._atlasPage.h;//1;
        /*
            纹理的uv示意图
             u v(0,0)
                 _____________
                |u            |
                |             |
                |            v|
                |_____________| u2 v2(1,1)
        */
        // region.texture = tex2d as any;
        region["texName"] = texName;
        region.renderObject = region;
        if(!attachment){
            // console.warn("attachment f_setSlot:"+slotName);

            // Laya.timer.callLater(this,()=>{
            // });
            // Laya.timer.once(100,this,()=>{
            // this.f_setSlot(skel,texName,slotName,u,v,u2,v2,sizeW,sizeH);
            // })

            //LogSys.Warn(`slotName:${slotName} attachment is null.`);
            return;
        }
        attachment.region = region;
        attachment.width = sizeW;
        attachment.height = sizeH;
        if (attachment instanceof spine.MeshAttachment) {
            if(!attachment.region['texture']){
                LogSys.Warn("txtName:"+texName+" slotName:"+slotName+" `s texture is null");
            }else{
                attachment.updateUVs();
            }
        } else {
            attachment.setRegion(region);
            attachment.updateOffset();
        }
        return true;
    }

    static createSize(w: number, h: number) {
        let uv = new IUvResult();
        uv.w = w;
        uv.h = h;
        uv.u = 0;
        uv.v = 0;
        uv.u2 = 1;
        uv.v2 = 1;
        return uv;
    }
}


/**插槽枚举 */
export enum ESpineSlotId{
    // WOODMAN = "woodman",
    // YING = "ying",
    // WING2 = "wing2",
    // WING1 = "wing1",

    /**武器 */
    WEAPON = "weapon",
    
    FOOT1 = "foot1",
    FOOT2 = "foot2",
    BODY = "body",
    HEAD = "head",
    /*盾牌*/
    SHIELD = "shield",
    DAOGUANG = "daoguang",

    XINXIN = "xinxin",
    XINXIN2 = "xinxin2",
    XINXIN3 = "xinxin3",
    XINXIN4 = "xinxin4",

    ///////////////////////////////////////////
    /**坐骑的插槽 */
    HFOOT1_2 = "hfoot1_2",
    HFOOT2_2 = "hfoot2_2",
    HTAIL = "htail",
    FOOT_M = "foot_m",
    HBODY = "hbody",
    HNECK = "hneck",
    HFOOT2 = "hfoot2",
    HFOOT1 = "hfoot1",
    HHEAD = "hhead",
    DAOGUANG2 = "daoguang2",
    ///////////////////////////////////////////

    /**武馆的插槽 */
    QUAN1 = "quan1",
    QUAN2 = "quan2",
    QUAN3 = "quan3",
    QUAN4 = "quan4",
    HIT1 = "hit1",
    HIT2 = "hit2",
    TEA = "tea",

}