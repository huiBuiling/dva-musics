import React,{Component} from 'react';
import { Tabs, Badge, NavBar, Icon,List,SearchBar  } from 'antd-mobile';
import { connect } from 'dva';
import fetch from 'dva/fetch';

/**
 * @author hui
 * @date 2019/1/16
 * @Description: Lists
*/
class MyLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {
          name: '打上花火',
          size: '11.0M',
          singer: 'DAOKO/米津玄师',
        },
        {
          name: 'Minions Pick up Right Now',
          size: '0.4M',
          singer: 'The Funny Tone Guy',
        },
        {
          name: '当你',
          size: '9.5M',
          singer: '回音哥',
        },
      ],
      searchList:[],    //查詢結果
      val:"",           //查詢內容
      currentUrl:"",    //當前音樂地址
    }
  }

  onChange = (value) => {
    this.setState({value});
  };
  clear = () => {
    this.setState({value: ''});
  };
  handleClick = () => {
    this.manualFocusInst.focus();
  }

  //搜索音樂
  searchMusic = (val)=>{
    fetch(`http://localhost:3636/search?keywords=${val}`).then(res=>{return res.json()}).then(data=>{
      if(data.code == 200){
        this.setState({
          searchList:data.result.songs,
          val
        })
      }
    })
  }

  //获取歌曲MP3地址
  getCurrenturl = (item)=>{
    fetch(`http://localhost:3636/music/url?id=${item.id}`).then(res=>{return res.json()}).then(data=>{
      if(data.code == 200){
        this.props.dispatch({
          type:'playMusic/getPlayMusicCurrent',
          data:{
            url:data.data[0].url,
            id:item.id,
            name:item.name,
          }
        });
        this.props.history.push('/playMusic');
      }
    });
  }

  render() {
    const Item = List.Item;
    const Brief = Item.Brief;
    const { searchList, val } = this.state;
    const dataList = val === "" ? this.props.playMusicList : searchList;
    const tabs = [
      {title: <Badge text={dataList.length}>歌曲</Badge>},
      {title: <Badge dot>歌手</Badge>},
      {title: <Badge dot>专辑</Badge>},
    ]
    return (
      <div className='m-my'>
        <div className="m-my-all">
          {/*top*/}
          <NavBar
            mode="light"
            icon={<Icon type="left"/>}
            onLeftClick={() => this.props.history.push('/myMusic')}
            rightContent={<span onClick={() => {
              this.props.history.push('playMusic')
            }}><i className="icon-m-bfz"/></span>}
          >我的音乐</NavBar>

          {/*tab*/}
          <div className="m-my-tabs">
            <Tabs tabs={tabs}
                  initialPage={0}
                  onChange={(tab, index) => {
                    console.log('onChange', index, tab);
                  }}
                  onTabClick={(tab, index) => {
                    console.log('onTabClick', index, tab);
                  }}
            >
              <div className="m-my-tabs-search">
                <List className="m-my-list" renderHeader={
                  <SearchBar
                    placeholder="Search"
                    maxLength={8}
                    onChange={this.searchMusic}
                    onClear={()=>this.setState({searchList:[],val:""})}
                  />}>
                  {
                    dataList.map((item, index) => {
                      return (
                        <Item multipleLine key={index}
                              extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i className="icon-more"/></span>}
                              onClick={() => {this.getCurrenturl(item);}}
                        >
                          <span>{item.name}</span>
                          <Brief><span>9.5M</span> - <span>{val === "" ? item.ar[0].name:item.artists[0].name}</span></Brief>
                        </Item>
                      )
                    })
                  }
                </List>
              </div>
              <div className="m-my-tabs-search">
                <List className="m-my-list" renderHeader={<SearchBar placeholder="Search" maxLength={8}/>}>
                  {
                    this.state.listData.map((item, index) => {
                      return (
                        <Item multipleLine key={index}
                              extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i className="icon-more"/></span>}
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
                <List className="m-my-list" renderHeader={<SearchBar placeholder="Search" maxLength={8}/>}>
                  {
                    this.state.listData.map((item, index) => {
                      return (
                        <Item multipleLine key={index}
                              extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i
                                className="icon-more"/></span>}>
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

const mapStateToProps = (state,dispatch)=>{
  return {
    playMusicList:state.playMusic.playMusicList
  }
}
export default connect(mapStateToProps)(MyLists);
