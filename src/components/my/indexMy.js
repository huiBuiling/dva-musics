import React,{Component} from 'react';
import { NavBar, Icon,List  } from 'antd-mobile';
import { connect } from "dva";
import { withRouter } from 'dva/router';
import request from '../../utils/request';
/**
 * @author hui
 * @date 2019/1/15
 * @Description: my
 */
@withRouter
class IndexMy extends Component{
  constructor(props) {
    super(props);
    this.state={
      playListUrl:'user/playlist?uid=262606203', //歌单-接口
      createPlaylist:[],      //创建歌单-列表
      toggleCreate:true,      //创建歌单-列表-收缩
      collectPlaylist:[],     //收藏歌单-列表
      toggleCollect:false,     //收藏歌单-列表-收缩
      liveId:null,            //歌单-喜欢id
    }
  }

  componentDidMount(){
    //获取歌单
    request(this.state.playListUrl).then(data=>{
      if(data.data.code === 200) {
        this.setState({
          createPlaylist: data.data.playlist.filter(item => {
            return item.creator.province === 140000
          }),
          collectPlaylist: data.data.playlist.filter(item => {
            return item.creator.province !== 140000
          }),
          liveId: data.data.playlist[0].id
        });
      }
    })
  }

  //对应歌单详情列表
  getPlayMusicList = (id)=>{
    request(`playlist/detail?id=${id}`).then(data=>{
      if(data.data.code === 200){
        this.props.dispatch({
          type: 'playMusic/getPlayMusicList',
          data: data.data.playlist.tracks,
          // id:id
        });
        this.props.history.push(`/lists:${id}`)
      }
    })
  }

  render (){
    const Item = List.Item;
    const {toggleCreate, createPlaylist, toggleCollect, collectPlaylist } = this.state;
    return(
      <div className='m-my'>
        <div className="m-my-all">
          {/*top*/}
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => console.log('onLeftClick')}
            rightContent={<span onClick={() => {this.props.history.push('playMusic')}}><i className="icon-m-bfz" /></span>}
          >我的音乐</NavBar>

          {/*操作*/}
          <List className="m-my-cz">
            <Item
              thumb={<span><i className="icon-m-bd"/></span>}
              arrow="horizontal"
              onClick={() => {
                this.props.history.push('/lists')
              }}
            >本地音乐</Item>
            <Item
              thumb={<span><i className="icon-m-zj"/></span>}
              onClick={() => {this.props.history.push('/recordLists')}}
              arrow="horizontal"
            >最近播放</Item>
            <Item
              thumb={<span><i className="icon-m-sc"/></span>}
              onClick={() => {this.props.history.push('/collectLists')}}
              arrow="horizontal"
            >我的收藏</Item>
            {/*<Item
                          thumb={<span><i className="icon-m-sc"/></span>}
                          onClick={() => {}}
                          arrow="horizontal"
                        >我的电台</Item>*/}
          </List>

          {/*创建歌单*/}
          <div className="m-my-gd">
            <p className="m-my-gd-title" onClick={()=>this.setState({toggleCreate:!toggleCreate})}>
              <span><i className={toggleCreate ? 'icon-m-down' : 'icon-m-up'} /></span>创建的歌单({createPlaylist.length})
            </p>
            {toggleCreate && createPlaylist.map((item,index)=>{
              return (
                <div className="m-my-gd-item" key={index} onClick={() =>this.getPlayMusicList(item.id)}>
                  <img src={item.coverImgUrl} alt=""/>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.trackCount}</p>
                  </div>
                </div>
              )
            })
            }
          </div>

          {/*收藏歌单*/}
          <div className="m-my-gd">
            <p className="m-my-gd-title" onClick={()=>this.setState({toggleCollect:!toggleCollect})}>
              <span><i className={toggleCollect ? 'icon-m-down' : 'icon-m-up'} /></span>收藏的歌单({collectPlaylist.length})
            </p>
            {toggleCollect && collectPlaylist.map((item,index)=>{
              return (
                <div className="m-my-gd-item" key={index} onClick={() =>this.getPlayMusicList(item.id)}>
                  <img src={item.coverImgUrl} alt=""/>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.trackCount}</p>
                  </div>
                </div>
              )
            })
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state,dispatch) =>{
  return {
    playMusic: state.playMusic
  }
};

export default connect (mapStateToProps)(IndexMy);
