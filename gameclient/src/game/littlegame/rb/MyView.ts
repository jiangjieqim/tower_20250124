import {Global} from "../Global";

export class MyView extends Laya.View {
    constructor() {
        super();
    }

    loadScene(path: string): void {
        console.log("MyView::loadScene", path);
        path = Global.subPath + path + ".json";
        super.loadScene(path);

        var url = path;
        // console.log("loadScene :: url::" + url);
        var view = Laya.loader.getRes(url);
        if (view) {
            this.createView(view);
        } else {
            Laya.loader.resetProgress();
            var loader = new Laya.SceneLoader();
            loader.on(Laya.Event.COMPLETE, this, this["_onSceneLoaded"], [url]);
            loader.load(url);
        }
    }
}