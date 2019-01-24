import React,{Component} from 'react';
import { Tabs, Badge, NavBar, Icon,List,SearchBar  } from 'antd-mobile';

/**
 * @author hui
 * @date 2019/1/16
 * @Description: Lists
*/
class Lists extends Component{
  constructor(props) {
      super(props);
      this.state={
          listData: [
            {
              name: '打上花火',
              size:'11.0M',
              singer: 'DAOKO/米津玄师',
            },
            {
              name: 'Minions Pick up Right Now',
              size:'0.4M',
              singer: 'The Funny Tone Guy',
            },
            {
              name: '当你',
              size:'9.5M',
              singer: '回音哥',
            },
          ],

          tabs: [
            { title: <Badge text={'8'}>歌曲</Badge> },
            { title: <Badge text={'8'}>歌手</Badge> },
            { title: <Badge dot>专辑</Badge> },
          ]
      }
  }

  onChange= (value) => {
    this.setState({ value });
  };
  clear = () => {
    this.setState({ value: '' });
  };
  handleClick = () => {
    this.manualFocusInst.focus();
  }

  render (){
      const Item = List.Item;
      const Brief = Item.Brief;
      return(
            <div className='m-my'>
                <div className="m-my-all">
                    {/*top*/}
                    <NavBar
                      mode="light"
                      icon={<Icon type="left" />}
                      onLeftClick={() => this.props.history.push('/myMusic')}
                      rightContent={<span onClick={() => {this.props.history.push('playMusic')}}><i className="icon-m-bfz" /></span>}
                    >我的音乐</NavBar>

                    {/*tab*/}
                    <div className="m-my-tabs">
                        <Tabs tabs={this.state.tabs}
                              initialPage={1}
                              onChange={(tab, index) => { console.log('onChange', index, tab); }}
                              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                        >
                            <div className="m-my-tabs-search">
                                <List className="m-my-list" renderHeader={<SearchBar placeholder="Search" maxLength={8} />}>
                                    {
                                      this.state.listData.map((item,index)=>{
                                        return (
                                          <Item multipleLine key={index} extra={<span className="m-my-list-r"><i className="icon-list-sp" /><i className="icon-more" /></span>}>
                                            <span>{item.name}</span>
                                            <Brief><span>{item.size}</span> - <span>{item.singer}</span></Brief>
                                          </Item>
                                        )
                                      })
                                    }
                                </List>
                            </div>
                            <div className="m-my-tabs-search">
                                <List  className="m-my-list" renderHeader={<SearchBar placeholder="Search" maxLength={8} />}>
                                  {
                                    this.state.listData.map((item,index)=>{
                                      return (
                                        <Item multipleLine key={index}
                                              extra={<span className="m-my-list-r"><i className="icon-list-sp" /><i className="icon-more" /></span>}
                                              onClick={() => {
                                                this.props.history.push('/playMusic')
                                              }}
                                        >
                                          <span>{item.name}</span>
                                          <Brief><span>{item.size}</span> - <span>{item.singer}</span></Brief>
                                        </Item>
                                      )
                                    })
                                  }
                                </List>
                            </div>
                            <div className="m-my-tabs-search">
                                <List  className="m-my-list" renderHeader={<SearchBar placeholder="Search" maxLength={8} />}>
                                  {
                                    this.state.listData.map((item,index)=>{
                                      return (
                                        <Item multipleLine key={index} extra={<span className="m-my-list-r"><i className="icon-list-sp" /><i className="icon-more" /></span>}>
                                          <span>{item.name}</span>
                                          <Brief><span>{item.size}</span> - <span>{item.singer}</span></Brief>
                                        </Item>
                                      )
                                    })
                                  }
                                </List>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
      )
  }
}

export default Lists;
