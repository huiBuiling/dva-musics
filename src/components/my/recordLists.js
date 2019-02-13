import React,{Component} from 'react';
import { NavBar, Icon,List  } from 'antd-mobile';
import { connect } from 'dva';
import fetch from 'dva/fetch';

/**
 * @author hui
 * @date 2019/2/12
 * @Description: 最近播放歌曲（周|全部）
 * type=1 时只返回 weekData, type=0 时返回 allData
*/
class RecordLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordList: [],
    }
  }

  componentDidMount(){
    fetch('user/record?uid=262606203&type=1').then(res=>{return res.json()}).then(data=>{
      if(data.code === 200){
        this.setState({
          recordList:data.weekData
        });
      }
    })
  }

  //获取歌曲MP3地址
  getCurrenturl = (item)=>{
    fetch(`music/url?id=${item.id}`).then(res=>{return res.json()}).then(data=>{
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
    fetch(`lyric?id=${id}`).then(res=>{return res.json()}).then(data=>{
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
          >最近播放</NavBar>

          {/*tab*/}
          <div className="m-my-tabs">
            <List className="m-my-list">
              {
                this.state.recordList.map((item, index) => {
                  item = item.song;
                  let sizes = item.h !== null ? (item.h.size / 1024 / 1024).toFixed(1) : (item.m.size / 1024 / 1024).toFixed(2);
                  return (
                    <Item multipleLine key={index}
                          extra={<span className="m-my-list-r">
                                {item.mv !== 0 && <i className="icon-list-sp"/>}
                            <i className="icon-more"/></span>}
                          onClick={() => {this.getCurrenturl(item)}}
                    >
                      <span>{item.name}</span>
                      <Brief><span>{sizes}M</span> - <span>{item.ar[0].name}</span></Brief>
                    </Item>
                  )
                })
              }
            </List>
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
export default connect(mapStateToProps)(RecordLists);
