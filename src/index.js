import dva from 'dva';
import './index.css';

// 1. Initialize
const app = dva({
   initialState: {
     lists: {
       products:[
         { name: 'dva', id: 1 },
         { name: 'antd', id: 2 },
         { name: 'react', id: 3 },
         { name: 'vue', id: 4 },
       ],
       count:4
     }
   },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
app.model(require('./models/products').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
