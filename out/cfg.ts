
export class t_Achieve_Task_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*需求数量*/
public f_task_amount:number;
/*任务排序*/
public t_task_sort:number;
/*成就奖励*/
public t_achieve_reward:string;
/*任务说明*/
public t_des:string;
/*是否隐藏*/
public f_hide:number;
}

export class t_Activity_dat{
/*id*/
public f_id:number;
/*f_packid*/
public f_activity_id:number;
/*活动名称*/
public f_activity_name:string;
/*活动开启时间*/
public f_activity_time:string;
/*活动持续时间*/
public f_time_duration:string;
/*结算时间*/
public f_settlement:string;
/*活动分组*/
public f_group:number;
/*功能id*/
public f_func_id:number;
}

export class t_Activity_Daily_Login_dat{
/*id*/
public f_id:number;
/*登录天数*/
public f_login_days:number;
/*奖励*/
public f_reward:string;
}

export class t_Activity_Daily_Online_dat{
/*id*/
public f_id:number;
/*在线时长*/
public f_online_minutes:number;
/*奖励*/
public f_reward:string;
}

export class t_Activity_Daily_OwnRewards_dat{
/*id*/
public f_id:number;
/*奖励*/
public f_reward:string;
}

export class t_Activity_Daily_Power_dat{
/*id*/
public f_id:number;
/*奖励*/
public f_reward:string;
/*领取时间*/
public f_time:string;
/*补领价格*/
public f_price:string;
/*描述*/
public f_desc:string;
}

export class t_Arena_dat{
/*id*/
public f_id:number;
/*竞技场id*/
public f_arenaid:number;
/*竞技场名称*/
public f_name:string;
/*竞技场最小奖杯*/
public f_trophy_min:number;
/*竞技场最大奖杯*/
public f_trophy_max:number;
/*胜利基础奖杯*/
public f_victory_base_trophy:number;
/*失败基础奖杯*/
public f_defeat_base_trophy:number;
/*强敌修正基数*/
public f_strong_enemy_modifier:number;
/*强敌最大修正奖杯*/
public f_trophy_modifier_strong:number;
/*弱敌修正基数*/
public f_weak_enemy_modifier:number;
/*弱敌最大修正奖杯*/
public f_weak_modifier_strong:number;
/*是否会掉出竞技场*/
public f_drop_arena:number;
/*获胜奖励系数*/
public f_win_reward_coefficient:number;
/*失败奖励系数*/
public f_lose_reward_coefficient:number;
/*需要携带卡牌数量*/
public f_card_max_amount:number;
/*卡牌抽取回合*/
public f_draw_round:string;
/*每个玩家基础血量*/
public f_player_hp:number;
}

export class t_Attribute_dat{
/*id*/
public f_id:number;
/*属性id*/
public f_attributeid:number;
/*属性名*/
public f_name:string;
/*显示百分比*/
public f_per:number;
/*属性作用对象*/
public f_object:number;
/*效果展示*/
public f_effect:string;
/*备注*/
public f_desc:string;
/*是否在buff栏显示*/
public f_buff_appear:number;
/*buff栏前端显示文本*/
public f_buff_text:string;
/*统计显示时是否显示相反数*/
public f_buff_opposite_number:number;
}

export class t_Battle_Communication_dat{
/*id*/
public f_id:number;
/*战斗类型*/
public f_battle_type:number;
/*类型*/
public f_type:number;
/*表情*/
public f_face:number;
/*文本*/
public f_text:string;
/*动画反转*/
public f_revert:number;
}

export class t_Battle_Config_dat{
/*id*/
public f_id:number;
/*系统配置*/
public f_battleconfig:string;
}

export class t_Battle_Effect_dat{
/*id*/
public f_id:number;
/*特效id*/
public f_effect_id:number;
/*是否是ui*/
public f_ui:number;
/*前缀*/
public f_spine_path:string;
/*特效名称*/
public f_effect_name:string;
/*播放动画*/
public f_effect_anim:number;
/*特效层级*/
public f_layer:number;
/*播放模式*/
public f_mode:number;
/*按钮类型*/
public f_btnmode:number;
/*1:目标阵营方2:战场中心位置*/
public f_target:number;
/*y偏移*/
public f_offsetY:number;
}

export class t_Battle_Pass_dat{
/*id*/
public f_id:number;
/*战令等级*/
public f_level:number;
/*经验*/
public f_exp:number;
/*普通奖励*/
public f_ordinary_reward:string;
/*高级奖励*/
public f_advanced_reward:string;
/*赛季*/
public f_season:number;
}

export class t_Battle_Pass_Task_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_task_id:number;
/*任务类型*/
public f_task_type:number;
/*任务模版*/
public f_task_template:number;
/*需求数量*/
public f_task_number:number;
/*任务排序*/
public t_task_sort:number;
/*任务奖励*/
public f_reward:string;
/*文本显示*/
public f_text:string;
/*赛季标识*/
public f_season:number;
}

export class t_Battle_Statistics_dat{
/*id*/
public f_id:number;
/*统计类型*/
public f_type:number;
/*统计数据说明*/
public f_des:string;
/*统计类型2*/
public f_type2:number;
/*统计条件*/
public f_condition:number;
}

export class t_Battle_Statistics_Type_dat{
/*id*/
public f_id:number;
/*大类型*/
public f_type:number;
/*大类型名称*/
public f_name:string;
/*包含的统计类型*/
public f_include_entries:string;
}

export class t_Battle_Task_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*竞技场id*/
public f_arenaid:number;
/*任务类型*/
public f_task_type:number;
/*内容数量*/
public f_task_amount:string;
/*任务奖励*/
public f_task_reward:string;
/*任务描述*/
public f_task_dsc:string;
/*完成任务显示*/
public f_complete_text:string;
}

export class t_Battle_Task_Coop_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*副本难度id*/
public f_arenaid:number;
/*任务类型*/
public f_task_type:number;
/*内容数量*/
public f_task_amount:string;
/*任务奖励*/
public f_task_reward:string;
/*任务描述*/
public f_task_dsc:string;
/*完成任务显示*/
public f_complete_text:string;
}

export class t_Battle_Task_Template_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*前端读哪个位置上的数字显示*/
public f_pos:number;
}

export class t_Blood_Color_dat{
/*id*/
public f_id:number;
/*区间最小值*/
public f_interval_min:number;
/*区间最大值*/
public f_interval_max:number;
/*血条颜色*/
public f_blood_color:string;
}

export class t_Box_Falling_Rate_dat{
/*id*/
public f_id:number;
/*宝箱类型*/
public f_box_type:number;
/*宝箱名字*/
public f_box_name:string;
/*基础概率*/
public f_basic_rate:number;
/*冷却期*/
public f_cool_period:number;
/*软保底次数*/
public f_soft_guarant:number;
/*软保底概率增加*/
public f_soft_guarant_rateup:number;
/*开箱所需时间*/
public f_opentime:number;
/*宝箱优先级*/
public f_priority:number;
}

export class t_Box_Match_dat{
/*id*/
public f_id:number;
/*宝箱id*/
public f_box_id:number;
/*竞技场阶段*/
public f_arena_stage:number;
/*宝箱品质*/
public f_box_qua:number;
/*宝箱文本*/
public f_text:string;
/*是否为新手教程宝箱*/
public f_newplayer_box:number;
/*转换道具*/
public f_transform_item:string;
}

export class t_Box_Reward_Rate_dat{
/*id*/
public f_id:number;
/*宝箱id*/
public f_box_id:number;
/*掉落组*/
public f_drop_group:number;
/*掉落概率*/
public f_drop_rate:number;
/*数量*/
public f_quantity:string;
/*奖励池内容*/
public f_reward:string;
}

export class t_Community_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_type:number;
/*需求次数*/
public f_times:number;
/*奖励*/
public f_reward:string;
/*任务显示文本*/
public f_des_text:string;
/*是否每日重置奖励*/
public f_reset:number;
}

export class t_Competition_Season_dat{
/*id*/
public f_id:number;
/*赛季*/
public f_season:number;
/*赛季名称*/
public f_season_name:string;
/*开始时间*/
public f_start_time:string;
/*结束时间*/
public f_end_time:string;
/*高级战令充值id*/
public f_recharge_id:number;
/*高级战令解锁奖励*/
public f_unlock_reward:string;
/*购买赛季经验价格*/
public f_exp_price:string;
/*购买赛季经验奖励*/
public f_exp_reward:string;
}

export class t_Cover_Big_Goose_config_dat{
/*id*/
public f_id:number;
/*大鹅位置*/
public f_pos:number;
/*大鹅类型*/
public f_goose_type:number;
/*大鹅权重*/
public f_weight:number;
/*形象*/
public f_tempid:number;
}

export class t_Cover_Big_Goose_Pack_dat{
/*id*/
public f_id:number;
/*礼包名称*/
public f_pack_name:string;
/*充值id*/
public f_recharge_id:number;
/*奖励*/
public f_reward:string;
/*限购类型*/
public f_limited_type:number;
/*限购次数*/
public f_limited_amount:number;
/*排序*/
public f_sort:number;
/*返利比例*/
public f_discount:number;
}

export class t_Cover_Big_Goose_reward_dat{
/*id*/
public f_id:number;
/*大鹅类型*/
public f_goose_type:number;
/*奖励*/
public f_reward:string;
/*权重*/
public f_weight:number;
/*是否为自选大奖*/
public f_big_prize:number;
}

export class t_Cover_Big_Goose_Task_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*任务数量*/
public f_task_amount:number;
/*文本说明*/
public f_des:string;
/*奖励*/
public f_reward:string;
}

export class t_Crazy_Fish_config_dat{
/*id*/
public f_id:number;
/*主题英雄类型*/
public f_type:number;
/*开始时间*/
public f_start_time:string;
/*结束时间*/
public f_end_time:string;
/*单抽消耗*/
public f_one_consume:string;
/*十连消耗*/
public f_ten_consume:string;
/*神话保底次数*/
public f_god_guarantee_times:number;
/*指定英雄保底次数*/
public f_specify_guarantee_times:number;
/*英雄id*/
public f_hero_id:number;
/*道具价格*/
public f_item_price:string;
}

export class t_Crazy_Fish_Reward_dat{
/*id*/
public f_id:number;
/*主题英雄类型*/
public f_type:number;
/*奖励*/
public f_reward:string;
/*权重*/
public f_weight:number;
/*公示概率*/
public f_announcement_rate:number;
/*是否需要重置保底*/
public f_reset_guarantee:number;
/*是否为本期指定英雄*/
public f_specify:number;
}

export class t_Crazy_Fish_Upgrade_dat{
/*id*/
public f_id:number;
/*主题英雄类型*/
public f_type:number;
/*养成英雄id*/
public f_hero_id:number;
/*领取等级条件*/
public f_receive_level:number;
/*免费奖励*/
public f_reward:string;
/*礼包奖励*/
public f_pack_reward:string;
/*充值id*/
public f_recharge_id:number;
/*限购类型*/
public f_limit_type:number;
/*限购次数*/
public f_limit_times:number;
/*可见所需等级*/
public f_see_level:number;
}

export class t_Daily_Recharge_dat{
/*id*/
public f_id:number;
/*奖励*/
public f_reward:string;
/*充值id*/
public f_recharge_id:number;
/*限购次数*/
public f_limit_times:number;
/*限购类型*/
public f_limit_type:number;
/*是否为任意充值领取*/
public f_recharge_free:number;
}

export class t_Daily_Task_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*任务数量*/
public f_task_amount:number;
/*文本说明*/
public f_des:string;
/*活跃度数量*/
public f_activation:number;
/*前端显示*/
public f_client:string;
}

export class t_Daily_Task_Reward_dat{
/*id*/
public f_id:number;
/*活跃度*/
public f_activation:number;
/*奖励*/
public f_reward:string;
}

export class t_Enemy_Wave_dat{
/*id*/
public f_id:number;
/*战斗类型*/
public f_battle_type:number;
/*竞技场阶段*/
public f_chapter:number;
/*波次*/
public f_waves:number;
/*出现时间*/
public f_time:number;
/*怪物id*/
public f_enemyid:number;
/*数量*/
public f_amount:number;
/*出现间隔*/
public f_interval:number;
/*是否为boss关卡*/
public f_boss_wave:number;
}

export class t_Enemy_Wave_Coop_dat{
/*id*/
public f_id:number;
/*副本难度*/
public f_chapter:number;
/*波次*/
public f_waves:number;
/*出现时间*/
public f_time:number;
/*怪物id*/
public f_enemyid:number;
/*数量*/
public f_amount:number;
/*出现间隔*/
public f_interval:number;
/*是否为boss关卡*/
public f_boss_wave:number;
/*是否为选择buff关卡*/
public f_buff_wave:number;
/*buff掉落组*/
public f_buff_drop_id:number;
}

export class t_Err_dat{
/*id*/
public f_id:number;
/*名字*/
public f_err:string;
/*是否需要数数上报*/
public f_report:number;
/*上报类型*/
public f_type:number;
}

export class t_FightGuideConfig_dat{
/*id*/
public f_id:number;
/*系统配置*/
public f_val:string;
}

export class t_FightGuideStop_dat{
/*id*/
public f_id:number;
/*类型(0时间停止1 怪物坐标停止)*/
public f_type:number;
/*时间(毫秒)*/
public f_time:number;
/*怪物流水号|怪物坐标索引|目标阵营*/
public param:string;
}

export class t_FightStyle_dat{
/*id*/
public f_id:number;
/*名字*/
public f_name:string;
/*顶部显示格子的偏移*/
public f_top:number;
/*战斗舞台坐标*/
public f_fightViewY:number;
/*居中y偏移格子倍数*/
public f_centerY:number;
/*背景*/
public f_bg:string;
/*vs动画*/
public f_vs:string;
/*预警配置*/
public f_checkCount:number;
/*卡牌最大数量*/
public f_maxCardCount:number;
/*怪物配置*/
public f_monsterCfg:string;
/*波次配置*/
public f_waveCfg:string;
/*任务配置*/
public f_battleTask:string;
/*卡牌背景*/
public f_cardbg:string;
/*主界面的聊天入口*/
public f_chat:number;
/*战斗预览按钮*/
public f_pre:number;
/*主界面不显示神话英雄召唤列表*/
public f_disable_mythos:number;
/*不显示boss头顶的倒计时*/
public f_disable_boss_cutdown:number;
/*屏蔽击杀妖王横幅提醒*/
public f_disable_kill_boss_tips:number;
/*祈愿配置*/
public f_gambleid:number;
/*聊天表情偏移*/
public f_chat_y:number;
/*召唤消耗id*/
public f_sommon_id:number;
/*隐藏结算看广告*/
public f_hide_wactAD:number;
/*场景特效*/
public f_scene_effect:string;
}

export class t_First_Pass_Reward_Coop_dat{
/*id*/
public f_id:number;
/*奖励位置*/
public f_pos:number;
/*副本难度*/
public f_difficulty:number;
/*需要通过的波次*/
public f_wave:number;
/*奖励*/
public f_reward:string;
}

export class t_First_Recharge_dat{
/*id*/
public f_id:number;
/*页签*/
public f_tab:number;
/*充值id*/
public f_recharge:number;
/*奖励*/
public f_reward:string;
/*领取天数*/
public f_reward_day:number;
}

export class t_Friendship_dat{
/*id*/
public f_id:number;
/*友情等级*/
public f_level:number;
/*需要友情点数*/
public f_points:number;
/*特殊效果（改变攻击力百分比）*/
public f_attack_effect:string;
/*文本说明*/
public f_des:string;
}

export class t_Friendship_Task_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*需求数量*/
public f_task_amount:number;
/*任务名称*/
public f_title:string;
/*任务说明*/
public f_des:string;
/*奖励*/
public f_reward:string;
}

export class t_func_dat{
/*id*/
public f_id:number;
/*功能id*/
public f_FunctionID:number;
/*名称*/
public f_name:string;
/*解锁条件_等级*/
public f_level:number;
/*解锁条件_奖杯数*/
public f_trophy:number;
/*f_viewType*/
public f_viewType:number;
/*f_close*/
public f_close:number;
/*是否弹出功能开放提示*/
public t_func_open_hint:number;
/*icon飞入位置*/
public f_fly_position:string;
/*提审模式是否关闭*/
public f_ts:number;
/*taptap提审状态*/
public f_ts_tap:number;
/*tab页签*/
public t_tab_func:string;
/*是有影响主界面红点*/
public f_main_redpoint:number;
/*是有影响主界面设置红点*/
public f_setting_redpoint:number;
/*活动id*/
public f_activity_id:number;
/*打开界面传入的参数*/
public f_param:string;
}

export class t_Function_Buff_Rate_Coop_dat{
/*id*/
public f_id:number;
/*掉落组id*/
public f_drop_id:number;
/*掉落组权重*/
public f_drop_weight:number;
/*buffid*/
public f_buffid:number;
}

export class t_Function_Card_dat{
/*id*/
public f_id:number;
/*卡牌id*/
public f_cardid:number;
/*模板id*/
public f_card__templateid:number;
/*是否为PVE加成*/
public f_pve_buff:number;
/*卡牌效果参数*/
public f_card_effect:string;
/*卡牌名称*/
public f_card_name:string;
/*卡牌描述*/
public f_card_des:string;
/*卡牌播报*/
public f_card_broadcast:string;
/*前端播报*/
public f_direct_broadcast:number;
/*卡牌特效*/
public f_card_visualeffect:number;
/*卡牌音效*/
public f_card_sound:number;
/*特效*/
public f_effect_id:number;
/*PVP回合制需要播放特效*/
public f_effect_pvp:number;
/*卡牌品质*/
public f_qua:number;
/*显示排序*/
public f_rank:number;
/*卡牌标签*/
public f_label:number;
/*最大携带数量*/
public f_max_amount:number;
/*卡牌使用价格*/
public f_card_price:string;
/*卡牌使用后冷却*/
public f_card_Cooldown:number;
/*卡牌icon*/
public f_card_imageid:number;
/*是否无法被抽取到*/
public f_drawn:number;
/*玩家初始拥有数量*/
public f_initial_amount:number;
/*分解奖励*/
public f_disenchant:string;
/*获取途径*/
public f_source:string;
/*是否隐藏*/
public f_hide:string;
}

export class t_Function_Card_Extract_Rate_dat{
/*id*/
public f_id:number;
/*卡包id*/
public f_packageid:number;
/*掉落组*/
public f_drop_group:number;
/*掉落组权重*/
public f_drop_weight:number;
/*品质*/
public f_qua:number;
/*卡牌id*/
public f_reward:string;
/*保底次数*/
public f_guarant:number;
/*概率显示*/
public f_drop_probability:number;
}

export class t_Function_Card_Match_dat{
/*id*/
public f_id:number;
/*卡包id*/
public f_packageid:number;
/*消耗的道具*/
public f_consume_item:string;
/*抽取次数*/
public f_times:number;
/*购买价格*/
public f_price:string;
/*碎片兑换价格*/
public f_piece_price:string;
/*卡包名称*/
public f_name:string;
/*赛季卡包标记*/
public f_limited:number;
}

export class t_Function_Card_Rate_Coop_dat{
/*id*/
public f_id:number;
/*掉落组id*/
public f_drop_id:number;
/*掉落奖池*/
public f_drop_group:number;
/*掉落组权重*/
public f_drop_weight:number;
/*品质*/
public f_quality:number;
/*卡牌id*/
public f_cardid:string;
}

export class t_Function_Card_Template_dat{
/*id*/
public f_id:number;
/*效果类型*/
public f_task_type:number;
}

export class t_Function_Coop_dat{
/*id*/
public f_id:number;
/*词条id*/
public f_buffid:number;
/*名字*/
public f_name:string;
/*词条描述*/
public f_buff_des:string;
/*品质*/
public f_quality:number;
/*图标*/
public f_icon:number;
/*排斥*/
public f_exclusion:string;
}

export class t_Function_Guide_dat{
/*id*/
public f_id:number;
/*引导组id*/
public f_groupid:number;
/*组顺序id*/
public f_orderid:number;
/*组优先级*/
public f_priority:number;
/*前置条件*/
public f_precondition:string;
/*界面ID*/
public f_viewId:number;
/*界面组件*/
public f_viewZJ:string;
/*文本框位置偏移*/
public f_frame_position:number;
/*文本框位置偏移2*/
public f_frame_position2:number;
/*箭头位置偏移*/
public f_arrow_position:number;
/*手指位置偏移*/
public f_finger_position:number;
/*打开宝箱强制进下一步*/
public f_forward_step:number;
/*文本内容*/
public f_info:string;
/*文本播放音效*/
public f_info_voice:string;
}

export class t_Function_Sound_dat{
/*id*/
public f_id:number;
/*界面组件*/
public f_ui_component:number;
/*音效资源名称*/
public f_file_name:string;
}

export class t_Func_Popup_dat{
/*id*/
public f_id:number;
/*功能id*/
public f_func_id:number;
/*拍脸顺序*/
public f_sort:number;
/*界面id*/
public f_viewtype:number;
/*活动id*/
public f_activity:number;
}

export class t_Fund_Config_dat{
/*id*/
public f_id:number;
/*基金类型*/
public f_fund_type:number;
/*充值id*/
public f_recharge_id:number;
/*banner图*/
public f_banner_id:number;
}

export class t_Fund_Reward_dat{
/*id*/
public f_id:number;
/*基金类型*/
public f_fund_type:number;
/*所需天数*/
public f_required_days:number;
/*免费奖励*/
public f_free_reward:string;
/*付费奖励*/
public f_pay_reward:string;
}

export class t_God_Road_dat{
/*id*/
public f_id:number;
/*赛季*/
public f_season:number;
/*赛季名称长*/
public f_season_name:string;
/*赛季名称短*/
public f_season_name1:string;
/*领奖台*/
public f_stage:number;
/*奖励*/
public f_reward:string;
/*所需积分*/
public f_trophy:number;
}

export class t_GuideChapter_dat{
/*id*/
public f_id:number;
/*流程配置*/
public f_flow:string;
/*检测停止配置*/
public f_stop_check:string;
}

export class t_Head_Image_dat{
/*id*/
public f_id:number;
/*头像id*/
public f_headid:number;
/*类型*/
public f_type:number;
/*头像名字*/
public f_imageName:string;
/*形象id*/
public f_imageID:number;
/*获取途径*/
public f_access:string;
/*初始配置*/
public f_default:number;
/*默认是否解锁*/
public f_unlock:number;
}

export class t_Hero_dat{
/*id*/
public f_id:number;
/*英雄id*/
public f_heroid:number;
/*英雄名称*/
public f_hero:string;
/*品质*/
public f_qua:number;
/*显示排序*/
public f_rank:number;
/*攻击范围*/
public f_range:number;
/*英雄基础属性*/
public f_base_attribute:string;
/*默认解锁*/
public f_unlock:number;
/*技能id*/
public f_skillid:string;
/*最大魔法值*/
public f_magic:number;
/*单次攻击恢复魔法值*/
public f_magic_restore:number;
/*合成需要的英雄*/
public f_synthesis:string;
/*能用于合成的英雄*/
public f_composed:string;
/*合成需要的货币*/
public f_synthesis_money:string;
/*皮肤*/
public f_skin:string;
/*英雄定位*/
public f_occupation:number;
/*化神后id*/
public f_transform:number;
/*是否为化神后*/
public f_if_transform:number;
/*英雄碎片id*/
public f_heropiece_id:number;
/*通用升级英雄碎片*/
public f_universal_piece:number;
/*满级后碎片转化价格*/
public f_heropiece_price:string;
/*主动技能概率*/
public f_active_skills_rate:number;
/*主动技能文本*/
public f_active_skills_text:string;
/*主动技能消耗*/
public f_active_skills_consume:string;
/*主动技能错误提示*/
public f_active_skills_info:number;
/*主动技能失败提示*/
public f_active_skills_fail_tip:number;
/*神话英雄解锁价格*/
public f_purchase_prize:string;
/*英雄召唤音效*/
public f_sound:number;
/*神话英雄解锁条件*/
public f_unlock_condition:string;
}

export class t_HeroAddSubEffect_dat{
/*id*/
public f_id:number;
/*卡牌id*/
public f_cardid:number;
/*英雄增加的特效*/
public f_addid:number;
/*英雄减少的特效*/
public f_subid:number;
/*场上剩余的当前方英雄播放的特效*/
public f_surplus_heros:number;
}

export class t_Herosummon_Rate_dat{
/*id*/
public f_id:number;
/*战斗类型*/
public f_battle_type:number;
/*召唤等级*/
public f_waves:number;
/*对应最小波次*/
public f_minwaves:string;
/*召唤权重*/
public f_chapter:string;
/*升级消耗*/
public f_consume:string;
}

export class t_Hero_Skin_dat{
/*id*/
public f_id:number;
/*皮肤id*/
public f_skinid:number;
/*形象id*/
public f_imageid:number;
/*皮肤名称*/
public f_skin_name:string;
/*细节标签*/
public f_detail_label:string;
/*品质标签*/
public f_qua_label:string;
/*立绘类型*/
public f_illustration_type:number;
/*立绘*/
public f_illustration:string;
/*立绘背景*/
public f_illustration_bg:string;
/*显示排序*/
public f_rank:number;
/*立绘小图*/
public f_picshow:number;
/*解锁价格*/
public f_unlock_price:string;
/*解锁道具id*/
public f_itemid:number;
/*其它解锁方式*/
public f_unlock_way:string;
/*英雄展示界面x|y轴偏移量*/
public f_pos_herolist:string;
/*皮肤展示界面x|y轴偏移量*/
public f_pos:string;
/*额外属性*/
public f_buff:string;
/*额外属性描述*/
public f_bufff_desc:string;
/*动画预览id*/
public f_animationid:number;
}

export class t_Hero_Synthesis_Weight_dat{
/*id*/
public f_id:number;
/*合成类型*/
public f_heroid:number;
/*权重*/
public f_hero:string;
}

export class t_Hero_upgrade_dat{
/*id*/
public f_id:number;
/*英雄id*/
public f_heroid:number;
/*英雄等级*/
public f_herolevel:number;
/*英雄携带技能*/
public f_heroskill:string;
/*英雄携带道具*/
public f_summon_reward:string;
/*升级消耗*/
public f_consumption:string;
/*英雄属性*/
public f_hero_attribute:string;
/*英雄攻击力*/
public f_10002:string;
/*英雄攻击速度加成*/
public f_attack_speed:number;
/*全局属性加成*/
public f_global_attribute:string;
/*客户端显示技能说明*/
public f_client_skill_des:string;
/*客户端显示文本*/
public f_client_skill:string;
}

export class t_HolyBeast_Draw_Rate_dat{
/*id*/
public f_id:number;
/*活动id*/
public f_activity_id:number;
/*抽奖权重*/
public f_weight:number;
/*奖励*/
public f_reward:string;
/*是否需要播报*/
public f_broadcast:number;
/*获得亲密度*/
public f_intimacy:number;
}

export class t_HolyBeast_Intimacy_Reward_dat{
/*id*/
public f_id:number;
/*活动id*/
public f_activity_id:number;
/*亲密度奖励排序*/
public f_sort:number;
/*亲密度需求*/
public f_require:number;
/*亲密度奖励*/
public f_reward:string;
}

export class t_HolyBeast_Pack_dat{
/*id*/
public f_id:number;
/*礼包名称*/
public f_pack_name:string;
/*活动id*/
public f_activity_id:number;
/*礼包类型*/
public f_pack_type:number;
/*充值id*/
public f_recharge_id:number;
/*购买价格*/
public f_price:string;
/*奖励*/
public f_reward:string;
/*限购类型*/
public f_limited_type:number;
/*限购次数*/
public f_limited_amount:number;
/*排序*/
public f_sort:number;
/*返利比例*/
public f_discount:number;
}

export class t_HolyBeast_Rank_Reward_dat{
/*id*/
public f_id:number;
/*活动id*/
public f_activity_id:number;
/*名次*/
public f_rank:string;
/*奖励*/
public f_reward:string;
}

export class t_HolyBeast_Resource_dat{
/*id*/
public f_id:number;
/*活动id*/
public f_activity_id:number;
/*抽奖界面左上角显示的资源*/
public f_draw_icon:string;
/*商店界面左上角显示的资源*/
public f_shop_icon:string;
/*弹窗上方的动画英雄id*/
public f_hero_id:string;
/*单次抽取消耗*/
public f_single_draw_consume:string;
/*十连抽取消耗*/
public f_ten_draw_consume:string;
/*圣兽活动结算邮件标题*/
public f_mail_title:string;
/*圣兽活动结算邮件正文*/
public f_mail_text:string;
}

export class t_HolyBeast_Shop_dat{
/*id*/
public f_id:number;
/*活动id*/
public f_activity_id:number;
/*商店类型*/
public f_shop_type:number;
/*售价*/
public f_price:string;
/*奖励*/
public f_reward:string;
/*限购类型*/
public f_limit_type:number;
/*限购次数*/
public f_limit_times:number;
}

export class t_HolyBeast_Task_dat{
/*id*/
public f_id:number;
/*活动id*/
public f_activity_id:number;
/*任务类型*/
public f_task_type:number;
/*任务数量*/
public f_task_amount:number;
/*文本说明*/
public f_des:string;
/*奖励*/
public f_reward:string;
}

export class t_Inner_Sound_dat{
/*id*/
public f_id:number;
/*音效名称*/
public f_name:string;
}

export class t_Invite_Reward_dat{
/*id*/
public f_id:number;
/*平台类型*/
public f_plat_type:number;
/*邀请类型*/
public f_invite_type:number;
/*邀请人数*/
public f_invite_number:number;
/*邀请等级条件*/
public f_invite_condition:number;
/*奖励*/
public f_reward:string;
}

export class t_Invite_Reward_Daily_dat{
/*id*/
public f_id:number;
/*奖励*/
public f_reward:string;
}

export class t_Item_dat{
/*id*/
public f_id:number;
/*名字*/
public f_name:string;
/*物品id*/
public f_itemid:number;
/*信息*/
public f_info:string;
/*后台显示*/
public f_isshow:number;
/*道具数量限制*/
public f_itemNum:number;
/*图标*/
public f_icon:string;
/*品质*/
public f_qua:number;
/*背包类型*/
public f_bag_type:number;
/*大类型*/
public f_type:number;
/*小类型*/
public f_sub_type:number;
/*参数p1*/
public f_p1:string;
/*参数p2*/
public f_p2:string;
/*参数p3*/
public f_p3:string;
/*参数p4*/
public f_p4:number;
/*滑块单次购买上限*/
public f_limit_number:number;
/*转化道具*/
public f_translation:string;
/*道具光效*/
public f_iconeffect:string;
/*是否屏蔽拥有量*/
public f_block_amount:number;
}

export class t_Limited_Time_Pack_dat{
/*id*/
public f_id:number;
/*礼包id*/
public f_pack_id:number;
/*礼包类型*/
public f_type:number;
/*礼包时间类型*/
public f_pack_type:number;
/*开启时间*/
public f_open_time:string;
/*结束时间*/
public f_close_time:string;
/*累计登录开启天数*/
public f_role_days:number;
/*持续天数*/
public f_duration:number;
/*限购次数*/
public f_limited_times:number;
/*奖励*/
public f_reward:string;
/*充值id*/
public f_recharge:number;
/*原价*/
public f_original_price:number;
/*礼包折扣*/
public f_discount:number;
/*礼包堆叠排序*/
public f_stack_sort:number;
/*礼包排序*/
public f_pack_sort:number;
/*礼包标题*/
public f_pack_title:string;
/*礼包左侧icon*/
public f_pack_icon:string;
/*礼包文案*/
public f_headline:string;
/*是否屏蔽*/
public f_hide:number;
}

export class t_Lottery_Reward_Rate_dat{
/*id*/
public f_id:number;
/*排序*/
public f_pos:number;
/*奖励*/
public f_reward:string;
/*权重*/
public f_rate:number;
/*公示概率*/
public f_announce_rate:number;
}

export class t_MainIcon_dat{
/*id*/
public f_id:number;
/*功能id*/
public f_funid:number;
/*按钮位置*/
public f_pos:number;
/*排序*/
public f_sort:number;
/*图片*/
public f_icon:string;
/*动画*/
public f_animation:string;
/*特效*/
public f_effect:string;
}

export class t_Main_Task_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*需求数量*/
public f_task_amount:number;
/*文本说明*/
public f_des:string;
/*奖励*/
public f_reward:string;
/*后置任务*/
public f_behind_task:number;
}

export class t_Main_Tasks_Guide_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*引导位置*/
public f_GuidePosition:string;
/*参数*/
public f_param:string;
/*是否是弱引导*/
public f_weak:number;
/*隐藏掉相关的image*/
public f_hide_img:string;
/*显示相关的image*/
public f_show_img:string;
/*功能开启目标image*/
public f_func_img:string;
/*战斗引导中的功能卡*/
public f_fight_cardId:string;
/*拖拽的地图区块位置*/
public f_grid:string;
/*提示按钮XY偏移*/
public f_XY:string;
/*小界面Y轴位置*/
public f_sviewY:number;
/*是否显示小界面:  1点击引导组件区域 不进行入下一个引导  ,2 点击任意区域下一个引导 3 整个区域不可点击*/
public f_showsmallview:number;
/*是否是界面*/
public f_isview:number;
/*描述*/
public f_info:string;
/*语音*/
public f_audio:string;
/*tip所在的位置:上(1)下(0)右偏移(2)*/
public f_dir:number;
/*tips箭头偏移*/
public f_arrow_offsetXY:string;
/*hand偏移*/
public f_hand_offsetXY:string;
/*小手动画 NULL表示没有动画*/
public f_anim:string;
/*是否遮挡强制*/
public f_mask:number;
/*小箭头偏移*/
public f_little_offsetX:number;
/*是否关闭所在引导界面*/
public f_closeUI:number;
/*动画*/
public f_spine_anim:string;
/*右边栏任务面板*/
public f_guidetask:string;
/*是否是视图内部的指引*/
public f_inside_arrow:number;
/*特殊行为检测*/
public f_check_param:string;
}

export class t_MapRes_dat{
/*id*/
public f_id:number;
/*资源名*/
public f_res_name:string;
/*资源类型*/
public f_res_type:number;
}

export class t_Matching_Rules_dat{
/*id*/
public f_id:number;
/*战斗类型*/
public f_type:number;
/*奖杯区间数*/
public f_trophy_section:string;
/*副本难度*/
public f_difficulty:string;
/*初始匹配奖杯范围*/
public f_initial_scope:number;
/*初始匹配时长（秒）*/
public f_matching_time1:number;
/*第二阶段匹配增量*/
public f_increment2:number;
/*第二阶段匹配时长*/
public f_matching_time2:number;
/*第二阶段循环次数*/
public f_cycle2:number;
/*第三阶段匹配增量*/
public f_increment3:number;
/*第三阶段匹配时长*/
public f_matching_time3:number;
/*第三阶段循环次数*/
public f_cycle3:number;
/*最大匹配时长（秒）*/
public f_max_matching_time:number;
/*ai出现时间*/
public f_robot_time:string;
/*最大连续ai匹配次数*/
public f_robot_Maximum:number;
/*连败送分ai出现时机*/
public f_lose_robot_appear:number;
/*连败保底ai出现时间*/
public f_lose_robot_time:string;
/*必定匹配机器人*/
public f_robot_match:number;
}

export class t_Match_Pool_dat{
/*id*/
public f_id:number;
/*同个匹配池子区服*/
public f_match_pool:string;
}

export class t_Medal_dat{
/*id*/
public f_id:number;
/*对应最低分*/
public f_min_score:number;
/*对应最高分*/
public f_max_score:number;
/*段位名称*/
public f_rank_name:string;
/*奖牌动画id*/
public f_medal_id:string;
/*x轴偏移*/
public f_pos_x:number;
/*y轴偏移*/
public f_pos_y:number;
/*大小缩放*/
public f_size_zoom:number;
/*赛季结算奖励*/
public f_settlement_reward:string;
/*层级*/
public f_layer:number;
/*奖牌动画sp*/
public f_medal_sp:string;
/*奖牌img*/
public f_img:string;
}

export class t_Monster_dat{
/*id*/
public f_id:number;
/*怪物id*/
public f_monsterid:number;
/*使用的怪物模板*/
public f_monster_template_id:number;
/*怪物类型*/
public f_monster_type:number;
/*限时boss排序*/
public f_limitboss_sort:string;
/*怪物血防*/
public f_monster_attribute:string;
/*击杀奖励*/
public f_kill_reward:string;
}

export class t_Monster_Coop_dat{
/*id*/
public f_id:number;
/*怪物id*/
public f_monsterid:number;
/*使用的怪物模板*/
public f_monster_template_id:number;
/*怪物类型*/
public f_monster_type:number;
/*限时boss排序*/
public f_limitboss_sort:string;
/*怪物血防*/
public f_monster_attribute:string;
/*怪物特殊属性*/
public f_monster_special_effect:string;
/*击杀奖励*/
public f_kill_reward:string;
/*卡牌掉落组id*/
public f_drop_id:number;
/*卡牌掉落概率*/
public f_drop_rate:number;
}

export class t_Monster_Template_dat{
/*id*/
public f_id:number;
/*怪物模板id*/
public f_monster_template_id:number;
/*怪物名称*/
public f_monster_name:string;
/*移动速度*/
public f_10003:string;
/*形象id*/
public f_imageid:number;
/*头像id*/
public f_headid:number;
/*怪物描述*/
public f_des:string;
/*序列关键帧*/
public f_frame:string;
/*默认帧数*/
public f_frame_number:number;
/*怪物受击音效id*/
public f_sound:number;
}

export class t_Month_Card_dat{
/*id*/
public f_id:number;
/*一次性奖励*/
public f_item:string;
/*每日领取*/
public f_Daily:string;
/*领取时限*/
public f_limit_time:number;
/*充值id*/
public f_PurchaseID:number;
/*自动解锁宝箱特权*/
public f_auto_box:number;
/*减少开箱时长*/
public f_reduce_box_time:number;
}

export class t_Mythical_Choice_dat{
/*id*/
public f_id:number;
/*英雄id*/
public f_heroid:number;
/*英雄对应道具id*/
public f_itemid:number;
/*原价*/
public f_original_price:string;
/*购买价格*/
public f_price:string;
/*排序*/
public f_sort:number;
/*英雄选择界面偏移*/
public f_choice_offset:number;
/*英雄展示界面偏移*/
public f_display_offset:number;
}

export class t_Pack_Code_dat{
/*id*/
public f_id:number;
/*批次号*/
public f_code:string;
/*奖励内容*/
public f_Reward:string;
/*失效时间*/
public f_expiredtime:string;
/*平台类型*/
public f_PlatformType:string;
/*单个角色使用次数上限*/
public f_usemax:number;
/*需要数量*/
public f_total:number;
}

export class t_Platform_dat{
/*id*/
public f_id:number;
/*平台类型*/
public f_platform:number;
/*客户端类型*/
public f_clienttype:number;
/*关闭掉的funcid*/
public f_close_arr:string;
/*备注*/
public f_name:string;
/*关闭掉广告功能*/
public f_ad_close:number;
/*桌面场景值*/
public f_desk_scene:string;
/*是否有免除广告功能*/
public f_skipAD:number;
/*iOS渠道是否可充值*/
public f_IOSRecharge:number;
/*协议文档路径*/
public f_agree:string;
/*适龄提醒*/
public f_age:string;
/*首次隐私协议去勾选*/
public f_watch_agree:string;
/*软著*/
public f_soft:string;
/*logo动画*/
public f_title:string;
}

export class t_Player_Exp_dat{
/*id*/
public f_id:number;
/*等级*/
public f_lv:number;
/*经验值*/
public f_ExpValue:number;
/*升级奖励*/
public f_reward:string;
/*升级奖励-卡牌*/
public f_reward_card:string;
}

export class t_Purchase_Price_dat{
/*id*/
public f_id:number;
/*功能备注*/
public f_read:string;
/*价格档位*/
public f_price:number;
/*首次充值翻倍*/
public f_double:number;
/*对应的pack_controller的f_id和子id*/
public param1:string;
/*是否为代金券*/
public f_isVoucher:number;
/*关联id*/
public f_linkid:number;
}

export class t_PVE_Guide_Init_dat{
/*id*/
public f_id:number;
/*数据*/
public f_param:string;
}

export class t_PVE_Guide_Next1_dat{
/*id*/
public f_id:number;
/*类型*/
public f_type:number;
/*时间(毫秒)*/
public f_time:number;
/*参数*/
public param:string;
}

export class t_PVE_Guide_Next2_dat{
/*id*/
public f_id:number;
/*类型*/
public f_type:number;
/*时间(毫秒)*/
public f_time:number;
/*参数*/
public param:string;
}

export class t_PVE_Guide_Next3_dat{
/*id*/
public f_id:number;
/*类型*/
public f_type:number;
/*时间(毫秒)*/
public f_time:number;
/*参数*/
public param:string;
}

export class t_PVE_Tasks_Guide1_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*引导位置*/
public f_GuidePosition:string;
/*参数*/
public f_param:string;
/*是否是弱引导*/
public f_weak:number;
/*隐藏掉相关的image*/
public f_hide_img:string;
/*显示相关的image*/
public f_show_img:string;
/*功能开启目标image*/
public f_func_img:string;
/*战斗引导中的功能卡*/
public f_fight_cardId:string;
/*拖拽的地图区块位置*/
public f_grid:string;
/*提示按钮XY偏移*/
public f_XY:string;
/*小界面Y轴位置*/
public f_sviewY:number;
/*是否显示小界面:  1点击区域无效  ,2 点击任意区域下一个引导*/
public f_showsmallview:number;
/*是否是界面*/
public f_isview:number;
/*描述*/
public f_info:string;
/*语音*/
public f_audio:string;
/*tip所在的位置:上(1)下(0)右偏移(2)*/
public f_dir:number;
/*tips箭头偏移*/
public f_arrow_offsetXY:string;
/*hand偏移*/
public f_hand_offsetXY:string;
/*小手动画*/
public f_anim:string;
/*是否遮挡强制*/
public f_mask:number;
/*小箭头偏移*/
public f_little_offsetX:number;
/*是否关闭所在引导界面*/
public f_closeUI:number;
/*动画*/
public f_spine_anim:string;
/*右边栏任务面板*/
public f_guidetask:string;
/*是否是视图内部的指引*/
public f_inside_arrow:number;
/*特殊行为检测*/
public f_check_param:string;
}

export class t_PVE_Tasks_Guide2_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*引导位置*/
public f_GuidePosition:string;
/*是否是弱引导*/
public f_weak:number;
/*参数*/
public f_param:string;
/*隐藏掉相关的image*/
public f_hide_img:string;
/*显示相关的image*/
public f_show_img:string;
/*功能开启目标image*/
public f_func_img:string;
/*战斗引导中的功能卡*/
public f_fight_cardId:string;
/*拖拽的地图区块位置*/
public f_grid:string;
/*提示按钮XY偏移*/
public f_XY:string;
/*小界面Y轴位置*/
public f_sviewY:number;
/*是否显示小界面:  1点击区域无效  ,2 点击任意区域下一个引导*/
public f_showsmallview:number;
/*是否是界面*/
public f_isview:number;
/*描述*/
public f_info:string;
/*语音*/
public f_audio:string;
/*tip所在的位置:上(1)下(0)右偏移(2)*/
public f_dir:number;
/*tips箭头偏移*/
public f_arrow_offsetXY:string;
/*hand偏移*/
public f_hand_offsetXY:string;
/*小手动画*/
public f_anim:string;
/*是否遮挡强制*/
public f_mask:number;
/*小箭头偏移*/
public f_little_offsetX:number;
/*是否关闭所在引导界面*/
public f_closeUI:number;
/*动画*/
public f_spine_anim:string;
/*右边栏任务面板*/
public f_guidetask:string;
/*是否是视图内部的指引*/
public f_inside_arrow:number;
/*特殊行为检测*/
public f_check_param:string;
}

export class t_PVE_Tasks_Guide3_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*引导位置*/
public f_GuidePosition:string;
/*参数*/
public f_param:string;
/*是否是弱引导*/
public f_weak:number;
/*隐藏掉相关的image*/
public f_hide_img:string;
/*显示相关的image*/
public f_show_img:string;
/*功能开启目标image*/
public f_func_img:string;
/*战斗引导中的功能卡*/
public f_fight_cardId:string;
/*拖拽的地图区块位置*/
public f_grid:string;
/*提示按钮XY偏移*/
public f_XY:string;
/*小界面Y轴位置*/
public f_sviewY:number;
/*是否显示小界面:  1点击区域无效  ,2 点击任意区域下一个引导*/
public f_showsmallview:number;
/*是否是界面*/
public f_isview:number;
/*描述*/
public f_info:string;
/*语音*/
public f_audio:string;
/*tip所在的位置:上(1)下(0)右偏移(2)*/
public f_dir:number;
/*tips箭头偏移*/
public f_arrow_offsetXY:string;
/*hand偏移*/
public f_hand_offsetXY:string;
/*小手动画*/
public f_anim:string;
/*是否遮挡强制*/
public f_mask:number;
/*小箭头偏移*/
public f_little_offsetX:number;
/*是否关闭所在引导界面*/
public f_closeUI:number;
/*动画*/
public f_spine_anim:string;
/*右边栏任务面板*/
public f_guidetask:string;
/*是否是视图内部的指引*/
public f_inside_arrow:number;
/*特殊参数*/
public f_check_param:string;
}

export class t_PVPRound_Task_Guide1_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*引导位置*/
public f_GuidePosition:string;
/*参数*/
public f_param:string;
/*是否是弱引导*/
public f_weak:number;
/*隐藏掉相关的image*/
public f_hide_img:string;
/*显示相关的image*/
public f_show_img:string;
/*功能开启目标image*/
public f_func_img:string;
/*战斗引导中的功能卡*/
public f_fight_cardId:string;
/*拖拽的地图区块位置*/
public f_grid:string;
/*提示按钮XY偏移*/
public f_XY:string;
/*小界面Y轴位置*/
public f_sviewY:number;
/*是否显示小界面:  1点击区域无效  ,2 点击任意区域下一个引导*/
public f_showsmallview:number;
/*是否是界面*/
public f_isview:number;
/*描述*/
public f_info:string;
/*语音*/
public f_audio:string;
/*tip所在的位置:上(1)下(0)右偏移(2)*/
public f_dir:number;
/*tips箭头偏移*/
public f_arrow_offsetXY:string;
/*hand偏移*/
public f_hand_offsetXY:string;
/*小手动画*/
public f_anim:string;
/*是否遮挡强制*/
public f_mask:number;
/*小箭头偏移*/
public f_little_offsetX:number;
/*是否关闭所在引导界面*/
public f_closeUI:number;
/*动画*/
public f_spine_anim:string;
/*右边栏任务面板*/
public f_guidetask:string;
/*是否是视图内部的指引*/
public f_inside_arrow:number;
/*特殊行为检测*/
public f_check_param:string;
}

export class t_Pvp_Daily_Reward_dat{
/*id*/
public f_id:number;
/*奖励道具id*/
public f_item_id:number;
/*每日获取上限*/
public f_limit_max:number;
/*胜利掉落概率*/
public f_win_rate:number;
/*胜利掉落数量*/
public f_win_amount:string;
/*失败掉落概率*/
public f_lose_rate:number;
/*失败掉落数量*/
public f_lose_reward:string;
}

export class t_PVP_Tasks_Guide1_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*引导位置*/
public f_GuidePosition:string;
/*参数*/
public f_param:string;
/*是否是弱引导*/
public f_weak:number;
/*隐藏掉相关的image*/
public f_hide_img:string;
/*显示相关的image*/
public f_show_img:string;
/*功能开启目标image*/
public f_func_img:string;
/*战斗引导中的功能卡*/
public f_fight_cardId:string;
/*拖拽的地图区块位置*/
public f_grid:string;
/*提示按钮XY偏移*/
public f_XY:string;
/*小界面Y轴位置*/
public f_sviewY:number;
/*是否显示小界面:  1点击区域无效  ,2 点击任意区域下一个引导*/
public f_showsmallview:number;
/*是否是界面*/
public f_isview:number;
/*描述*/
public f_info:string;
/*语音*/
public f_audio:string;
/*tip所在的位置:上(1)下(0)右偏移(2)*/
public f_dir:number;
/*tips箭头偏移*/
public f_arrow_offsetXY:string;
/*hand偏移*/
public f_hand_offsetXY:string;
/*小手动画*/
public f_anim:string;
/*是否遮挡强制*/
public f_mask:number;
/*小箭头偏移*/
public f_little_offsetX:number;
/*是否关闭所在引导界面*/
public f_closeUI:number;
/*动画*/
public f_spine_anim:string;
/*右边栏任务面板*/
public f_guidetask:string;
/*是否是视图内部的指引*/
public f_inside_arrow:number;
/*特殊行为检测*/
public f_check_param:string;
}

export class t_Pvp_Unlock_Condition_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*任务需求数量*/
public f_task_amount:number;
/*任务文本*/
public t_des:string;
}

export class t_Pvp_Unlock_Reward_dat{
/*id*/
public f_id:number;
/*达成奖励*/
public f_reward:string;
}

export class t_Qualitycolor_dat{
/*id*/
public f_id:number;
/*品质*/
public f_qua:number;
/*名字*/
public f_name:string;
/*颜色*/
public f_color:string;
/*描边*/
public f_outline:string;
}

export class t_Recharge_dat{
/*id*/
public f_id:number;
/*充值id*/
public f_recharge_id:number;
/*价格档位*/
public f_price:number;
/*奖励道具*/
public f_reward:string;
/*首充是否双倍*/
public f_double:number;
/*商品名称*/
public f_name:string;
/*限购类型*/
public f_limited_type:number;
/*限购次数*/
public f_limited_amount:number;
/*活动id*/
public f_activity_id:number;
}

export class t_Redemption_Code_dat{
/*id*/
public f_id:number;
/*兑换码*/
public f_RedemptionCode:string;
/*奖励内容*/
public f_Reward:string;
/*兑换人数上限*/
public f_max:number;
/*单人可兑换次数*/
public f_Limited:number;
/*失效时间*/
public f_expiredtime:string;
/*平台类型*/
public f_PlatformType:string;
}

export class t_Reward_Rate_Coop_dat{
/*id*/
public f_id:number;
/*掉落id*/
public f_box_id:number;
/*掉落内容id*/
public f_drop_group:number;
/*掉落概率*/
public f_drop_rate:number;
/*数量*/
public f_quantity:string;
/*奖励池内容*/
public f_reward:string;
}

export class t_Robot_Config_dat{
/*id*/
public f_id:number;
/*参数配置*/
public f_robot_config:string;
}

export class t_Robot_Information_dat{
/*id*/
public f_id:number;
/*机器人id*/
public f_robot_id:number;
/*机器人行为*/
public f_robot_behavior:string;
/*机器人类型*/
public f_robot_type:number;
/*奖杯数*/
public f_trophy:number;
/*拥有神话英雄*/
public f_myth_hero:string;
/*携带卡牌*/
public f_carry_card:string;
/*普通英雄等级*/
public f_hero_level_1:number;
/*稀有英雄等级*/
public f_hero_level_2:number;
/*史诗英雄等级*/
public f_hero_level_3:number;
/*传说英雄等级*/
public f_hero_level_4:number;
/*神话英雄等级*/
public f_hero_level_5:number;
/*普通灵宝等级*/
public f_treasure_level_1:number;
/*稀有灵宝等级*/
public f_treasure_level_2:number;
/*史诗灵宝等级*/
public f_treasure_level_3:number;
/*传说灵宝等级*/
public f_treasure_level_4:number;
/*名字*/
public f_robot_name:string;
/*头像*/
public f_robot_head:number;
/*头像框*/
public f_avatar_frame:number;
/*称号*/
public f_title:number;
/*玩家等级*/
public f_level:number;
/*经验剩余*/
public f_exp:number;
/*英雄收藏*/
public f_hero_collection:number;
/*灵宝收藏*/
public f_treasure_collection:number;
/*卡牌收藏*/
public f_card_collection:number;
/*最高奖杯数*/
public f_top_trophy:number;
/*当前奖杯数*/
public f_trophy_now:number;
/*累计场次*/
public f_battle_number:number;
/*累计胜场*/
public f_win_number:number;
/*最高回合数*/
public f_round:number;
/*累计pve场次*/
public f_total_session:number;
/*累计通关场次*/
public f_total_clearance:number;
}

export class t_Server_Match_dat{
/*id*/
public f_id:number;
/*服务器id*/
public f_server_id:number;
/*所属战区*/
public f_battle_theater:number;
/*平台类型*/
public f_platform:number;
}

export class t_Server_Name_dat{
/*id*/
public f_id:number;
/*服务器id*/
public f_server_id:number;
/*战区名称*/
public f_warzone_name:string;
/*服务器前缀*/
public f_server_prefix:string;
/*战区排序*/
public f_sort:number;
/*平台类型*/
public f_PlatformType:number;
}

export class t_Setting_Subscribe_dat{
/*id*/
public f_id:number;
/*订阅类型*/
public f_subsType:number;
/*内容*/
public f_attribute:string;
/*类型*/
public f_type:number;
/*模板ID*/
public f_modelID:string;
/*文字*/
public f_reminder:string;
/*界面类型*/
public f_viewType:number;
}

export class t_Sevenday_Reward_dat{
/*id*/
public f_id:number;
/*天数*/
public f_days:number;
/*奖励*/
public f_reward:string;
}

export class t_Sevenday_Task_dat{
/*id*/
public f_id:number;
/*任务天数*/
public f_task_day:number;
/*任务类型*/
public f_task_type:number;
/*任务所需次数*/
public f_task_amount:number;
/*任务文本*/
public f_task_text:string;
/*任务奖励*/
public f_task_reward:string;
/*任务排序*/
public t_task_sort:number;
}

export class t_Sevenday_Task_Config_dat{
/*id*/
public f_id:number;
/*天数*/
public f_day:number;
/*每日大奖*/
public f_reward:string;
/*下方图标类型*/
public f_type:number;
/*显示的id*/
public f_appear_id:number;
}

export class t_Shop_dat{
/*id*/
public f_id:number;
/*商品名称*/
public f_name:string;
/*页签*/
public f_Page:number;
/*类型*/
public f_type:number;
/*banner底图*/
public f_banner:number;
/*道具下方的图*/
public f_item_pic:number;
/*售价*/
public f_Price:string;
/*充值id*/
public f_PurchaseID:number;
/*广告次数*/
public f_ad:number;
/*免费次数*/
public f_free:number;
/*奖励*/
public f_reward:string;
/*限购类型*/
public f_limit_type:number;
/*限购次数*/
public f_limit_times:number;
/*折扣比例*/
public f_discount:number;
/*首充额外送道具*/
public f_extra_item:string;
/*灵玉金币的icon*/
public f_currency_icon:number;
/*商品排序*/
public f_sort:number;
/*出现条件类型*/
public f_appear_condition_type:number;
/*出现条件数值*/
public f_appear_condition_value:number;
/*是否隐藏*/
public f_hide:number;
}

export class t_Shop_Hotsell_dat{
/*id*/
public f_id:number;
/*售价*/
public f_Price:string;
/*奖励*/
public f_reward:string;
/*折扣比例*/
public f_discount:number;
/*出现权重*/
public f_weight:number;
}

export class t_Skill_dat{
/*id*/
public f_id:number;
/*技能id*/
public f_skillid:number;
/*技能名称*/
public f_skill_name:string;
/*技能描述*/
public f_skill_dsc:string;
/*技能类型*/
public f_type:number;
/*伤害类型*/
public f_hurt_type:number;
/*技能伤害倍率*/
public f_damage_multipler:number;
/*攻击目标数量*/
public f_attack_number:number;
/*范围技能生效大小*/
public f_attack_scale:number;
/*伤害次数*/
public f_attack_time:string;
/*给敌人添加的buff*/
public f_enemy_buff:string;
/*特殊效果（改变属性数值）*/
public f_special_effect_type:string;
/*多个特殊效果*/
public f_special_effect_mult:number;
/*特殊效果（改变攻击力百分比）*/
public f_attack_effect:string;
/*特殊效果*/
public f_special_effect:string;
/*是否可叠加*/
public f_overlying:number;
/*技能消耗*/
public f_consumption:string;
/*技能触发条件*/
public f_condition:number;
/*触发条件数值*/
public f_value:number;
/*技能触发条件2*/
public f_condition2:number;
/*触发条件数值2*/
public f_value2:number;
/*技能图标*/
public f_skill_imageid:number;
/*技能动作*/
public f_skill_act:number;
/*受击目标spine动画*/
public f_hit_animation:number;
/*受击目标spine动画大小*/
public f_hit_animation_scale:number;
/*受击目标spine动画类型*/
public f_hit_animation_type:number;
/*spine特效偏移*/
public f_hit_animation_offset:string;
/*弹道spine动画*/
public f_bullet_spine:number;
/*弹道是否穿透*/
public f_bullet_spine_pass:number;
/*弹道图片*/
public f_bullet_pic:number;
/*弹道速度*/
public f_bullet_speed:number;
/*技能音效*/
public f_sound_id:number;
/*技能冷却时间*/
public f_cooldown:number;
}

export class t_Skill_Skin_dat{
/*id*/
public f_id:number;
/*技能id*/
public f_skillid:number;
/*皮肤id*/
public f_skinid:number;
/*技能动作*/
public f_skill_act:number;
/*受击目标spine动画*/
public f_hit_animation:number;
/*受击目标spine动画大小*/
public f_hit_animation_scale:number;
/*受击目标spine动画类型*/
public f_hit_animation_type:number;
/*spine特效偏移*/
public f_hit_animation_offset:string;
/*弹道spine动画*/
public f_bullet_spine:number;
/*弹道是否穿透*/
public f_bullet_spine_pass:number;
/*弹道图片*/
public f_bullet_pic:number;
/*弹道速度*/
public f_bullet_speed:number;
}

export class t_Spring_Festival_2025_Config_dat{
/*id*/
public f_id:number;
/*配置*/
public f_config:string;
}

export class t_Spring_Festival_2025_Daily_Recharge_dat{
/*id*/
public f_id:number;
/*档位*/
public f_gear:number;
/*档位价格*/
public f_gear_price:number;
/*天数*/
public f_day:number;
/*奖励*/
public f_reward:string;
}

export class t_Spring_Festival_2025_Daily_Recharge_Reward_dat{
/*id*/
public f_id:number;
/*档位*/
public f_gear:number;
/*所需累计天数*/
public f_day:number;
/*奖励*/
public f_reward:string;
}

export class t_Spring_Festival_2025_Shop_dat{
/*id*/
public f_id:number;
/*奖励*/
public f_reward:string;
/*价格*/
public f_price:string;
/*限购次数*/
public f_limit_time:number;
}

export class t_Spring_Festival_2025_Sign_dat{
/*id*/
public f_id:number;
/*天数*/
public f_day:number;
/*奖励*/
public f_reward:string;
}

export class t_stage_dat{
/*id*/
public f_id:number;
/*章节*/
public f_chapter:number;
/*波次数量*/
public f_waves:number;
/*宝箱领取条件*/
public f_reward_condition:string;
/*宝箱1奖励*/
public f_reward1:string;
/*宝箱2奖励*/
public f_reward2:string;
/*宝箱3奖励*/
public f_reward3:string;
}

export class t_System_RefreshTime_dat{
/*id*/
public f_id:number;
/*系统配置*/
public f_SystemConfig:string;
}

export class t_Tasks_Guide_dat{
/*id*/
public f_id:number;
/*任务id*/
public f_TaskID:number;
/*引导位置*/
public f_GuidePosition:string;
/*参数*/
public f_param:string;
/*是否是弱引导*/
public f_weak:number;
/*隐藏掉相关的image*/
public f_hide_img:string;
/*显示相关的image*/
public f_show_img:string;
/*功能开启目标image*/
public f_func_img:string;
/*战斗引导中的功能卡*/
public f_fight_cardId:string;
/*拖拽的地图区块位置*/
public f_grid:string;
/*提示按钮XY偏移*/
public f_XY:string;
/*小界面Y轴位置*/
public f_sviewY:number;
/*是否显示小界面1点击区域无效 2 点击任意区域下一个引导*/
public f_showsmallview:number;
/*是否是界面*/
public f_isview:number;
/*描述*/
public f_info:string;
/*语音*/
public f_audio:string;
/*tip所在的位置:上(1)下(0)右偏移(2)*/
public f_dir:number;
/*tips箭头偏移*/
public f_arrow_offsetXY:string;
/*hand偏移*/
public f_hand_offsetXY:string;
/*小手动画*/
public f_anim:string;
/*是否遮挡强制*/
public f_mask:number;
/*小箭头偏移*/
public f_little_offsetX:number;
/*是否关闭所在引导界面*/
public f_closeUI:number;
/*动画*/
public f_spine_anim:string;
/*右边栏任务面板*/
public f_guidetask:string;
/*是否是视图内部的指引*/
public f_inside_arrow:number;
/*特殊行为检测*/
public f_check_param:string;
}

export class t_Task_Type_dat{
/*id*/
public f_id:number;
/*任务类型*/
public f_task_type:number;
/*战斗类型标识*/
public f_battle_type:number;
}

export class t_Tips_dat{
/*id*/
public f_id:number;
/*提示文本*/
public f_tips:string;
}

export class t_Title_dat{
/*id*/
public f_id:number;
/*称号id*/
public f_title_id:number;
/*获取途径*/
public f_access:string;
/*默认解锁*/
public f_unlock:number;
/*默认选择*/
public f_choose:number;
/*称号icon*/
public f_title_icon:number;
/*称号排序*/
public f_sort:number;
/*称号有效期*/
public f_expiration_date:number;
/*动画*/
public f_animation:string;
}

export class t_Treasure_dat{
/*id*/
public f_id:number;
/*灵宝id*/
public f_treasureid:number;
/*灵宝名称*/
public f_treasure_name:string;
/*品质*/
public f_qua:number;
/*显示排序*/
public f_rank:number;
/*灵宝icon*/
public f_icon:number;
/*满级后碎片转换价格*/
public f_treasure_price:string;
/*灵宝碎片*/
public f_treasure_piece:number;
/*灵宝描述*/
public f_treasure_des:string;
/*未解锁时显示的灵宝效果描述*/
public f_treasure_effect_des:string;
}

export class t_Treasure_Extract_Rate_dat{
/*id*/
public f_id:number;
/*品质id*/
public f_qua:number;
/*奖励池*/
public f_reward_pool:string;
/*权重*/
public f_rate:number;
/*保底次数*/
public f_guarantees_times:number;
}

export class t_Treasure_Upgrade_dat{
/*id*/
public f_id:number;
/*灵宝id*/
public f_treasureid:number;
/*灵宝等级*/
public f_treasure_level:number;
/*升级消耗*/
public f_upgrade_consume:string;
/*效果*/
public f_effect:number;
/*效果触发概率*/
public f_trigger_probability:number;
/*效果数值*/
public f_effect_base:string;
/*效果上限*/
public f_effect_max:number;
/*获得的奖励*/
public f_effect_reward:string;
/*作用目标*/
public f_object:number;
/*作用品质*/
public f_quality:number;
/*效果描述*/
public f_effect_des:string;
}

export class t_Trophy_Rank_Reward_dat{
/*id*/
public f_id:number;
/*名次*/
public f_rank:string;
/*奖励*/
public f_weekly_reward:number;
}

export class t_Trophy_Reward_dat{
/*id*/
public f_id:number;
/*奖杯数*/
public f_trophy:number;
/*奖励内容*/
public f_reward:string;
/*赛季是否重置*/
public f_reset:number;
/*竞技场*/
public f_arena:number;
/*积分段位*/
public f_stage:string;
/*领奖台*/
public f_table:number;
/*是否为大奖*/
public f_big_prize:number;
}

export class t_Wave_dat{
/*id*/
public f_id:number;
/*波次*/
public f_waves:number;
/*对战类型*/
public f_chapter:number;
/*波次时间*/
public f_time:number;
/*boss波次时间*/
public f_time_boss:number;
/*倒计时出现*/
public f_interval:number;
/*结算基础奖励*/
public f_base_reward:string;
/*获胜结算人物经验*/
public f_player_exp_win:number;
/*失败结算人物经验*/
public f_player_exp_lose:number;
/*结算随机奖励id*/
public f_random_reward:number;
/*pve结算人物经验*/
public f_player_exp_pve:number;
/*回合基础货币*/
public f_base_currency:string;
/*拥有的法力值*/
public f_magic:number;
/*buff掉落组*/
public f_buff_drop_id:number;
}

export class t_World_Chat_Degree_dat{
/*id*/
public f_id:number;
/*最低分数*/
public f_low_score:number;
/*最高分数*/
public f_top_score:number;
/*显示的段位*/
public f_degree:number;
/*限时的段位底板*/
public f_background:number;
}

export class t_World_Chat_Emoji_dat{
/*id*/
public f_id:number;
/*表情*/
public f_emoji:number;
/*排序*/
public f_sort:number;
}
