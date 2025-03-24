import { EMsgBoxType } from "../common/defines/EnumDefine";
import { E } from "../G";

export class ZipJson {
    public static BOLD: string = "BOLD";
    private o;
    private _json;
    public name: string;
    /**是否ui */
    public isUI: boolean;
    constructor(name: string, o) {
        this.o = o;
        this.name = name;
    }

    public getJson() {
        if (!this._json) {
            let ab: ArrayBuffer = this.o.asArrayBuffer();
            let b1 = new Laya.Byte();
            b1.writeArrayBuffer(ab);
            b1.pos = 0;
            let str = b1.readUTFBytes();

            str = StringUtil.replaceComments(str);
            if (this.isUI) {
                let _newFont = E.sdk.convertFont(ZipJson.BOLD);
                str = str.replace(/\"font\":\"BOLD\"/g, `\"font\":\"${_newFont}\"`);
                str = str.replace(/\"font\":\"Bold\"/g, `\"font\":\"${_newFont}\"`);
                str = str.replace(/\"font\":\"bold\"/g, `\"font\":\"${_newFont}\"`);

                _newFont = E.sdk.convertFont("fz");
                str = str.replace(/\"font\":\"fz\"/g, `\"font\":\"${_newFont}\"`);

                this.checkStr(str);

                // str = t_Txt_Config.Ins.replace(str);
            }
            let json = JSON.parse(str);
            this._json = json;
        }
        return this._json;
    }

    private checkStr(str: string) {
        let strlist = ["战鼓", "击鼓"];
        for (let i = 0; i < strlist.length; i++) {
            // if(str.indexOf("战鼓")!=-1 || str.indexOf("击鼓")!=-1){
            let badStr = strlist[i];
            if (str.indexOf(badStr) != -1){
                LogSys.Error(badStr + " find..............." + this.name);
                if (debug) {
                    E.ViewMgr.ShowMsgBox(EMsgBoxType.OnlyOk, "异常字符串:" + this.name + " " + badStr);
                }
            }  
        }
    }
}
