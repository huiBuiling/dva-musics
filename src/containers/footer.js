import React,{Component} from 'react';
import { TabBar } from 'antd-mobile';
import IndexMy from '../components/my/indexMy'

/**
 * @author hui
 * @date 2019/1/15
 * @Description: footer
*/
class Footer extends Component{
  constructor(props) {
      super(props);
      this.state={
        selectedTab: '音乐',
        hidden: false,

        tabBarList:[
          {
            key:'fx',
            icon:'icon-menu-fx2',
            tabName:'发现',
            seed:'menu-fx',
            content:'fx',
            path:'/discover'
          },
          {
            key:'wd',
            icon:'icon-menu-yy',
            tabName:'音乐',
            seed:'menu-w',
            content:'music',
            component:IndexMy,
            path:'/myMusic'
          },
          {
            key:'xx',
            icon:'icon-menu-xx',
            tabName:'消息',
            seed:'menu-x',
            content:'friend',
            path:'/msgs',
            dot:'1'
          },
          {
            key:'zh',
            icon:'icon-menu-zh',
            tabName:'帐号',
            seed:'menu-z',
            content:'my',
            path:'/admin'
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
                                            title={item.tabName}
                                            key={item.seed}
                                            icon={<span><i className={item.icon} /></span>}
                                            selectedIcon={<span><i className={item.icon} style={{color:'#D94038'}} /></span>}
                                            selected={this.state.selectedTab === item.tabName}
                                            badge={item.dot ? item.dot: 0}
                                              // dot
                                            onPress={() => {
                                              this.props.history.push(item.path);
                                              this.setState({selectedTab: item.tabName});
                                            }}
                                            data-seed={item.seed}
                                        >
                                            {item.tabName === '音乐' ? <Component /> : this.renderContent(item.content)}
                                        </TabBar.Item>
                                    )
                            })
                        }
                    </TabBar>
                </div>
            </div>
      )
  }
}

export default Footer;
