import React, {Component} from 'react';
import {NavBar, Icon, Slider, Toast,Button} from 'antd-mobile';
import {connect} from 'dva';
import classnames from 'classnames';
import PlayMusicLists from './playMusicLists';
import { api } from "../../utils/api";

/**
 * @author hui
 * @date 2019/1/16
 * @Description: playMusic
 */
class PlayMusic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animationPuse: true,    // 动画停止
            playMusicLists: false,  // 列表展示
            skin: 2,                // 皮肤
            allTime: '00:00',       // 歌曲总时间
            percentAllTime: 0,      // 歌曲总时长
            currentTime: '00:00',   // 歌曲进度时间
            percentCurrentTime: 0,  // 歌曲进度时长
            // percent:0,           // 进度
            volume: 70,             // 音量
            toggleVolume: false,    // 显示音量
            playMusicCurrent: props.playMusic.playMusicCurrent,          //当前播放歌曲信息
            currentMusic: 0,        // 当前播放歌曲对应index
            showLyrics: false,      // 显示歌词
            musicLyrics: [],        // 歌词
        }

        this.isEnd = this.isEnd.bind(this);
    }

    componentDidMount() {
        //刷新后至 -> music
        const { playMusicCurrent, playMusicList } = this.props.playMusic;
        if(playMusicCurrent.url === null) {
            Toast.fail('歌曲资源地址获取失败！');
            // const timer = setTimeout(() => {
            //     clearTimeout(timer);
            //     this.props.history.go(-1);
            // }, 3000)

            // 获取当前歌曲列表
            if(playMusicList.length > 0) {
                const current = this.getCurrent(playMusicCurrent.id);
                this.next(playMusicList, current);
            }
        } else {
            if(playMusicCurrent.id === null){
                this.props.history.push('/music');
            } else {
                const audio = document.getElementById('audio');
                if(playMusicCurrent.isPlay){
                    // 列表点击进入
                    if(audio.src == playMusicCurrent.url){
                        // 当前音乐已在播放
                        this.setState({animationPuse:false}, ()=>{
                            this.time(1, true);
                        });
                    }else{
                        this.playAudio(playMusicCurrent.url);
                    }
                }else{
                    //判断是否在播放
                    if(audio.currentTime > 0){
                        this.setState({animationPuse:false}, ()=>{
                            this.time(1, true);
                        });
                    }
                }
    
                //时长改变
                audio.addEventListener('durationchange', ()=>{this.time(1, true);});
    
                //监听进度
                audio.addEventListener('timeupdate', ()=>{this.time(2, true)});
    
                //监听播放结束，列表循环
                audio.addEventListener('ended', this.isEnd, false);
            }
        }
        
    }

    componentWillUnmount(){
        //移除 audio 的事件监听
        const audio = document.getElementById('audio');
        audio.removeEventListener('durationchange', ()=>{this.time(1, true);});
        audio.removeEventListener('timeupdate', ()=>{this.time(2, true)});
        audio.removeEventListener('ended', this.isEnd, false);

        this.setState = (state,callback)=>{
            return;
        };
    }

    //歌曲播放完畢
    isEnd = () => {
        console.log('播放完毕');
        this.setState({animationPuse:true});
        const { playMusicList, playMusicCurrent } = this.props.playMusic;
        if (playMusicList.length > 1) {
            this.checkMusic(true, null);
        }else{
            const data = {...playMusicCurrent,isPlay:false};
            console.log(data)
            this.props.dispatch({
                type:'playMusic/getPlayMusicCurrent',
                data:data
            })
        }
    }

    //获取总时长和播放时间
    time = (flag, isSet) => {
        const audio = document.getElementById('audio');
        if (audio) {
            //时长转换
            let time = flag === 1 ? audio.duration : audio.currentTime;
            let minute = parseInt(time / 60);
            let second = Math.round(time % 60);

            if (minute < 10) {
                minute = "0" + minute;
            }
            if (second < 10) {
                second = "0" + second;
            }

            let currentTime = `${minute}:${second}`;
            if (isSet) {  //是否需更新值
                if (flag === 1) {  //总时长和总进度
                    this.setState({
                        allTime: currentTime,
                        percentAllTime: time
                    });
                } else if (flag === 2) {  // 当前时长和进度
                    this.setState({
                        currentTime,
                        percentCurrentTime: time
                    });
                }
            }
            // return currentTime;
        }
    }

    //播放|暂停音乐
    playAudio = (url) => {
        const {animationPuse, volume} = this.state;
        const audio = document.getElementById('audio');
        if (audio) {
            if (animationPuse) {
                audio.volume = (volume / 100);
                audio.src = url;
                audio.load();

                audio.play();
            } else {
                audio.pause();
            }
            this.setState({animationPuse: !animationPuse});
        }
    }

    //获取当前对应歌曲下标
    getCurrent = (id) => {
        const {playMusicList, playMusicCurrent} = this.props.playMusic;
        let current = playMusicCurrent;
        let currentId = id ? id : playMusicCurrent.id;
        current = playMusicList.findIndex(item => item.id === currentId)
        return current;
    }

    //点击切换: 上一首 | 下一首
    checkMusic = (flag, id) => {
        const { playMusicList } = this.props.playMusic;
        const current = this.getCurrent(id);

        if(flag) {
            this.next(playMusicList, current);
        } else {
            this.prev(playMusicList, current);
        }
    }

    // 上一首
    prev = (playMusicList, current) => {
        if(current <= 0) {
            Toast.info(`当前歌曲是第一首歌曲！`);
            this.stopMusic();
        } else {
            current = current - 1;
            this.getCurrenturl(playMusicList, current, false);
        }
    }

    // 下一首
    next = (playMusicList, current) => {
        if(current === (playMusicList.length - 1)) {
            Toast.info(`当前歌曲是最后一首歌曲！`);
            this.stopMusic();
        } else {
            current = current + 1;
            this.getCurrenturl(playMusicList, current, true);
        }
    }

    // 停止播放
    stopMusic = () => {
        const audio = document.getElementById('audio');
        audio.pause();
        audio.src = null;
        this.setState({
            animationPuse: true
        });
    }

    //获取歌曲MP3地址
    getCurrenturl = (playMusicList, current, flag = true) => {
        const currentData = playMusicList[current];
        //已有url直接播放
        if(currentData.url !== null && currentData.url !== undefined ){
            this.setCurrentMusic(currentData, current)
        } else {
            api.song_url(currentData.id).then(res => {
                if(res.data[0].url !== null) {
                    const data = {
                        ...currentData,
                        url: res.data[0].url,
                    };
                    this.setCurrentMusic(data, current)
                } else {
                    const { playMusicList } = this.props.playMusic;
                    if(flag) {
                        this.next(playMusicList, current);
                    } else {
                        this.prev(playMusicList, current);
                    }
                }
                
            })
        }
    }

    setCurrentMusic = (data, current) => {
        this.props.dispatch({
            type: 'playMusic/getPlayMusicCurrent',
            data: data
        });
        this.setState({
            currentMusic: current,
            animationPuse: true
        }, () => this.playAudio(data.url));
    }

    // 设置url
    // checkSetUrl = (playMusicList, current, flag) => {
    //     const currentData = playMusicList[current];
    //     //已有url直接播放
    //     if(currentData.url !== null && currentData.url !== undefined ){
    //         this.props.dispatch({
    //             type: 'playMusic/getPlayMusicCurrent',
    //             data: currentData
    //         });
    //         this.setState({
    //             currentMusic: current,
    //             animationPuse: true
    //         }, () => this.playAudio(currentData.url));
    //     }else{
    //         //获取url
    //         this.getCurrenturl(currentData.id, flag);
    //     }
    // }

    //设置音量
    setVolume = (val) => {
        const audio = document.getElementById('audio');
        audio.volume = (val / 100);
        this.setState({
            volume: val
        });
    }

    //设置进度
    setProgress = (val) => {
        const audio = document.getElementById('audio');
        //更新audio进度
        audio.currentTime = val / 100 * this.state.percentAllTime;
        //更新当前时间及进度
        this.time(2, true);
    }

    //喜欢
    setLike = () => {
        const { playMusicCurrent } = this.props.playMusic;
        api.song_liked(playMusicCurrent.id, playMusicCurrent.live).then(res => {
            if (!playMusicCurrent.live) {
                Toast.success('已添加到我的喜欢!', 1);
            } else {
                Toast.info('已取消喜欢', 1);
            }

            this.props.dispatch({
                type: 'playMusic/playMusicCurrent',
                data: {
                    ...playMusicCurrent,
                    live: !playMusicCurrent.live
                }
            })

        })
    }

    // 显示歌词
    showLyricsDetail = (id) => {
        if(this.state.showLyrics) {
            this.setState({
                showLyrics: true,
                playMusicLists:false
            })
        } else {
            this.getMusicLyrics(id);
        }
    }
    
    // 获取歌词
    getMusicLyrics = (id) => {
        api.song_lyric(id).then(res => {
            const musicLyrics = res.lrc.lyric.split("\n");
            this.setState({
                musicLyrics,
                showLyrics: true,
                playMusicLists: false
            })
        })
    }

    //判断歌词是否需滚动
    scrollLyrics = () => {}

    render() {
        const self = this;
        let {
            animationPuse, playMusicLists, skin,
            showLyrics, toggleVolume, volume,
            allTime, percentAllTime, currentTime, percentCurrentTime,
            musicLyrics
        } = this.state;
        const {playMusicList, playMusicCurrent} = this.props.playMusic;

        const current = playMusicCurrent ? playMusicCurrent : {id: 0, name: "", url: ""};
        let img = require(`../../assets/images/playerBg/bg${skin}.jpg`);

        let percent = percentCurrentTime == 0 ? 0 : (percentCurrentTime / percentAllTime) * 100;
        return (
            <div className='m-my'>
                <div className="m-my-play"
                     style={{backgroundImage: `url(${img}`, backgroundPosition: skin > 14 ? "center left" : "center"}}
                >
                    {/*top*/}
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => self.props.history.go(-1)}
                        rightContent={<span onClick={() => {
                            this.setState({skin: skin < 3 ? skin + 1 : 1})
                        }}><i className="icon-skin"/></span>}
                    >
                        <div>
                            <marquee behavior="scroll"><p>{current.name}</p></marquee>
                        </div>
                    </NavBar>

                    <div className="m-my-play-volume">
                        <span onClick={() => this.setState({toggleVolume: !toggleVolume})}><i
                            className="icon-bf-volume"/></span>
                        <Slider
                            style={{display: toggleVolume ? 'block' : 'none'}}
                            defaultValue={volume}
                            min={0}
                            max={100}
                            step={1}
                            onChange={this.setVolume}
                        />
                    </div>

                    {playMusicCurrent.id !== null && playMusicCurrent.station !== null && playMusicCurrent.station !== undefined &&
                        <div className="m-my-station">
                            <img src={playMusicCurrent.station.avatarUrl} alt=""/>
                            <div>
                                <p className="m-my-station-name">{playMusicCurrent.station.nickname}</p>
                                <p>{playMusicCurrent.station.subCount}人订阅</p>
                            </div>
                            <Button onClick={this.subscribe}>
                                {
                                    playMusicCurrent.station.isSub ? '已订阅' :
                                        <span><i className="icon-live"/>订阅</span>
                                }
                            </Button>
                        </div>
                    }

                    {/*animate*/}
                    {showLyrics ?
                        <div className="m-my-play-con m-my-play-con2"
                             onClick={() => this.setState({showLyrics: false,playMusicLists:false})}>
                            {
                                musicLyrics.map((item, index) => {
                                    // const time = item !== "" && item.split("[")[1].split("]")[0].substring(0, 5);
                                    return <p key={index}>
                                        {/*<span>{time}</span> - */}
                                        <span>{item.split("]")[1]}</span>
                                    </p>
                                })
                            }
                        </div>
                        :
                        <div className="m-my-play-con" onClick={() => this.showLyricsDetail(playMusicCurrent.id)}>
                            <div className={classnames({"m-my-play-con-w": true, "animation-puse": animationPuse})}>
                                <div className="m-my-play-con-w-b">
                                    <div className="m-my-play-con-w-q"></div>
                                </div>
                                <div className="m-my-play-con-w-q"></div>
                            </div>
                            <div className={classnames({
                                "m-my-play-con-w m-my-play-con-w2": true,
                                "animation-puse": animationPuse
                            })}>
                                <div className="m-my-play-con-w-b">
                                    <div className="m-my-play-con-w-q"></div>
                                </div>
                                <div className="m-my-play-con-w-q"></div>
                            </div>
                            <div className={classnames({"m-my-play-con-n": true, "animation-puse": animationPuse})}>
                                <img src={current.imgUrl} alt=""/>
                            </div>
                        </div>
                    }

                    {/*bot*/}
                    <div className="m-my-play-bot">
                        <div className="m-my-play-bot-t">
                            {playMusicCurrent.id !== null && playMusicCurrent.station !== null && playMusicCurrent.station !== undefined ?
                                <span className="m-my-play-num">
                                    <i className="icon-d-yh-zan3">
                                        <em>{playMusicList.filter(item => item.id === playMusicCurrent.id)[0].likedCount}</em>
                                    </i>
                                </span>
                                :
                                <span onClick={this.setLike}>
                                    <i className={current.live ? "icon-bf-live" : "icon-bf-unlive"}/>
                                </span>
                            }
                            <span><i className="icon-bf-xz"/></span>
                            <span><i className="icon-bf-xx"/></span>
                            <span><i className="icon-bf-more"/></span>
                        </div>
                        <div className="m-my-play-bot-c">
                            {/*<audio
                                // controls   //显示原始样式
                                src={current.url}
                                ref='audio'
                                preload="true"
                                className="music-audio"
                                onVolumeChange={()=>console.log('改变')}
                                onCanPlay={() => this.time(1, true)}
                                onTimeUpdate={() => this.time(2, true)}
                            />*/}
                            <span>{currentTime}</span>
                            <Slider
                                min={0}
                                max={100}
                                step={5}
                                value={percent}
                                onChange={this.setProgress}
                            />
                            <span>{allTime}</span>
                        </div>
                        <div className="m-my-play-bot-b">
                            <span><i className="icon-bf-xh"/></span>
                            <span onClick={() => this.checkMusic(false, null)}><i className="icon-bf-l"/></span>
                            <span onClick={()=>this.playAudio(current.url)}><i className={animationPuse ? "icon-bf-bf" : "icon-bf-zt"}
                                                              style={{fontSize: 38}}/></span>
                            <span onClick={() => this.checkMusic(true, null)}><i className="icon-bf-r"/></span>
                            <span onClick={() => {
                                this.setState({playMusicLists: true})
                                console.log('huihui')
                            }}><i
                                className="icon-dis-gd"/></span>
                            
                        </div>
                    </div>

                    {/*PlayMusicLists*/}
                    {playMusicLists &&
                        <PlayMusicLists
                            close={() => this.setState({playMusicLists: false})}
                            // dataList={playMusicList}
                            checkMusic={this.checkMusic}
                            current={playMusicCurrent}
                        />
                    }

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        playMusic: state.playMusic
    }
}
export default connect(mapStateToProps)(PlayMusic);
