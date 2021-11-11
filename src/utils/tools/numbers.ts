//百分比格式化
export function percentFormat(row: any, column: number, cellValue: any) {
    return cellValue ? `${cellValue}%` : '-';
}

// 小数格式化
export function scaleFormat(value: any = 0, scale: number = 2) {
	return Number.parseFloat(value).toFixed(scale);
}