import {isObject, isString, isArray} from "../is";

/**
 * 判断两数组是否相同
 * @param news 新数据
 * @param old 源数据
 * @returns 两数组相同返回 `true`，反之则反
 */
 export function isSameArray(news: Array<object>, old: Array<object>): boolean {
	let count = 0;
	const leng = old.length;
	for (let i in old) {
		for (let j in news) {
			if (old[i] === news[j]) count++;
		}
	}
	return count === leng ? true : false;
}

/**
 * 对象深克隆
 * @param obj 源对象
 * @returns 克隆后的对象
 */
 export function deepClone(obj: any) {
	let newObj: any;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (typeof obj[attr] === 'object') {
			newObj[attr] = deepClone(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
}

/**
 * 对参数进行合并
 * @param src 
 * @param target 
 * @returns 
 */
export function deepMerge(src: any = {}, target: any = {}) {
	let key: string;
	for (key in target) {
		src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
	}
	return src;
}

/**
 * 找到对应的key
 * @param data
 * @param index
 */
export function findObjectKey(data: Object, index: number) {
	return Object.keys(data)[index];
}

/**
 * 便捷寻找Map值
 * @param data
 * @param index
 */
export function findObjectValue(data: Object, index: number) {
	// @ts-ignore
	return data[findObjectKey(data, index)];
}

/**
 * 直接解析obj的值，进行eval设置
 * @param obj
 */
export function evalStringFunction(obj: any) {
	if(isArray(obj)) {
		obj.forEach(item => evalStringFunction(item));
	} else if(isObject(obj)) {
		for (const objKey in obj) {
			if(isString(obj[objKey]) && obj[objKey].startsWith("[`eval`]")) {
				obj[objKey] = eval(obj[objKey].replace("[`eval`]", ""));
			} else if(isArray(obj[objKey])) {
				obj[objKey].forEach((item: any) => evalStringFunction(item));
			} else if(isObject(obj[objKey])) {
				evalStringFunction(obj[objKey]);
			}
		}
	}
}