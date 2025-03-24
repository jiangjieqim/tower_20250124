import { StorageUtil } from "../../../frame/util/StorageUtil";
import { StaticDataMgr } from "../../static/StaticDataMgr";

/**语言类型*/
enum ELanguage {
    English = 0,// 英语
    Chinese = 1,// 繁体中文
}

export class LanguageManager {
    constructor() { }
    private _hasInit: boolean = false;
    public Init(): boolean {
        if (this._hasInit) return false;
        this._hasInit = true;
        // this.GetLanguageStorage();
        return true;
    }

    public Clear() {

    }

    /**设置语言缓存 */
    private SetLanguageStorage() {
        StorageUtil.SetNum(StorageUtil.Language, this.language, true);
    }

    /**获取语言缓存 */
    private GetLanguageStorage() {
        let newLan: number = StorageUtil.GetNum(StorageUtil.Language, true);
        this.IsSameLanguage(newLan as ELanguage);
    }

    // 语言类型
    private language: ELanguage = ELanguage.Chinese;
    public get Language() {
        return this.language;
    }
    public SetLanguage(lang: ELanguage) {
        this.language = lang;
        this.SetLanguageStorage();
        this.ClearLanguageCatch();
    }
    /**是否是中文 */
    public get IsChinese(): boolean { return this.Language == ELanguage.Chinese; }

    // 语言数据
    // private languageJson = null;
    // public get LanguageJson() {
    //     if (this.languageJson == null) {
    //         this.languageJson = LoadUtil.GetJson(ResPath.Font.Language);
    //     }
    //     return this.languageJson;
    // }
    // 中文数据
    // private chineseJson = null;
    // public get ChineseJson() {
    //     if (this.chineseJson == null) {
    //         this.chineseJson = LoadUtil.GetJson(ResPath.Font.Chinese);
    //     }
    //     return this.chineseJson;
    // }
    // 英文数据
    // private englishJson = null;
    // public get EnglishJson() {
    //     if (this.englishJson == null) {
    //         this.englishJson = LoadUtil.GetJson(ResPath.Font.English);
    //     }
    //     return this.englishJson;
    // }

    private _lang;
    public get Lang(){
        if(!this._lang){
            this._lang = Laya.loader.getRes(StaticDataMgr.Ins.langKey);//LoadUtil.GetJson(ResPath.Font.Lang);
            // let str = t_Txt_Config.Ins.replace(JSON.stringify(this._lang));
            let str = JSON.stringify(this._lang);
            this._lang = JSON.parse(str);
        }
        return this._lang;
    }

    rebuild(){
        this._lang = null;
    }

    // 语言配置
    // private languageData = null;
    public get LanguageData() {
        /*
        if (this.languageData == null) {
            this.languageData = this.ChineseJson;
            if (!this.IsChinese) {
                this.languageData = this.EnglishJson;
            }
        }
        return this.languageData;
        */
        return this.Lang;
    }

    /**是否是相同的语言 */
    public IsSameLanguage(newLang: ELanguage): boolean {
        if (newLang == this.language) {
            return true;
        }
        this.SetLanguage(newLang);
        return false;
    }

    

    /**获取语言文本 */
    // public GetLanguageLabel(key: string) {
    //     return this.LanguageData[key];
    // }

    // /**
    //  * 获取UI组中的语言包数据
    //  */
    // public getLang(type: EViewType, key: string): string {
    //     let v: ViewBase = E.ViewMgr.Get(type) as ViewBase;
    //     if (v.Language) {
    //         let str = v.Language[key];
    //         if (str) {
    //             return str;
    //         }
    //     }
    //     return key;
    // }


    public getLang(key: string,...args: any[]):string {
        let str = this.Lang[key];
        return StringUtil.format(str || key,args);
    }

    public getLangArr(key: string,args: any[]):string {
        let str = this.Lang[key];
        for (let i = 0; i < args.length; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}"), args[i]);//"gm"
        }
        return str;
    }

    // 公共文本
    // private _common;
    // public get Common() {
    //     if (this._common == null) {
    //         this._common = this.LanguageData[LanguageDefine.View.Common];
    //     }
    //     return this._common;
    // }

    // 提示文本
    // private _tip;
    // public get Tip() {
    //     if (this._tip == null) {
    //         this._tip = this.LanguageData[LanguageDefine.View.Tip];
    //     }
    //     return this._tip;
    // }

    // 标题文本
    // private _title;
    // public get Title() {
    //     if (this._title == null) {
    //         this._title = this.LanguageData[LanguageDefine.View.Title];
    //     }
    //     return this._title;
    // }

    // 文本信息
    // private _textDefine;
    // public get TextDefine() {
    //     if (this._textDefine == null) {
    //         this._textDefine = this.LanguageData[LanguageDefine.View.TextDefine]
    //     }
    //     return this._textDefine;
    // }
    // 清理语言缓存
    private ClearLanguageCatch() {
        // this._common = null;
        // this._tip = null;
        // this._title = null;
        // this._textDefine = null;
        // this.languageData = null;
    }
}

/**语言定义类 */
export namespace LanguageDefine {
    // 页面定义
    export class View {
        // public static readonly Common: string = "Common";
        // public static readonly Tip: string = "Tip";
        // public static readonly Title: string = "Title";
        // public static readonly TextDefine: string = "TextDefine";

        // public static readonly Login: string = "Login";
    }

    //公共
    export class Common {
        public static readonly Sure = "Sure";//确定
        public static readonly Cancel = "Cancel";//取消
        public static readonly Tip = "Tip";//提示
    }

    //提示
    export class Tip {
        public static readonly MSG_SOCKETERROR = "MSG_SOCKETERROR";//网络链接错误
        public static readonly MSG_SOCKETCLOSED = "MSG_SOCKETCLOSED";//网络链接关闭

        public static readonly RegistSuccess = "RegistSuccess";//註冊失敗提示
        public static readonly NoAccount = "NoAccount";//账号不存在
        public static readonly PasswordError = "PasswordError";//账号不存在
        public static readonly AccountStopUseing = "AccountStopUseing";//账号停用中
        public static readonly LoginFailed = "LoginFailed";//登錄失敗提示

        public static readonly NotYetOpen = "NotYetOpen";//暂未开放
    }

    //标题文本
    export class Title {
        
    }

    //文本定义
    export class TextDefine {
        // 错误文本
        public static readonly KickNotify = "KickNotify";//踢出提示
        
        public static readonly EmptyName = "EmptyName";//踢出提示
    }

    /**登录页面*/
    export class Login {
        // public static readonly LoginTitle = "LoginTitle";
        // public static readonly InputAcc = "InputAcc";
        // public static readonly InputPwd = "InputPwd";
        // public static readonly LangCN = "LangCN";
        // public static readonly LangEN = "LangEN";
        // public static readonly LoginBtn = "LoginBtn";
        // public static readonly ClickLabel = "ClickLabel";
        // public static readonly GotoRegistLabel = "GotoRegistLabel";
        // public static readonly RegistTitle = "RegistTitle";
        // public static readonly RegistBtn = "RegistBtn";
        // public static readonly HasRegistTip = "HasRegistTip";
        // public static readonly EnterAccPwd = "EnterAccPwd";
    }



}