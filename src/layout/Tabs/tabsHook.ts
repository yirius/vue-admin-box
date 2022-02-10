import login from "@/config/login";

const tabsHook = {
  setItem: function(arr: object[]) {
    localStorage.setItem(login.vuexPrevfix + 'tabs', JSON.stringify(arr))
  },
  getItem: function() {
    return JSON.parse(localStorage.getItem(login.vuexPrevfix + 'tabs') || '[]')
  }
}
export default tabsHook
