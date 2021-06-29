export let index = import.meta.hot.data.cache &&  import.meta.hot.data.cache.getIndex ? import.meta.hot.data.cache.getIndex() : 0;

let timer;

export const render = () => {
    timer = setInterval(() => {
    index++;
    document.querySelector("#app").innerHTML = `
        <h1>Hello Vite!</h1>
        <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
        <div>test div <span>${index}</span></div>
        `;
  }, 1000);
};


if (import.meta.hot) {

    //  import.meta.hot.data 是每个模块独有的
    // 这里的 data.xxx 必须是一个引用类型，否则缓存失败
    import.meta.hot.data.cache = {
        getIndex: () => {
            return index;
        }
    }

    import.meta.hot.dispose((data) => {
        // 清理副作用
        clearInterval(timer);
    })
}