import {getEnv} from "@/config/env";

// 百度统计代码，需自行更换
export function baidu() {
  if(getEnv().VITE_GLOB_STATISTICS) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.text = `
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "${getEnv().VITE_GLOB_STATISTICS}";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
  `
    document.getElementsByTagName('head')[0].appendChild(script)
  }
}