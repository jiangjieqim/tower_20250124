export interface IMSpineRegions {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ISpineTempletTower extends Laya.SpineTemplet{
    tex: Laya.SpineGLTexture;
    setSkin(fileList: IMSpineRegions[], sourceUrl: string, part: string, callBack?: Laya.Handler);
    destroy();
    buildArmature();
    loadAni(url:string);
    jsonOrSkelUrl:string;
}