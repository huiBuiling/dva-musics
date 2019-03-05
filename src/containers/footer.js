import React, {Component} from 'react';
import {TabBar} from 'antd-mobile';
import {Route} from 'dva/router';
import IndexMy from '../components/my/indexMy';
import IndexDiscovery from '../components/discovery/indexDiscovery';
import IndexDynamic from '../components/dynamic/indexDynamic';
import IndexAdmin from '../components/admin/admin';

/**
 * @author hui
 * @date 2019/1/15
 * @Description: footer
 */
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: '发现',
            hidden: false,

            tabBarList: [
                {
                    key: 'fx',
                    icon: 'icon-menu-fx2',
                    tabName: '发现',
                    seed: 'menu-fx',
                    content: 'fx',
                    component: IndexDiscovery,
                    path: '/discover'
                },
                {
                    key: 'wd',
                    icon: 'icon-menu-yy',
                    tabName: '音乐',
                    seed: 'menu-w',
                    content: 'music',
                    component: IndexMy,
                    path: '/myMusic'
                },
                {
                    key: 'xx',
                    icon: 'icon-menu-xx',
                    tabName: '动态',
                    seed: 'menu-x',
                    content: 'friend',
                    component: IndexDynamic,
                    path: '/dynamic',
                    dot: '1'
                },
                {
                    key: 'zh',
                    icon: 'icon-menu-zh',
                    tabName: '帐号',
                    seed: 'menu-z',
                    content: 'my',
                    component: IndexAdmin,
                    path: '/admin'
                }
            ]
        }
    }

    renderContent(pageText) {
        return (
            <div style={{backgroundColor: 'white', height: '100%', textAlign: 'center'}}>
                <div style={{paddingTop: 60}}>Clicked “{pageText}” tab， show “{pageText}” information</div>
            </div>
        );
    }

    componentDidMount() {
        const {pathname} = this.props.location;
        let tabName = '';
        if (pathname === "/discover") {
            tabName = '发现';
        } else if (pathname === "/myMusic") {
            tabName = '音乐';
        } else if (pathname === "/dynamic") {
            tabName = '动态';
        } else if (pathname === "/admin") {
            tabName = '帐号';
        }

        this.setState({
            selectedTab: tabName
        });
    }

    render() {
        const {tabBarList, selectedTab, hidden} = this.state;
        return (
            <div className='m-footer'>
                <div style={{position: 'fixed', height: '100%', width: '100%', left:0,top: 0}}>
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#D94038"
                        barTintColor="white"
                        hidden={hidden}
                    >
                        {tabBarList.map(item => {
                            return (
                                <TabBar.Item
                                    title={item.tabName}
                                    key={item.seed}
                                    icon={<span><i className={item.icon}/></span>}
                                    selectedIcon={<span><i className={item.icon} style={{color: '#D94038'}}/></span>}
                                    selected={selectedTab === item.tabName}
                                    badge={item.dot ? item.dot : 0}
                                    // dot
                                    onPress={() => {
                                        this.props.history.push(item.path);
                                        this.setState({selectedTab: item.tabName});
                                    }}
                                    data-seed={item.seed}
                                >
                                    <Route path={item.path} component={item.component}/>
                                </TabBar.Item>
                            )
                        })}
                    </TabBar>
                </div>
            </div>
        )
    }
}

export default Footer;
