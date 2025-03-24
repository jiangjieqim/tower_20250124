
interface ITaskSkinCell extends Laya.Sprite{
    // public juanzhou:Laya.Sprite;
    taskImg: Laya.Image;
    // public juanopen:Laya.Image;
    // public eff:Laya.Sprite;
    taskItemIcon: Laya.Image;
    rewardNum: Laya.Label;
    renwuTask:Laya.Label;
    contTf: Laya.Label;
    qua:Laya.Image;
}

export class TaskCell {
    private _skin:ITaskSkinCell;
    set skin(v:ITaskSkinCell){
        this._skin = v;
        DebugUtil.draw(this._skin,"#0000ff");
    }

    get skin():ITaskSkinCell{
        return this._skin;
    }
    
    constructor() {

    }
}