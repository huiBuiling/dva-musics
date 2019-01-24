import React from 'react';
import { Router, Route, Switch } from 'dva/router';
// import IndexPage from './routes/IndexPage';
import Footer from './containers/footer';          //我的
import Lists from './components/my/myLists';         //我的 - 列表
import PlayMusic from './components/my/playMusic'; //我的 - 播放音乐

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        {/*<Route path="/" exact component={IndexPage} />*/}
        <Route path="/lists:id" component={Lists} />
        <Route path="/myMusic" component={Footer} />
        <Route path="/playMusic" component={PlayMusic} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
