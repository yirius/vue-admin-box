import { isObject } from "../is";

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