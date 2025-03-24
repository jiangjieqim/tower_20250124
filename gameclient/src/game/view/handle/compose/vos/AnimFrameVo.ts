export enum ENameType{
    /**
     * "15-0_0.png"
     */
    ID_AINM_FRAME = 0,
    /* 
     * 0_00.png
    */
    ANIM_FRAME = 1,
    /**
     * 1.png
     */
    ANIM = 2,
}
export class AnimFrameVo{
    /**起始关键帧名 */
    start:number;

    //===========================
    /**关键帧数量 */
    count:number;

    //===========================
    /**0:1 00:2 关键帧名长度 */
    frameNameLen:number;

    nametype:ENameType;
    basename:string;
    prefix:string;
    private convertFrameName(n:number){
        let a = this.frameNameLen - n.toString().length;
        let s = "";
        for(let i = 0;i < a;i++){
            s+="0";
        }
        s+=n.toString();
        return s;
    }

    private convertName(_index:number,anim:number){
        if(this.nametype == ENameType.ANIM_FRAME){
            let n: number = _index - this.start;
            let name: string = `${anim}_${this.convertFrameName(n)}`;
            return name;
        }else if(this.nametype == ENameType.ID_AINM_FRAME){
            let n: number = _index - this.start;
            let name: string = `${this.basename}-${anim}_${n}`;
            return name;
        }else if(this.nametype == ENameType.ANIM){
            return _index + "";
        }
        // console.log(anim);
        // return _index + "";
        LogSys.Warn(`convertName please check!!!`);
    }

    getURL(_index:number,anim:number){
        let url:string = this.convertName(_index,anim);
        return `${this.prefix}/${url}.png`;
    }
}