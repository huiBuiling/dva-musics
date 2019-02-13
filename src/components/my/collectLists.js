import React,{Component} from 'react';
import { Tabs, Badge, NavBar, Icon,List  } from 'antd-mobile';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import request from '../../utils/request';

/**
 * @author hui
 * @date 2019/2/12
 * @Description: 我的收藏（歌手|mv）
*/
class CollectLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singerList: [],    //歌手列表
      mvList:[]          //mv列表
    }
  }

  componentDidMount(){
    //获取歌手列表
    /*request('http://localhost:3636/artist/sublist').then(data=>{
      if(data.code === 200){
        this.setState({
          singerList:data
        });
      }
    })*/

    //mv列表
    /*request('http://localhost:3636/mv/sublist').then(data=>{
      debugger
      if(data.code === 200){
        this.setState({
          mvList:data
        });
      }
    })*/
  }

  //获取歌曲MP3地址
  getCurrenturl = (item)=>{
    fetch(`http://localhost:3636/music/url?id=${item.id}`).then(res=>{return res.json()}).then(data=>{
      if(data.code === 200){
        this.props.dispatch({
          type:'playMusic/getPlayMusicCurrent',
          data:{
            url:data.data[0].url,
            id:item.id,
            name:item.name,
            imgUrl:item.al.picUrl
          }
        });
        this.getMusicLyrics(item.id);
      }
    });
  }

  //获取歌词
  getMusicLyrics = (id)=>{
    fetch(`http://localhost:3636/lyric?id=${id}`).then(res=>{return res.json()}).then(data=>{
      if(data.code === 200){
        this.props.dispatch({
          type:'playMusic/getMusicLyrics',
          data:data.lrc.lyric.split("\n")
        });
        this.props.history.push('/playMusic');
      }
    });
  }

  render() {
    const Item = List.Item;
    const Brief = Item.Brief;
    const tabs = [
      {title: <Badge dot>歌手</Badge>},
      {title: <Badge dot>MV</Badge>},
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
          >我的收藏</NavBar>

          {/*tab*/}
          <div className="m-my-tabs m-my-tabs-collect">
            <Tabs tabs={tabs} initialPage={0}>
              <div>
                <List className="m-my-list">
                  {/*{
                    this.state.listData.map((item, index) => {
                      return (
                        <Item multipleLine key={index}
                              extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i className="icon-more"/></span>}
                              onClick={() => {this.getCurrenturl(item)}}
                        >
                          <span>{item.name}</span>
                          <Brief><span>{item.size}</span> - <span>{item.singer}</span></Brief>
                        </Item>
                      )
                    })
                  }*/}
                  1111111111111111111111
                </List>
              </div>
              <div className="">
                <List className="m-my-list">
                  {/*{
                    this.state.listData.map((item, index) => {
                      return (
                        <Item multipleLine key={index}
                              extra={<span className="m-my-list-r"><i className="icon-list-sp"/><i className="icon-more"/></span>}
                              onClick={() => {this.getCurrenturl(item)}}
                        >
                          <span>{item.name}</span>
                          <Brief><span>{item.size}</span> - <span>{item.singer}</span></Brief>
                        </Item>
                      )
                    })
                  }*/}
                  222222222
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
export default connect(mapStateToProps)(CollectLists);
