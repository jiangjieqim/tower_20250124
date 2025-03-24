/**Laya中的资源类型定义 */
export class ResType {
    //文本类型，加载完成后返回文本
    public static get TEXT() { return Laya.Loader.JSON; }
    //JSON 类型，加载完成后返回json数据
    public static get JSON() { return Laya.Loader.JSON; }
    //prefab 类型，加载完成后返回Prefab实例
    public static get PREFAB() { return Laya.Loader.PREFAB; }
    // XML 类型，加载完成后返回domXML
    public static get XML() { return Laya.Loader.XML; }
    //二进制类型，加载完成后返回arraybuffer二进制数据
    public static get BUFFER() { return Laya.Loader.BUFFER; }
    //纹理类型，加载完成后返回Texture
    public static get IMAGE() { return Laya.Loader.IMAGE; }
    //声音类型，加载完成后返回sound
    public static get SOUND() { return Laya.Loader.SOUND; }
    //图集类型，加载完成后返回图集json信息(并创建图集内小图Texture)
    public static get ATLAS() { return Laya.Loader.ATLAS; }
    //位图字体类型，加载完成后返回BitmapFont，加载后，会根据文件名自动注册为位图字体
    public static get FONT() { return Laya.Loader.FONT; }
    //TTF字体类型，加载完成后返回null
    public static get TTF() { return Laya.Loader.TTF; }
    //预加载文件类型，加载完成后自动解析到preLoadedMap
    public static get PLF() { return Laya.Loader.PLF; }
    //二进制预加载文件类型，加载完成后自动解析到preLoadedMap
    public static get PLFB() { return Laya.Loader.PLFB; }
    //Hierarchy资源。
    public static get HIERARCHY() { return Laya.Loader.HIERARCHY; }
    //Mesh资源。
    public static get MESH() { return Laya.Loader.MESH; }
    //Material资源。
    public static get MATERIAL() { return Laya.Loader.MATERIAL; }
    //Texture2D资源。
    public static get TEXTURE2D() { return Laya.Loader.TEXTURE2D; }
    //TextureCube资源。
    public static get TEXTURECUBE() { return Laya.Loader.TEXTURECUBE; }
    //AnimationClip资源。
    public static get ANIMATIONCLIP() { return Laya.Loader.ANIMATIONCLIP; }
    //Avatar资源。
    public static get AVATAR() { return Laya.Loader.AVATAR; }
    //Terrain资源。
    public static get TERRAINHEIGHTDATA() { return Laya.Loader.TERRAINHEIGHTDATA; }
    //Terrain资源。
    public static get TERRAINRES() { return Laya.Loader.TERRAINRES; }

}