import * as Vue from 'vue';

export const regexpMatchAndReplace = (regexpStr, willReplaceStr, modelValue) => {
    let matched = willReplaceStr.match(new RegExp(regexpStr, "g"));
    if(matched != null && matched.length > 0) {
        return replaceRegexpVar(willReplaceStr, matched, modelValue, 0);
    }

    return [willReplaceStr];
}

export const replaceRegexpVar = (willReplaceStr, matchedResult, modelValue, count) => {
    let resultData = [];
    var splited = willReplaceStr.split(matchedResult[count]);
    resultData.push(splited[0]);
    resultData.push(modelValue[matchedResult[count].replace("`${", "").replace("}`", "")]);
    if(splited[1] && matchedResult.length > (count+1)) {
        resultData = [...resultData, ...replaceRegexpVar(splited[1], matchedResult, modelValue, ++count)];
    }
    return resultData;
}