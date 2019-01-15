import React,{Component} from 'react';
import { TabBar } from 'antd-mobile';
import IndexMy from '../components/my/index'

/**
 * @author hui
 * @date 2019/1/15
 * @Description: footer
*/
class Footer extends Component{
  constructor(props) {
      super(props);
      this.state={
        selectedTab: '我的',
        hidden: false,

        tabBarList:[
          {
            title:'发现',
            key:'fx',
            icon:'icon-menu-fx',
            tabName:'发现',
            seed:'menu-f',
            content:'fx',
          },
          {
            title:'我的',
            key:'wd',
            icon:'icon-menu-yy',
            tabName:'我的',
            seed:'menu-w',
            content:'music',
            component:IndexMy
          },
          {
            title:'消息',
            key:'xx',
            icon:'icon-menu-xx',
            tabName:'消息',
            seed:'menu-x',
            content:'friend',
          },
          {
            title:'帐号',
            key:'zh',
            icon:'icon-menu-zh',
            tabName:'帐号',
            seed:'menu-z',
            content:'my',
          }
        ]
      }
  }

  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
      </div>
    );
  }

  render (){
      const {tabBarList} = this.state;
      return(
          <div className='music'>
              <div className='m-footer'>
                  <div style={{position: 'fixed', height: '100%', width: '100%', top: 0 }}>
                      <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#D94038"
                        barTintColor="white"
                        hidden={this.state.hidden}
                      >
                          {
                              tabBarList.map(item =>{
                                const Component = item.component;
                                  return (
                                      <TabBar.Item
                                          title={item.title}
                                          key={item.title}
                                          icon={<span><i className={item.icon} /></span>}
                                          selectedIcon={<span><i className={item.icon} style={{color:'#D94038'}} /></span>}
                                          selected={this.state.selectedTab === item.tabName}
                                          // badge={1}
                                          // dot
                                          onPress={() => {this.setState({selectedTab: item.tabName})}}
                                          data-seed={item.seed}
                                      >
                                          {item.tabName === '我的' ? <Component /> : this.renderContent(item.content)}
                                      </TabBar.Item>
                                  )
                              })
                          }
                      </TabBar>
                  </div>
              </div>
          </div>
      )
  }
}

export default Footer;
