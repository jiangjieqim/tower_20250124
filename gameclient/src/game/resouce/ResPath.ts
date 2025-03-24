import { InitConfig } from "../../InitConfig";
import { E } from "../G";

export class Path{
    public static GetUI(url:string){
        return `views/${url}`;
    }
    public static GetAtlas(url: string) {
        return `res/atlas/remote/${url}`;
    }
}
export enum EResPath{
    LANG_CN = `o/font/lang.json`,
    UI = `o/config/export/ui.bin`
}
/**资源路径辅助*/
export module ResPath {
    export class Avatar {
        //基础骨架
        public static get baseSkel(){
            let u:string = E.gameAdapter.heroAnim;
            return `o/avatar/${u}/${u}.skel`;
        }
        public static get baseImg() {
            return this.baseSkel.replace(".skel", ".png");
        }
        public static get baseAtlas(): string {
            return this.baseSkel.replace(".skel", ".atlas");
        }
        //马
        // public static baseImg:string = `o/avatar/horse/enemy.png`;
        // public static baseAtlas:string = `o/avatar/horse/enemy.atlas`;
        // public static baseSkel:string = `o/avatar/horse/enemy.skel`;

        //套装骨架
        public static equipAtlas: string = `o/equip/equip.atlas`;
        public static equipSkel:string = `o/equip/equip.skel`;
    }

    /**字体*/
    // export class Font {        
    // private static _res: string = InitConfig.getAsset();
    // public static get Lang() { return "o/font/lang.json" /*+"?" +E.randomKey*/; }
    // }

    /**图集资源辅助类*/
    export class Atlas {
        private static _root: string = InitConfig.getUI();
        //引擎自有图集
        // public static get Comp() { return this._root + "res/atlas/comp.atlas"; }
        // 动画资源
        public static get Anim_Click() { return this._root + "res/atlas/remote/anims/com_click.atlas"; }
        // 主玩法资源
        public static get Main_Loading() { return this._root + "res/atlas/remote/main/loading.atlas"; }
        public static get Main_Login() { return this._root + "res/atlas/remote/main/login.atlas"; }        
    }

    export class View {
        private static _root: string = InitConfig.getUI() + "views/";
        public static getRoot() {
            return this._root;
        }

        //#region 通用模块
        private static _msgbox: string = "common/ui_msgbox.json";
        private static _midlabel: string = "common/ui_midlabel.json";
        private static _loading: string = "common/ui_loading.json";

        public static get MsgBox(): string { return this._root + this._msgbox; }
        public static get MidLabel(): string { return this._root + this._midlabel; }
        public static get Loading(): string { return this._root + this._loading; }

        //#endregion

        //页面

        //调试页面
        public static get Debug(): string { return this._root + "common/ui_debug.json"; }

        //#region 登录模块
        public static get Login(): string { return this._root + "login/ui_login.json"; }
        //#endregion
    }

    export class Ani {
        private static _root: string =  "anims/";//InitConfig.getAsset()
        public static get Click() { return this._root + "ani_click.ani"; }
    }

   
}