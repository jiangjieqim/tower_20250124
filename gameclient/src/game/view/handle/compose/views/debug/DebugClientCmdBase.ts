import { IDebugDecorator } from "./DebugTxtShow";

export class DebugClientCmdBase extends IDebugDecorator {
    private cmdRegMap:any = {};
    private remarkMap:any = {};
    onLoop(): void {
        // throw new Error("Method not implemented.");
    }
    // parseCmd(str: string): void {
    //     // throw new Error("Method not implemented.");
    // }
    // init() {
    //     // throw new Error("Method not implemented.");
    // }
    parseCmd(str: string): void {
        // throw new Error("Method not implemented.");
        this.target.parseCmd(str);
    }
    init() {
        // throw new Error("Method not implemented.");
        this.target.init();
        Laya.timer.frameLoop(1,this,this.onLoop);
    }
    protected regFunc(func:Function,remark:string=""){
        // if(typeof this[funcName] == "function"){
        //     this.cmdRegMap[funcName] = new Laya.Handler(this,this[funcName]);
        // }
        // else{
        //     console.error(`is not exist func:${funcName}`);
        // }
        this.cmdRegMap[func.name] = func;
        this.remarkMap[func.name] = remark;
    }
    protected printFunc(){
        console.log(`cmd func START=============================`);
        let s:string = "";
        for(let o in this.cmdRegMap){
            // console.log(`${o}`);
            let s1 = `${this.remarkMap[o]}`;
            s+="命令:"+o+"\n";
            if(s1){
                s+=`${s1}\n`;
            }
            s+="\n";
        }
        console.log(s);
        console.log(`cmd func END  =============================`);
    }

    protected rumCmd2(_cmdStr:string,p1,p2,p3,p4){
        let func:Function = this.cmdRegMap[_cmdStr];
        if(func){
            func.call(this,p1,p2,p3,p4);
            return true;
        }
    }
}