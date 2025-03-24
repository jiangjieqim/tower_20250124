import { ITowerMonster } from "../ITowerMonster";

/**塔防的角色行为接口 */
export interface ITowerAvatarBehaviour{
    /**创建 */
    create():ITowerMonster;
}