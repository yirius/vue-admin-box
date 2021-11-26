// @ts-ignore
import service from "@/utils/system/request";

const uploadHttpRequestApi = (options: any) => {
    let formData = new FormData();
    formData.append(options.filename, options.file);
    for(var i in options.data) {
        formData.append(i, options.data[i]);
    }
    let headers = options.headers;
    if(!("Content-Type" in headers)) {
        headers["Content-Type"] = "application/form-data";
    }
    return service.request({
        url: options.action,
        data: formData,
        method: options.method,
        withCredentials: options.withCredentials || false,
        headers
    });
}

export {
    uploadHttpRequestApi
}