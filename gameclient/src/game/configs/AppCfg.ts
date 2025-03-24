import { StorageUtil } from "../../frame/util/StorageUtil";
import { GameConfig } from "../../GameConfig";
import { GameHelp } from "../common/help/GameHelp";

/**游戏类型*/
enum EDimension {
    D2 = "2d",
    D3 = "3d",
}
/**应用相关配置
 * -脚本配置
*/
export class AppCfg {

    public static DimType: EDimension;      //游戏类型2D/3D
    public static PhysicEnable: boolean;    //开启物理引擎
    public static TestVersion: boolean;     //是否是测试版本
    public static AppName: string;          //应用名

    //加载配置//"cleannumber.wonderfrog.cn";
    public static config_ip: string = "127.0.0.1";
    //资源地址//"cleannumber.wonderfrog.cn";//"minigametest.betacat.cc";
    public static res_ip: string = "127.0.0.1";
    //本地服务器地址
    public static local_server_ip: string = "ws://127.0.0.1:20000";
    //外网服务器地址//"wss://106.14.57.227"; 
    public static remote_server_ip: string = "wss://cleannumber.wonderfrog.cn/websocket";
    //资源版本
    public static res_version: string = "v_1_0_0";
    //客户端版本
    public static client_version: string = "v_1_0_0";

    public static Init() {

        this.DimType = EDimension.D3;   //设置游戏类型
        this.PhysicEnable = false;      //是否开启屋里
        this.TestVersion = true;        //是否测试版本
        this.AppName = "meta";          //应用名
        LogSys.IsEnable = true;         //是否开启输出日志
        StorageUtil.SetGlobalKey(this.AppName);//设计全局键
        {
            GameHelp.DesignWidth = GameConfig.width;
            GameHelp.DesignHeight = GameConfig.height;
        }
    }

}