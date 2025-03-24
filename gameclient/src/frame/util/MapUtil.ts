
export class MapUtil {

    /**
     * 是否包含Key
     * @param map 
     * @param key 
     */
    public static ContainsKey<K, V>(map: Map<K, V>, key: K): boolean {
        if (map.has(key)) {
            return true;
        }
        return false;
    }

    /**
     * 是否包含Value
     * @param map 
     * @param value 
     */
    public static ContainsValue<K, V>(map: Map<K, V>, value: V): boolean {
        for (const item of map.values()) {
            if (item == value) {
                return true;
            }
        }
        return false;
    }

    /**
     * 添加到Map
     * @param map 
     * @param key 
     * @param value 
     */
    public static Add<K, V>(map: Map<K, V>, key: K, value: V): void {
        map.set(key, value);
    }

    /**
     * Map删除Key
     * @param map 
     * @param key 
     */
    public static Remove<K, V>(map: Map<K, V>, key: K): void {
        map.delete(key);
    }

    /**
     * Map清空
     * @param map 
     */
    public static Clear<K, V>(map: Map<K, V>): void {
        map.clear();
    }

    /**
     * 获取Key对应的Value
     * @param map 
     * @param key 
     */
    public static Get<K, V>(map: Map<K, V>, key: K): V {
        if (map.has(key)) {
            return map.get(key);
        }
        return null;
    }

    /**
     * 获取Map中所有的Value
     * @param map 
     */
    public static Values<K, V>(map: Map<K, V>): V[] {

        let values: V[] = [];
        for (const item of map.values()) {
            values.push(item);
        }
        return values;
    }

    /**
     * 获取Map中所有的Keys
     * @param map 
     */
    public static Keys<K, V>(map: Map<K, V>): K[] {

        let keys: K[] = [];
        for (const item of map.keys()) {
            keys.push(item);
        }
        return keys;
    }

    /**
     * 获取Map的长度
     * @param map 
     */
    public static Count<K, V>(map: Map<K, V>): number {
        return this.Keys(map).length;// map.keys.length;
    }

    /**
     * 复制一个Map
     * @param map 要复制的Map
     * @param tar 目标Map
     */
    public static Copy<K, V>(map: Map<K, V>, tarMap: Map<K, V>): void {
        tarMap.forEach((v, k) => {
            map.set(k, v);
        });
    }

    /**
     * 数组转换成字典
     * @param array 
     * @param property 
     */
    public static arrayToMap<T, K extends keyof T>(array: Array<T>, property: K) {
        let map = new Map<T[K], T>();
        for (const item of array) {
            map.set(item[property], item);
        }
        return map;
    }
}