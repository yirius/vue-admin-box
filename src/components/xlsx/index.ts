import xlsx from 'xlsx';
import type {JSON2SheetOpts, WritingOptions, BookType, WorkBook} from 'xlsx';

const {utils, writeFile} = xlsx;

export interface ExcelData<T> {
    header: string[];
    results: T[];
    meta: { sheetName: string };
}

export interface JsonToSheet<T> {
    data: T[];
    header?: T;
    filename: string;
    json2sheetOpts?: JSON2SheetOpts;
    write2excelOpts?: WritingOptions;
}

export interface AoAToSheet<T> {
    data: T[][];
    header?: T[];
    filename: string;
    write2excelOpts?: WritingOptions;
}

export interface ExportModalResult {
    filename: string;
    bookType: BookType;
}

export function jsonToSheetXlsx<T>({data, header, filename, json2sheetOpts = {}, write2excelOpts = {bookType: 'xlsx'}}: JsonToSheet<T>) {
    const arrData = [...data];
    if (header) {
        arrData.unshift(header);
        json2sheetOpts.skipHeader = true;
    }

    const worksheet = utils.json_to_sheet(arrData, json2sheetOpts);

    /* add worksheet to workbook */
    const workbook: WorkBook = {
        SheetNames: [filename],
        Sheets: {
            [filename]: worksheet,
        },
    };
    /* output format determined by filename */
    writeFile(workbook, filename, write2excelOpts);
    /* at this point, out.xlsb will have been downloaded */
}

export function aoaToSheetXlsx<T>({data, header, filename, write2excelOpts = {bookType: 'xlsx'}}: AoAToSheet<T>) {
    const arrData = [...data];
    if (header) {
        arrData.unshift(header);
    }

    const worksheet = utils.aoa_to_sheet(arrData);

    /* add worksheet to workbook */
    const workbook: WorkBook = {
        SheetNames: [filename],
        Sheets: {
            [filename]: worksheet,
        },
    };
    /* output format determined by filename */
    writeFile(workbook, filename, write2excelOpts);
    /* at this point, out.xlsb will have been downloaded */
}

export default xlsx;