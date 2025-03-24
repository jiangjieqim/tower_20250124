import {ResItem} from "./ResItem";

/**资源条目组*/
export class ResItemGroup {

    public ProgressNum: number;//加载进度
    public Items: Array<ResItem> = new Array<ResItem>();//资源列表
    public ProgressEvent: Callback;//进度回调
    public CompleteEvent: Callback;//完成回调

    /**添加需要加载的资源
     * @param url 资源地址
     * @param type 资源类型
     * @param 是否保存到内存
    */
    public Add(url: string, type: string, isKeepMemory: boolean = false) {
        //查找是否已添加
        let idx = this.Items.findIndex((value: ResItem, index: number, items: Array<ResItem>) => {
            return value.Url == url;
        });
        //新添加
        if (idx == -1) {
            let item = new ResItem(url, type, isKeepMemory);
            this.Items.push(item);
        }
        return this;
    }

    public Clear() {
        if (this.Items != null) {
            this.Items.forEach(item => {
                item.Clear();
            });
            this.Items = [];
        }
    }

    public addSkel(url){
        this.Add(`${url}.atlas`,Laya.Loader.TEXT);
        this.Add(`${url}.png`,Laya.Loader.IMAGE);
        this.Add(`${url}.skel`,Laya.Loader.BUFFER);
    }
}