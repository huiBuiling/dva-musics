import React,{Component} from 'react';
import { NavBar, Icon, Slider,Toast } from 'antd-mobile';
import { connect } from 'dva';
import classnames from 'classnames';
import PlayMusicLists from './playMusicLists';
import request from '../../utils/request';
/**
 * @author hui
 * @date 2019/1/16
 * @Description: playMusic
*/
class PlayMusic extends Component{
  constructor(props) {
      super(props);
      this.state={
        animationPuse:true,    //动画停止
        playMusicLists:false,  //列表展示
        skin:9,                //皮肤
        allTime:'00:00',       //歌曲总时间
        percentAllTime:0,      //歌曲总时长
        currentTime:'00:00',   //歌曲进度时间
        percentCurrentTime:0,  //歌曲进度时长
        // percent:0,          //进度
        volume:10,             //音量
        toggleVolume:false,    //显示音量
        playMusicCurrent: props.playMusic.playMusicCurrent,          //当前播放歌曲信息
        currentMusic:0,        //当前播放歌曲对应index
        showLyrics:false,       //显示歌词
      }
  }

  componentDidMount(){
    //刷新后至 -> myMusic
    if(this.props.playMusic.playMusicList.length === 0){
      this.props.history.push('/myMusic');
    }else{
      this.setState({
        currentMusic:this.getCurrent(null),
      });
    }
    const audio = this.refs.audio;
    audio.addEventListener('ended', this.isEnd, false);

    //滚动监听
    // window.addEventListener('scroll', this.scrollLyrics);
  }

  //判断歌曲是否播放完畢
  isEnd = ()=>{
    console.log('播放完毕');
    if(this.props.playMusic.playMusicList.length > 0) {
      this.checkMusic(true, null);
    }
  }

  //判断歌词是否需滚动
  scrollLyrics = ()=>{}

  //获取总时长和播放时间
  time = (flag,isSet)=>{
    const audio = this.refs.audio;
    if(audio) {
      //时长转换
      let time = 0, minute = 0, second = 0;
      if (flag === 1) {
        time = audio.duration;
      } else if (flag === 2) {
        time = audio.currentTime;
      }

      minute = parseInt(time / 60);
      second = Math.round(time % 60);

      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }

      let currentTime = `${minute}:${second}`;
      if(isSet){  //是否需更新值
        if(flag === 1){  //总时长和总进度
          this.setState({
            allTime:currentTime,
            percentAllTime:time
          });
        }else if(flag === 2){  // 当前时长和进度
          this.setState({
            currentTime,
            percentCurrentTime:time
          });
        }
      }
      return currentTime;
    }
  }

  //播放|暂停音乐
  playAudio = ()=>{
    const { animationPuse,volume} = this.state;
    console.log(animationPuse);
    const audio = this.refs.audio;
    if(audio && animationPuse){
      console.log('开始播放');
      audio.volume = (volume / 100);
      audio.play();

      const currentTime = this.time(2,false);  //获取播放进度
      const allTime = this.time(1,false);  //获取总时长

      this.setState({
        animationPuse:!animationPuse,
        allTime, currentTime
      });

    }else if(audio && !animationPuse){
      console.log('停止播放');
      audio.pause();
      this.setState({animationPuse:!animationPuse});
    }
  }

  //获取歌曲MP3地址
  getCurrenturl = (current)=>{
    request(`song/url?id=${current.id}`).then(data=>{
      if(data.data.code === 200){
        this.props.dispatch({
          type:'playMusic/getPlayMusicCurrent',
          data:{
            url:data.data.data[0].url,
            id:current.id,
            name:current.name,
            imgUrl:current.al.picUrl
          }
        });
        this.setState({
          animationPuse:true
        },()=> this.playAudio());
      }
    });
  }

  //获取当前对应歌曲
  getCurrent =(id)=>{
      const { playMusicList,playMusicCurrent } = this.props.playMusic;
      let current = playMusicCurrent;
      let currentId = id ? id : playMusicCurrent.id;
      playMusicList.filter((item,index) => {
          if(item.id === currentId){
              current = index;
          }
      });
      return current;
  }

  //点击切换 | 上一首 | 下一首
  checkMusic = (flag,id)=>{
      const { playMusicList } = this.props.playMusic;
      let current = this.getCurrent(id);

      //判断是否可以进行操作
      if(current < playMusicList.length && current > -1){
        //下一首
        if(flag){
            current = current + 1;
        }else if(flag === false){
          //上一首
          current = current - 1;
        }
        this.getCurrenturl(playMusicList[current]);
        this.setState({
            currentMusic:current
        });
      }else{
        this.setState({
          animationPuse:false
        })
      }
  }

  //设置音量
  setVolume = (val)=>{
    const audio = this.refs.audio;
    audio.volume = (val / 100);
    this.setState({
      volume:val
    });
  }

  //设置进度
  setProgress = (val)=>{
    const audio = this.refs.audio;
    //更新audio进度
    audio.currentTime = val / 100 * this.state.percentAllTime;
    console.log(audio.currentTime);
    //更新当前时间及进度
    this.time(2,true);
  }

  //喜欢
  setLike = ()=>{
    // val true:like, false:unlike
    let { id,live } = this.props.playMusic.playMusicCurrent;

    request(`like?id=${id}&like=${!live}`).then(data =>{
      console.log(data);
      if(data.data.code === 301){
        Toast.info(data.data.msg, 1);
      }
      if(data.data.code === 200){
          if(!live){
            Toast.success('已添加到我的喜欢!', 1);
          }else{
            Toast.info('已取消喜欢', 1);
          }
      }
    })
  }

  render (){
      const self = this;
      let {
        animationPuse, playMusicLists, currentMusic, skin,
        showLyrics, toggleVolume, volume,
        allTime, percentAllTime,  currentTime, percentCurrentTime,
      } = this.state;
      const { playMusicList, playMusicCurrent,musicLyrics } = this.props.playMusic;

      const current = playMusicCurrent ? playMusicCurrent :{id:0, name:"", url:""};
      let img = require(`../../assets/images/playerBg/bg${skin}.jpg`);

      let percent = percentCurrentTime == 0 ? 0 : (percentCurrentTime / percentAllTime) * 100;
      return(
          <div className='m-my'>
              <div className="m-my-play"
                   style={{backgroundImage:`url(${img}`,backgroundPosition:skin > 14 ? "center left":"center"}}
              >
                  {/*top*/}
                  <NavBar
                      mode="light"
                      icon={<Icon type="left" />}
                      onLeftClick={()=> self.props.history.go(-1)}
                      rightContent={<span onClick={()=>{
                        this.setState({skin:skin < 19 ? skin+1 : 1})
                      }}><i className="icon-skin" /></span>}
                  >
                      <div>
                        <p>{current.name}</p>
                      </div>
                  </NavBar>

                  <div className="m-my-play-volume">
                      <span onClick={()=>this.setState({toggleVolume:!toggleVolume})}><i className="icon-bf-volume" /></span>
                      <Slider
                          style={{display: toggleVolume ? 'block':'none'}}
                          defaultValue={volume}
                          min={0}
                          max={100}
                          step={1}
                          onChange={this.setVolume}
                      />
                  </div>

                  {/*animate*/}
                  {showLyrics ?
                      <div className="m-my-play-con m-my-play-con2" onClick={()=>this.setState({showLyrics:false})}>
                            {
                                musicLyrics.map((item,index) => {
                                    const time = item !== "" && item.split("[")[1].split("]")[0].substring(0,5);
                                    return <p key={index}>
                                              {/*<span>{time}</span> - */}
                                              <span>{item.split("]")[1]}</span>
                                           </p>
                                })
                            }
                      </div>
                      :
                      <div className="m-my-play-con" onClick={()=>this.setState({showLyrics:true})}>
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
                          <span onClick={this.setLike}><i className={current.live ? "icon-bf-live":"icon-bf-unlive"} /></span>
                          <span><i className="icon-bf-xz" /></span>
                          <span><i className="icon-bf-xx" /></span>
                          <span><i className="icon-bf-more" /></span>
                      </div>
                      <div className="m-my-play-bot-c">
                          <audio
                            // controls   //显示原始样式
                            src={current.url}
                            ref='audio'
                            preload="true"
                            className="music-audio"
                            onVolumeChange={()=>console.log('改变')}
                            onCanPlay={() => this.time(1, true)}
                            onTimeUpdate={() => this.time(2, true)}
                          />
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
                          <span><i className="icon-bf-xh" /></span>
                          <span onClick={()=>this.checkMusic(false,null)}><i className="icon-bf-l" /></span>
                          <span onClick={this.playAudio}><i className={animationPuse ? "icon-bf-bf":"icon-bf-zt"} style={{fontSize:38}}/></span>
                          <span onClick={()=>this.checkMusic(true,null)}><i className="icon-bf-r" /></span>
                          <span onClick={()=>this.setState({playMusicLists:true})}><i className="icon-bf-list" /></span>
                      </div>
                  </div>

                  {/*PlayMusicLists*/}
                  {playMusicLists &&
                      <PlayMusicLists
                        close={()=>this.setState({playMusicLists:false})}
                        playMusicList={playMusicList}
                        checkMusic={this.checkMusic}
                        currentMusic={currentMusic}
                      />
                  }

              </div>
          </div>
      )
  }
}
const mapStateToProps = (state,dispatch)=>{
  return {
    playMusic:state.playMusic
  }
}
export default connect(mapStateToProps)(PlayMusic);
