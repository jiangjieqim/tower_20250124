export class EventID {
  static readonly WEBSOCKET_MESSAGE: string = "WEBSOCKET_MESSAGE";
  static readonly WEBSOCKET_CLOSED: string = "WEBSOCKET_CLOSED";
  static readonly WEBSOCKET_ERROR: string = "WEBSOCKET_ERROR";
  static readonly KickNtf: string = "KickNtf";
  static readonly ConnectRegist: string = "ConnectRegist";
  static readonly WEBSOCKET_SELECTSERVER: string = "WEBSOCKET_SELECTSERVER";
  static readonly PlayerKickTheLineNtf: string = "PlayerKickTheLineNtf";
  static readonly WebClientRegistRsp: string = "WebClientRegistRsp";
  static readonly WebClientLoginRsp: string = "WebClientLoginRsp";
  static readonly ButtonDisable: string = "ButtonDisable";
  static readonly ButtonCtlClick: string = "ButtonCtlClick";
  static readonly GameStart:string = "GameStart"
  /**清理资源*/
  static readonly FreeRes:string = "FreeRes";
  /**引用计数器为0的时候的纹理销毁 */
  static readonly TextureDestroy:string = "TextureDestroy";
}