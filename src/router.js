import React from 'react';
import { Router, Route, Switch } from 'dva/router';
// import IndexPage from './routes/IndexPage';
import Footer from './containers/footer';  //我的

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        {/*<Route path="/" exact component={IndexPage} />*/}
        <Route path="/" component={Footer} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
