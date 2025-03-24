import { SpineTemplet_3_8_v1 } from "../SpineTemplet_3_8_v1";
import { SpineFactory } from "./SpineFactory";
let GUID:number = 0;

class FuncCallBackVo{
    func:Function;
    that;
    run(_node:V38_TemplateNode){
        if(this.that){
            this.func.call(this.that,_node);
        }
        this.func = null;
        this.that = null;
    }
}

export class V38_TemplateNode{
    /** 当前模板对象中 使用的骨骼对象列表*/
    skelList:Laya.SpineSkeleton[] = [];

    /**是否已经加载完成 */
    isLoaded:boolean;
    listcallBack:FuncCallBackVo[] = [];
    doCacheFunc(){
        while(this.listcallBack.length> 0){
            let cell = this.listcallBack.shift();
            cell.run(this);
        }
    }

    url:string;
    // used:boolean;
    template:Laya.SpineTemplet;
    guid:number;
    toString(){
        let _str:string = "";
        for(let i = 0;i < this.skelList.length;i++){
            _str+=this.skelList[i].name;
            if(i < this.skelList.length -1){
                _str+=",";
            }
        }
        return `V38_TemplateNode guid:${this.guid} url ${this.url} is ${this.template instanceof SpineTemplet_3_8_v1 ? "3_8" : "0"} have skel num:${this.skelList.length} ${this.skelList.length <= 0 ?"can gc this node":""}  [${_str}]`;
    }

    delBySkel(skel:Laya.SpineSkeleton){
        // this.skelList.findIndex(skel);
        let index = this.skelList.indexOf(skel);
        let str = `V38_TemplateNode delBySkel guid:${this.guid} skel name:${skel.name}`;
        if(index!=-1){
            this.skelList.splice(index,1);
            // LogSys.Warn(`V38_TemplateNode delBySkel guid: ${this.guid} skel name:${skel.name}`);
            LogSys.Warn(str + " ok");
        }else{
            // LogSys.Error("V38_TemplateNode delBySkel fail!");
            LogSys.Error(str + " fail");
        }
    }

    free(){
        this.template.destroy();
    }
}

export class V38_TemplateListCache{
    
    get list():V38_TemplateNode[]{
        return this.l1;
    }
    private l1:V38_TemplateNode[] = [];
    private static _ins: V38_TemplateListCache;

    public static get Ins() {
        if (!this._ins) {
            this._ins = new V38_TemplateListCache();
        }
        return this._ins;
    }

    loadAni(url:string,that,func:Function,_clsType:number){
        for(let i = 0;i < this.l1.length;i++){
            let cell= this.l1[i];
            if(cell.url == url){
                // return cell.template;
                // cell.used = true;

                if(cell.isLoaded){
                    LogSys.Log("V38_TemplateListCache USE Cache " + cell.toString());
                    func.call(that,cell);
                }
                else{
                    let _vo = new FuncCallBackVo();
                    _vo.that = that;
                    _vo.func = func;
                    cell.listcallBack.push(_vo);
                }
                return;
            }
        }

        let _node = new V38_TemplateNode();
      
        _node.url = url;
        _node.guid = GUID;
        _node.listcallBack = [];
        GUID++;
        this.l1.push(_node);

        let _templet:Laya.SpineTemplet = SpineFactory.createByType(_clsType);
 
        _node.template = _templet;
        _templet.once(Laya.Event.COMPLETE, this, this.onTemplateComplete,[_templet,that,func,_node]);
        _templet.loadAni(url);
    }

    private onTemplateComplete(_templet:Laya.SpineTemplet,that,func:Function,_node:V38_TemplateNode){
        LogSys.Log("V38_TemplateListCache new " + _node.toString());
        _node.isLoaded = true;
        func.call(that,_node);
        _node.doCacheFunc();
    }

    // free(_templet:Laya.SpineTemplet,skel:Laya.SpineSkeleton){
    //     for(let i = 0;i < this.l1.length;i++){
    //         let cell= this.l1[i];
    //         if(cell.template == _templet){
    //             // cell.used = false;
    //             LogSys.Log(" V38_TemplateListCache free " + cell.toString());


    //             return;
    //         }
    //     }
    //     LogSys.Error("not find temp!");
    // }

    GC(){
        // while(this.l1.length > 0){
        //     let cell:V38_TemplateNode = this.l1.shift();
        //     LogSys.Warn("V38_TemplateListCache GC:" + cell.toString());
        //     cell.free();
        // }

        let delList:V38_TemplateNode[] = [];
        let resl = [];
        for(let i = 0;i < this.l1.length;i++){
            let cell:V38_TemplateNode = this.l1[i];
            if(cell.skelList.length <=0){
                // cell.free();
                delList.push(cell);
            } else {
                resl.push(cell);
            }
        }
        while (delList.length > 0) {
            let cell = delList.shift();
            cell.free();
        }
        this.l1 = resl;
    }
}