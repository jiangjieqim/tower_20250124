/**
 * 盛也sdk玩家数据
 */
export interface SdkPlayerData {
    role_id: string; // string 游戏⽅处的⽤户id，必填（和server_id对应，区分里的玩家流水号id）
    role_name: string; // string ⻆⾊名称
    role_level: number; // int ⻆⾊等级
    server_id: string; // string 区服id，必填（注意：如果产⽣合服操作，合服之后应传⻆⾊⺟服，⽽不是当前服）
    server_name: string; // string 区服名称
    role_vip: number; // int ⻆⾊vip等级（player_level）
    role_power: number; // int 战⼒、武⼒之类⻆⾊的核⼼数值
    report_type?: 'entergame' | 'createrole' | 'roleupgrade'; // 上报类型 ,⽤户在游戏内有创建⾓⾊，进⼊游戏，⽤户升级
}
/**
 * 盛也sdk支付数据
 */
export interface SySdkPayData {
    order_id: string; // string 订单号 必填，游戏⽅⽣成的订单id
    product_price: number, // 必填,商品价格,以元为单位
    product_name?: string; // 商品名称 可选
    product_id?: string; // 商品ID 可选
    extends_param1?: string; // 选填,服务器将此参数原封不动回传⾄CP服务器
    extends_param2?: string; // 选填,服务器将此参数原封不动回传⾄CP服务器
}

/**
 * 盛也sdk api
 */
export interface ISygame {
    init(data: any): void;
    syLogin(): Promise<any>;
    syReportRoleInfo(data: any): Promise<any>;
    showRewordVideo(callback: (type: 0 | 1 | 2) => void);
    syPay(data: any): Promise<any>;
    syGetSubscribe(data: any): Promise<any>;
    goShareData(params): void;
    syGetWechatNickname(): Promise<any>;
    appid: string;
    /**激励视频id */
    adunitid:string;
}

/**
 * 盛也sdk订阅消息数据
 */
export interface SySubcribeData {
    template: string[]; // 订阅消息模板id数组
}

