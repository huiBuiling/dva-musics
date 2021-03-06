import dva from 'dva';
// import { browserHistory } from 'dva/router';
import { createBrowserHistory as createHistory } from 'history';
import es6 from 'es6-promise';
import 'animate.css/animate.min.css';
import './assets/index.css';
import './assets/app.less';
es6.polyfill();

// 1. Initialize
const app = dva({
  // history: browserHistory,
  history: createHistory(),
  initialState: {
     /*lists: {
       products:[
         { name: 'dva', id: 1 },
         { name: 'antd', id: 2 },
         { name: 'react', id: 3 },
         { name: 'vue', id: 4 },
       ],
       count:4
     }*/
  },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
// app.model(require('./models/products').default);
app.model(require('./models/playMusic').default);
app.model(require('./models/user').default);
app.model(require('./models/station').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
