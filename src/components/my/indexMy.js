import React,{Component} from 'react';
import { NavBar, Icon,List  } from 'antd-mobile';
import { withRouter } from 'dva/router';
import gd01 from '../../assets/images/gd01.jpg';
import gd02 from '../../assets/images/gd02.jpg';
import gd03 from '../../assets/images/gd03.jpg';
import feach from 'isomorphic-fetch';

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

          playListUrl:'http://localhost:3636/user/playlist?uid=262606203', //歌单-接口
          createPlaylist:[],      //创建歌单-列表
          toggleCreate:true,      //创建歌单-列表-收缩
          collectPlaylist:[],     //收藏歌单-列表
          toggleCollect:false,     //收藏歌单-列表-收缩
          liveId:null,            //歌单-喜欢id
      }
  }

  componentDidMount(){
      feach(this.state.playListUrl).then(response=>{
        return response.json();

      }).then(data=>{
          this.setState({
              createPlaylist:data.playlist.filter(item => {return item.creator.province == 140000}),
              collectPlaylist:data.playlist.filter(item => {return item.creator.province != 140000}),
              liveId:data.playlist[0].id
          });
      })
  }

  getPlayMusicList = (id)=>{
    feach(`http://localhost:3636/playlist/detail?id=${id}`).then(response=>{
      return response.json();
    }).then(data=>{
      console.log(data);
      if(data.code == 200){
        console.log(data.playlist.tracks);
        // this.props.history.push(`/lists:${id}`)
        this.props.dispatch({
          type: 'playMusic/getPlayMusicList',
          payload: data.playlist.tracks
        });
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
                          onClick={() => {}}
                          arrow="horizontal"
                        >最近播放</Item>
                        <Item
                          thumb={<span><i className="icon-m-sc"/></span>}
                          onClick={() => {}}
                          arrow="horizontal"
                        >我的收藏</Item>
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
                          <div className="m-my-gd-item" key={index} onClick={() => {this.props.history.push(`/lists${item.id}`)}}>
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

export default IndexMy;
