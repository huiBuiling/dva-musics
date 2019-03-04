import React, {Component} from 'react';
import { NavBar,Icon,Toast,InputItem } from 'antd-mobile';
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/2/18
 * @Description: 朋友圈 - 列表 - 对应某一条详情
 */
class DynamicDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlay:false,             //是否播放
            urlDetail:null,           //资源获取失败提示
            comments:[],              //评论
            itemId:null,              //id
            itemType:-1,              //type
            val:'',                   //输入值
            liked:[],                 //喜欢
        }
    }

    componentDidMount() {
        const { dyDetailUrl } = this.props;
        if(dyDetailUrl === 0 || dyDetailUrl === 1){
            let msg = dyDetailUrl === 0 ? '歌曲':'视频';
            Toast.fail(`${msg}资源获取失败！！！`);
            this.setState({
                urlDetail:`${msg}资源获取失败！！！`
            });
        }else{
            const audio = document.getElementById('audio');
            // 当前音乐已在播放 -> 是 -> 持续播放,设置播放状态
            if(audio.currentTime > 0 && audio.src == dyDetailUrl) {
                // 是 -> 持续播放,设置播放状态
                this.setState({
                    isPlay:true
                });
            }

            //监听播放结束，列表循环
            audio.addEventListener('ended', this.isEnd, false);
        }

        //获取评论
        this.getDetail();
    }

    componentWillUnmount(){
        //移除 audio 的事件监听
        const audio = document.getElementById('audio');
        audio.removeEventListener('ended', this.isEnd, false);

        this.setState = (state,callback)=>{
            return;
        };
    }

    //判断歌曲是否播放完畢
    isEnd = () => {
        console.log('播放完毕');
        this.setState({isPlay:false});
    }

    /**
     * 获取评论(音乐|视频)
     * id:对应资源 id
     * */
    getDetail = ()=>{
        const json = JSON.parse(this.props.dyDetail.json);
        if(json.video || json.song){
            let url = null, itemId = null, itemType = -1;
            if(json.video){
                itemId = json.video.videoId;
                itemType = 5;
                url = `comment/video?id=${itemId}`;
            }else if(json.song){
                itemId = json.song.id;
                itemType = 0;
                url = `comment/music?id=${itemId}`;
            }
            request(url).then(data =>{
                if(data.data.code === 200){
                    this.setState({
                        comments:data.data.comments,
                        itemId, itemType
                    });
                }
            }).catch(err =>{
                Toast.fail('发生错误');
            })
        }
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
    setComment = (followed,commentId)=>{
        const { itemId, itemType, val } = this.state;
        if(followed === 0 && commentId !== null){
            //删除评论
            request(`comment?t=${followed}&type=${itemType}&id=${itemId}&commentId=${commentId}`).then(data => {
                if (data.data.code === 200) {
                    Toast.success('删除评论成功！！！');
                }
            }).catch(err =>{
                Toast.fail('发生错误');
            });
        }else if(followed === 1){
            //发表评论
            if (val === '') return null;
            request(`comment?t=${followed}&type=${itemType}&id=${itemId}&content=${val}`).then(data => {
                if (data.data.code === 200) {
                    this.setState({
                        val: ''
                    }, () => Toast.success('评论成功！！！'));
                }
            }).catch(err =>{
                Toast.fail('发生错误');
            });
        }
    }

    /**
     * 点赞评论
     * param(必选参数)
     * id:对应资源 id
     * cid : 评论 id   （commentId）
     * t:1 点赞 | 0 取消点赞 （!liked）
     * tpye:
         * 0: 歌曲
         * 1: mv
         * 2: 歌单
         * 3: 专辑
         * 4: 电台
         * 5: 视频
     * comment/like?id=29178366&cid=12840183&t=1&type=0
     * */
    likedComment = (isLike,commentId,index)=>{
        let { itemId, itemType,liked } = this.state;
        const like = isLike ? 0 : 1;
        request(`comment/like?id=${itemId}&cid=${commentId}&t=${like}&type=${itemType}`).then(data => {
            if (data.data.code === 200) {
                if(like === 0){
                    liked = liked.filter(item => item !== index);
                    Toast.success('取消点赞成功！！！');
                }else{
                    Toast.success('点赞成功！！！');
                    liked.push(index);
                }
                this.setState({
                    liked
                });

            }
        }).catch(err =>{
            Toast.fail('发生错误');
        });
    }

    //播放歌曲
    playAudio = (id, name, imgUrl)=>{
        const { urlDetail, isPlay} = this.state;
        const { dyDetailUrl } = this.props;
        if(urlDetail === null){
            Toast.fail(urlDetail);
        }else{
            const audio = document.getElementById('audio');
            this.props.getCurrent({id, name, imgUrl, url:dyDetailUrl});
            if(!isPlay){
                audio.play();
            }else{
                audio.pause();
            }
        }
    }

    //评论值
    onChange = (val)=>{
        this.setState({
            val
        });
    }

    render() {
        const { dyDetail,dyDetailUrl } = this.props;
        const { comments,isPlay,val,liked } = this.state;
        const json = JSON.parse(dyDetail.json);
        let artists = json.song && json.song.artists.length === 1 && json.song.artists.length > 0 ? '' : '/';

        return (
            <div className="m-dis-dynamic m-dis-dynamic-d">
                {/*top*/}
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={this.props.showDynamicList}
                >
                    <div>
                        <p>动态</p>
                    </div>
                </NavBar>

                <div className="m-dis-dynamic-item" onClick={this.getUserDynamic}>
                    <img src={dyDetail.user.avatarUrl} alt=""/>
                    <div className="m-dis-dynamic-item-all">
                        <div className="m-dis-dynamic-item-all-title">
                            <span
                                className={dyDetail.user.followed ? "m-dis-dynamic-item-atten m-atten-y" :"m-dis-dynamic-item-atten"}
                                onClick={()=>this.setAtten(dyDetail.user.userId, dyDetail.user.followed)}>
                                {dyDetail.user.followed ? '已关注' : <span><i className="icon-d-yh-add"/>关注</span>}
                            </span>
                            <p>{dyDetail.user.nickname}</p>
                            <p className="msg"><span>{json.video && dyDetail.rcmdInfo !== null ? dyDetail.rcmdInfo.userReason : this.props.getTime(dyDetail.showTime)}</span></p>
                        </div>

                        <p>{json.msg}</p>

                        {/*song 歌曲*/}
                        {json.song &&
                            <div className="m-dis-dynamic-item-all-m" onClick={()=>this.playAudio(json.song.id,json.song.name,json.song.album.picUrl)}>
                                {/*id*/}
                                <img src={json.song.album.picUrl} alt=""/>
                                <span className="m-play">
                                    <i className={isPlay ? "icon-bf-zt":"icon-bf-bf"}/>
                                </span>
                                <div>
                                    <p>{json.song.name}</p>
                                    <p>
                                        {json.song.artists.map((itemA, indexA) => {
                                            return <span
                                                key={indexA}>{indexA === 0 ? '' : artists}{itemA.name}</span>
                                        })}
                                    </p>
                                </div>
                            </div>
                        }

                        {/*video 视频*/}
                        {json.video &&
                            <div className="m-dis-dynamic-item-all-mv">
                                <video id="video" width={`${json.video.width}px`} controls autoPlay preload="none">
                                    <source src={dyDetailUrl} type="video/mp4" />
                                </video>
                            </div>
                        }

                        {/*program 电台*/}
                        {json.program &&
                          <div className="m-dis-dynamic-item-all-m">
                            <img src={json.program.radio.picUrl} alt=""/>
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
                                    <span style={{color:'cornflowerblue'}}>@{dyDetail.user.nickname}：</span>
                                    {json.resource.content}
                                </p>
                                <p className="msg" style={{marginTop:10}}>{json.resource.resourceName}</p>
                            </div>
                        }

                        {/*img*/}
                        <div className={dyDetail.pics.length > 1 ? "m-dis-dynamic-item-all-c2" : "m-dis-dynamic-item-all-c"}>
                            <ul>
                                {dyDetail.pics.map((itemP, indexP) =>{
                                    return <li key={indexP} ><img src={itemP.originUrl} alt="" /></li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>

                <h3 className="m-dis-comments-title">评论</h3>
                <div className="m-dis-comments">
                    {comments.map((item,index) =>{
                        const likes = liked.filter(item => item === index).length;
                        if(likes > 0){
                            console.log(item.liked);
                        }
                        return <div className="m-dis-comments-item" key={index}>
                                    <img src={item.user.avatarUrl} alt=""/>
                                    <div className="m-dis-comments-item-r">
                                        <p>{item.user.nickname}</p>
                                        <p className="m-dis-time">{this.props.getTime(item.time)}</p>
                                        <p className="m-dis-comments-c" onClick={()=>this.setComment(0,item.commentId)}>
                                            {item.content}
                                        </p>
                                    </div>
                                    <div className="m-dis-comments-item-zan">
                                        <span onClick={()=>this.likedComment(item.liked,item.commentId,index)}><i style={{color:(likes || item.liked)&& 'sandybrown'}} className="icon-d-yh-zan3" />{item.likedCount === 0 ? '':item.likedCount}</span>
                                    </div>
                                </div>
                    })}
                </div>

                <div className="m-dis-comments-opera">
                    <InputItem
                        clear
                        value={val}
                        className="m-dis-comments-opera-input"
                        placeholder="请输入评论内容"
                        onChange={this.onChange}
                    />
                    <span onClick={()=>this.setComment(1,null)}><i className="icon-d-yh-send2" /></span>
                    <span><i className="icon-d-yh-zan3" /><span className="m-dis-count">{dyDetail.info.likedCount}</span></span>
                </div>
            </div>
        )
    }
}

export default DynamicDetail;
