import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import Footer from './containers/footer';

import Lists from './components/my/myLists';               //我的 - 列表
import PlayMusic from './components/my/playMusic';         //我的 - 播放音乐
import RecordLists from './components/my/recordLists'      //我的 - 最近播放列表
import CollectLists from './components/my/collectLists'    //我的 - 收藏列表

import DayRecommend from './components/discovery/personality/dayRecommend'   //发现 - 每日推荐
import StationDetail from './components/discovery/station/stationDetail'   //主播电台 - 详情


function RouterConfig({history}) {
    return (
        <div>
            {/*全局audio*/}


            <Router history={history}>
                <Switch>
                    {/*<Route path="/" exact component={IndexPage} />*/}

                    {/*发现*/}
                    <Route path="/dayRecommend" component={DayRecommend} />
                    <Route path="/stationDetail" component={StationDetail} />

                    {/*音乐*/}
                    <Route path="/recordLists" component={RecordLists}/>
                    <Route path="/collectLists" component={CollectLists}/>
                    <Route path="/lists:id" component={Lists}/>
                    <Route path="/playMusic" component={PlayMusic}/>

                    <Route component={Footer}/>
                </Switch>
            </Router>
        </div>
    );
}

export default RouterConfig;
