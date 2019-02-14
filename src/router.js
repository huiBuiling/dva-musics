import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import Footer from './containers/footer';

import Lists from './components/my/myLists';               //我的 - 列表
import PlayMusic from './components/my/playMusic';         //我的 - 播放音乐
import RecordLists from './components/my/recordLists'      //我的 - 最近播放列表
import CollectLists from './components/my/collectLists'    //我的 - 收藏列表


function RouterConfig({history}) {
    return (
        <Router history={history}>
            <Switch>
                {/*<Route path="/" exact component={IndexPage} />*/}

                {/*发现*/}
                {/*<Route path="/discover" component={Footer} />*/}

                {/*音乐*/}
                {/*<Route path="/myMusic" component={Footer} />*/}
                <Route path="/recordLists" component={RecordLists}/>
                <Route path="/collectLists" component={CollectLists}/>
                <Route path="/lists:id" component={Lists}/>
                <Route path="/playMusic" component={PlayMusic}/>

                <Route component={Footer}/>
            </Switch>
        </Router>
    );
}

export default RouterConfig;
