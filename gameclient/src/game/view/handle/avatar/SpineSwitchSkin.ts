// import { LogSys } from "../../../../frame/log/LogSys";

class TextureAtlasPage{
	width:number;
	height:number;
	name:string;
}

export interface IMSpineRegions{
	name:string;
	x:number;
	y:number;
	width:number;
	height:number;
}

export class TextureAtlasReader {
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

export class AtlasParser {
	public static Start(atlasText: string,out = null) {
		let reader = new TextureAtlasReader(atlasText);
		let tuple = new Array(4);
		let page = null;
		let pages = [];
		let regList:IMSpineRegions[] = [];
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
					if(out){
						out.w = page.width;
						out.h = page.height;
					}
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
				let index = parseInt(reader.readValue());

				let reg = {} as IMSpineRegions;
				reg.name = line;
				reg.x = x;
				reg.y = y;
				reg.width = width;
				reg.height = height;
				regList.push(reg);
				// console.log(line,"#",x,y,width,height);
			}
		}
		// console.log(pages);
		return regList;
	}
}

/**分帧节点 */
class SplitFrameNode{
	sourceBitmap;
	source:IMSpineRegions;
	targetBitmap;
	target:IMSpineRegions;

	public draw(){
		let texData = this.sourceBitmap.getPixels(this.source.x,this.source.y,this.source.width,this.source.height);
		this.targetBitmap.setSubPixels(this.target.x,this.target.y,this.target.width,this.target.height,texData);
		console.log(Laya.timer.currTimer + " draw >>>>",this.source.name,this.target.name);
	}
}

/**
 * 分帧控制器
 */
class SplitFrame {
	private delayTime:number = 2;
	private _list:SplitFrameNode[] = [];
	constructor(){
		// Laya.timer.frameLoop(1,this,this.onLoop);
		// Laya.timer.once(1,this)
		// Laya.timer.once(this.delayTime,this,this.onLoop);
		Laya.timer.frameLoop(this.delayTime,this,this.onLoop);
	}

	private onLoop(){
		if(this._list.length > 0){
			let cell = this._list.shift();
			cell.draw();
		}
		// Laya.timer.once(this.delayTime,this,this.onLoop);
	}

	public push(sourceBitmap, source: IMSpineRegions, targetBitmap, target: IMSpineRegions) {
		let _cell: SplitFrameNode = new SplitFrameNode();
		_cell.source = source;
		_cell.target = target;
		_cell.sourceBitmap = sourceBitmap;
		_cell.targetBitmap = targetBitmap;
		this._list.push(_cell);
	}
}
export class SubBitmapUtils {
	private static _splitFrame: SplitFrame;

	//异步分关键帧处理卡顿
	private static Draw(sourceBitmap, source: IMSpineRegions,targetBitmap,target:IMSpineRegions){
		if(sourceBitmap){
			if(!this._splitFrame){
				this._splitFrame = new SplitFrame();
			}
			// this._splitFrame.push(sourceBitmap, source,targetBitmap,target);

			let texData = sourceBitmap.getPixels(source.x,source.y,source.width,source.height);
			targetBitmap.setSubPixels(target.x,target.y,target.width,target.height,texData);
			// laya.core.接口 getTexturePixels
			
		}else{
			console.log("sourceBitmap is null!!!");
		}
	}
	
	private static getTarget(
		asset:Laya.SpineAssetManager,//被替换的Spine文件
		key:string,//资源key
		tname:string //目标中的名
		):IMSpineRegions{
		let atlas = asset.get(`${key}.atlas`);

		let regions = atlas.regions;
		let target:IMSpineRegions;
		for(let i = 0;i < regions.length;i++){
			let cell:IMSpineRegions = regions[i]
			if(cell.name==tname){
				target = cell;
				break;
			}
		}
		if(!target){
			let err = "regions[" + tname + "]not found!";
			throw Error(err);
		}
		return target;
	}

	/**从sourceBitmap取出像素填充 */
	public static Build(
		asset:Laya.SpineAssetManager,//被替换的Spine文件
		key:string,//资源key
		sourceBitmap:Laya.Texture,//素材资源句柄
		sourceList:IMSpineRegions[],//素材信息列表
		sname:string,//源中的名
		tname:string //目标中的名	
	)
	{
		let targetBitmap = asset.get(`${key}.png`).bitmap;
		let target:IMSpineRegions = this.getTarget(asset,key,tname);
		let source:IMSpineRegions;
		for(let i = 0;i < sourceList.length;i++){
			let cell:IMSpineRegions = sourceList[i];
			if(cell.name == sname){
				source = cell;
				break;
			}
		}

		if(!source){
			let err = "source[" + sname + "]not found!";
			throw Error(err);
		}
		this.Draw(sourceBitmap,source,targetBitmap,target);
	}

	/**
	 * 清理一个部位
	 */
	public static ClearPart(
		asset:Laya.SpineAssetManager,//被替换的Spine文件
		key:string,//资源key
		tname:string //目标中的名	
		)
	{
		let targetBitmap = asset.get(`${key}.png`).bitmap;
		let target:IMSpineRegions = this.getTarget(asset,key,tname);
		targetBitmap.setSubPixels(target.x,target.y,target.width,target.height,new Uint8Array(target.width*target.height * 4));
	}
	/**填充Part*/
	public static Fill(
		asset:Laya.SpineAssetManager,
		key:string,//资源ke  hero
		part:string,// weapan
		pixel:Uint8Array
	){
		let targetBitmap = asset.get(`${key}.png`).bitmap;
		let target:IMSpineRegions = this.getTarget(asset,key,part);
		targetBitmap.setSubPixels(target.x,target.y,target.width,target.height,pixel);
	}


}

// export class SpineSwitchSync{
// 	constructor(text:string){
		
// 	}
// }

//换装
export class SpineSwitchSkin {
	public fileList: IMSpineRegions[];
	// public width:number;
	// public height:number;

	private atlas:string;// = "res/spine_export/zhuangbei/skeleton.atlas";
	private _complete:Laya.Handler;
	constructor() {
    }

	public load(url: string,complete:Laya.Handler){
		this._complete = complete;
		this.atlas = url;

        Laya.loader.load(
			[
				// { url: this.zhuangbei_png, type: Laya.Loader.IMAGE },
				{ url: this.atlas, type: Laya.Loader.TEXT }
			],new Laya.Handler(this,this.onComplete));
	}


    private onComplete(){
		// let out = {w:0,h:0};
		let filelist = AtlasParser.Start(Laya.Loader.getRes(this.atlas));
		this.fileList = filelist;
		// this.width = out.w;
		// this.height = out.h;
		if(this._complete){
			this._complete.run();
		}
		// this.event(Laya.Event.COMPLETE);
	}

	// public setSkin(templet:SpineTemplet_3_8_v1,part:string){
	// let sourceBitmap:Laya.Texture = Laya.Loader.getRes(this.zhuangbei_png);
	// SubBitmapUtils.Build(templet['assetManager'],templet.fileName,sourceBitmap,this.fileList,part,part);
	// }


}