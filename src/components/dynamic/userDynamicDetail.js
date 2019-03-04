import React, {Component} from 'react';
import { Toast } from 'antd-mobile';
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/2/18
 * @Description: 朋友圈 - 列表 - 用户详情 - 动态(未使用)
 */
class UserDynamicDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dynaminList:[],           //动态列表
            currentIndex:-1,          //當前歌曲
            currentUrl:null,          //当前音乐地址
            currentVideoUrl:null,     //当前视频地址
        }
    }

    componentDidMount() {
        this.getUserDynamic();
    }

    //获取对应用户动态
    getUserDynamic = ()=>{
        request('user/event?uid=108952364').then(data =>{
            if(data.data.code === 200){
                this.setState({
                    dynaminList:data.data.events
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    /**
     * 评论
     * param(必选参数)
     * t:1 发送 | 0 删除
     * tpye:
       * 0: 歌曲
       * 1: mv
       * 2: 歌单
       * 3: 专辑
       * 4: 电台
       * 5: 视频
     * id:对应资源 id
     * content :要发送的内容
     * comment?t=1&type=1&id=5436712&content=test (往广岛之恋 mv 发送评论: test)
     * comment?t=0&type=1&id=5436712&commentId=1535550516319` (在广岛之恋 mv 删除评论)
     * */
    setComment = (id,followed,type)=>{
      request(`comment?t=${followed}&type=${type}&id=${id}`).then(data => {
        // console.log(data.data)
      }).catch(err =>{
          Toast.fail('发生错误');
      });
    }

    render() {
        const { dynaminList,currentIndex,currentUrl,currentVideoUrl } = this.state;


        return (
            <div className="m-dis-dynamic" style={{height: 'calc(100% - 45px)', overflowY: 'auto'}}>
                <audio
                  // controls   //显示原始样式
                  src={currentUrl}
                  ref='audio'
                  preload="true"
                />

                {/*列表*/}
                    {
                        dynaminList.map((item, index) =>{
                            const json = JSON.parse(item.json);
                            let val = json.song && json.song.artists.length === 1 && json.song.artists.length > 0 ? '' : '/';
                            if (json.video){
                              // console.log(item.rcmdInfo)
                            }
                            return <div className="m-dis-dynamic-item" key={index} onClick={this.getUserDynamic}>
                                        <img src={item.user.avatarUrl} alt=""/>
                                        <div className="m-dis-dynamic-item-all">
                                            <div className="m-dis-dynamic-item-all-title">
                                                <span
                                                    className={item.user.followed ? "m-dis-dynamic-item-atten m-atten-y" :"m-dis-dynamic-item-atten"}
                                                    onClick={()=>this.setAtten(item.user.userId, item.user.followed)}>
                                                    {item.user.followed ? '已关注' : <span><i className="icon-d-yh-add"/>关注</span>}
                                                </span>
                                                <p>{item.user.nickname}</p>
                                                <p className="msg"><span>{json.video && item.rcmdInfo !== null ? item.rcmdInfo.userReason : this.getTime(item.showTime)}</span></p>
                                            </div>

                                            <p>{json.msg}</p>

                                            {/*song 歌曲*/}
                                            {json.song &&
                                                <div className="m-dis-dynamic-item-all-m">
                                                    {/*id*/}
                                                    <img src={json.song.album.picUrl} alt=""/>
                                                    <span className="m-play" onClick={()=>this.playAudio(index, json.song.id)}><i className={currentIndex === index ? "icon-bf-zt":"icon-bf-bf"}/></span>
                                                    <div>
                                                        <p>{json.song.name}</p>
                                                        <p>
                                                            {json.song.artists.map((itemA, indexA) => {
                                                                return <span
                                                                    key={indexA}>{indexA === 0 ? '' : val}{itemA.name}</span>
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            }

                                            {/*video 视频*/}
                                            {json.video &&
                                                <div className="m-dis-dynamic-item-all-mv">
                                                    <video id={`video${index}`} width={`${json.video.width}px`} controls={currentIndex === index ? true:false} preload="none">
                                                        <span>{currentVideoUrl}</span>
                                                        <source src={currentVideoUrl} type="video/mp4" />
                                                    </video>
                                                    <div className="m-dis-dynamic-item-all-mv-img" style={{width: `${json.video.width}`,display:currentIndex === index ? 'none':'block'}}>
                                                        <img src={json.video.coverUrl} alt="" />
                                                        <span className="m-play" onClick={()=>this.getVideoUrl(`video${index}`,json.video.videoId,index)}><i className={currentIndex === index ? "icon-bf-zt":"icon-bf-bf"}/></span>
                                                    </div>
                                                </div>
                                            }

                                            {/*program 电台*/}
                                            {json.program &&
                                              <div className="m-dis-dynamic-item-all-m">
                                                <img src={json.program.radio.picUrl} />
                                                {/*<span className="m-play" onClick={()=>this.getCurrenturl(json.video.videoId)}><i className={currentIndex == index ? "icon-bf-zt":"icon-bf-bf"}/></span>*/}
                                                <div>
                                                  <p>{json.program.radio.desc}</p>
                                                  <p><span>{json.program.radio.category}</span>{json.program.radio.name}</p>
                                                </div>
                                              </div>
                                            }

                                            {/*resource 评论*/}
                                            {json.resource &&
                                                <div className="m-dis-dynamic-item-all-m m-dis-dynamic-item-pl">
                                                    <p>
                                                        <span className="m-pl"><i className="icon-d-yh-pl-yh" /></span>
                                                        <span style={{color:'cornflowerblue'}}>@{item.user.nickname}：</span>
                                                        {json.resource.content}
                                                    </p>
                                                    <p className="msg" style={{marginTop:10}}>{json.resource.resourceName}</p>
                                                </div>
                                            }

                                            {/*img*/}
                                            <div className={item.pics.length > 1 ? "m-dis-dynamic-item-all-c2" : "m-dis-dynamic-item-all-c"}>
                                                <ul>
                                                    {item.pics.map((itemP, indexP) =>{
                                                        return <li key={indexP} ><img src={itemP.originUrl} alt="" /></li>
                                                    })}
                                                </ul>
                                            </div>

                                            <div className='m-dis-dynamic-item-opera'>
                                              <span onClick={()=>this.setLike()}><i className="icon-d-yh-zan"/>点赞({item.info.likedCount})</span>
                                              <span className="m-dis-dynamic-item-opera-zf"><i className="icon-d-yh-zf"/>转发({item.info.shareCount})</span>
                                              <span onClick={()=>this.setComment()}><i className="icon-d-yh-pl2"/>评论({item.info.commentCount})</span>
                                            </div>
                                        </div>
                                    </div>
                        })
                  }
            </div>
        )
    }
}

export default UserDynamicDetail;
