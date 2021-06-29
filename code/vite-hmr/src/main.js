import "./style.css";

import { render } from "./render";

render();

if (import.meta.hot) {
  // import.meta.hot.accept();

  // 只 HMR style.css，其他文件更新时刷新页面
  // import.meta.hot.accept(["./style.css"]);

  import.meta.hot.accept(["./render.js"], ([newRenderJs]) => {
    // 做一些条件判断的逻辑
    if (newRenderJs.index > 10) {
      // 强制浏览器刷新
      import.meta.hot.invalidate();
    } else {
      newRenderJs.render();
    }
  });

  // import.meta.hot.accept((newModule) => {
  //   newModule.render();
  // });
}
