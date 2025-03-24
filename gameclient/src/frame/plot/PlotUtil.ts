import { E } from "../../game/G";
import {ResItem} from "../../game/resouce/ResItem";
import {ClickImage} from "./handle/ClickImage";
import {ClickLabel} from "./handle/ClickLabel";

export class PlotUtil {

    /**显示点击文本*/
    static ShowCLbl(rect: { x: number, y: number, w: number, h: number }, str: string, count: number, prog: Callback, comp: Callback): ClickLabel {
        let clbl: ClickLabel = new ClickLabel(
            rect, str, count, prog, comp
        )
        return clbl;
    }

    /**显示点击图片*/
    static ShowCImg(skin: string, rect: { x: number, y: number, w: number, h: number }, click: number, prog: Callback, comp: Callback): ClickImage {
        let cimg: ClickImage = new ClickImage(
            skin, rect, click, prog, comp
        );
        return cimg;
    }

    /**加载剧本
     * @param path 文件路径
     * @param call 加载完成回调
    */
    public Load(path: string, call: Callback) {
        E.ResMgr.LoadRes(new ResItem(path, Laya.Loader.JSON), call, null);
    }



}