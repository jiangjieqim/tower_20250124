/**
 * 动作枚举
 */
export enum EAvatarAnim
{
    //无效的
    Invalid = -1,
    //=========================================
    TowerIdle = 0,
    TowerAtk = 1,
    TowerMove = 2,
    TowerSkillA = 3,
    TowerSkillB = 4,

    //怪物=========================================
    /**1-6移动 */
    MonsterMove = 0,
    /**7-12受击 */
    MonsterBeHit = 1,
    // ==============================================
}