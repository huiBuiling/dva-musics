import React,{Component} from 'react';
import { NavBar, Icon, Slider } from 'antd-mobile';
import { connect } from 'dva';
import classnames from 'classnames';
import admin from '../../assets/images/admin.png';
import PlayMusicLists from './playMusicLists';
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
        percentAllTime:0,     //歌曲总时长
        currentTime:'00:00',   //歌曲进度时间
        percentCurrentTime:0,  //歌曲进度时长
        volume:10,             //音量
        toggleVolume:false,    //显示音量
        playMusicCurrent: props.playMusic.playMusicCurrent ? props.playMusic.playMusicCurrent :{
          id:0,
          name:"",
          url:""
        }
      }
  }

  //获取总时长和播放时间
  time = (flag,isSet)=>{
    const audio = this.refs.audio;
    if(audio) {
      //时长转换
      let time = 0, minute = 0, second = 0;
      if (flag == '1') {
        time = audio.duration;
      } else if (flag == '2') {
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
      if(isSet){
        if(flag == 1){
          this.setState({
            allTime:currentTime,
            percentAllTime:time
          });
        }else if(flag == 2){
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

  //设置音量
  setVolume = (val)=>{
    const audio = this.refs.audio;
    audio.volume = (val / 100);
    this.setState({
      volume:val
    });
  }

  //获取歌曲MP3地址
  getCurrenturl = (current)=>{
    fetch(`http://localhost:3636/music/url?id=${current.id}`).then(res=>{return res.json()}).then(data=>{
      if(data.code == 200){
        this.props.dispatch({
          type:'playMusic/getPlayMusicCurrent',
          data:{
            url:data.data[0].url,
            id:current.id,
            name:current.name
          }
        });
        this.playAudio();
      }
    });
  }

  //下一首
  next = ()=>{
    const { playMusicList,playMusicCurrent } = this.props.playMusic;
    let current = playMusicCurrent;
      playMusicList.filter((item,index) => {
      if(item.id === playMusicCurrent.id){
        current = index;
      }
    });
    this.getCurrenturl(playMusicList[current + 1]);
  }

  render (){
      const self = this;
      const {
        animationPuse, playMusicLists, skin, toggleVolume, volume,
        allTime, percentAllTime,  currentTime, percentCurrentTime,
      } = this.state;
      const { playMusicList, playMusicCurrent } = this.props.playMusic;

      const current = playMusicCurrent ? playMusicCurrent :{id:0, name:"", url:""};
      let img = require(`../../assets/images/playerBg/bg${skin}.jpg`);
      //进度
      const percent = percentCurrentTime == 0 ? 10 : (percentCurrentTime / percentAllTime) * 100;

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
                          step={10}
                          onChange={this.setVolume}
                      />
                  </div>

                  {/*animate*/}
                  <div className="m-my-play-con">
                      <div className={classnames({"m-my-play-con-w":true, "animation-puse":animationPuse})}>
                          <div className="m-my-play-con-w-b">
                              <div className="m-my-play-con-w-q"></div>
                          </div>
                          <div className="m-my-play-con-w-q"></div>
                      </div>
                      <div className={classnames({"m-my-play-con-w m-my-play-con-w2":true, "animation-puse":animationPuse})}>
                          <div className="m-my-play-con-w-b">
                            <div className="m-my-play-con-w-q"></div>
                          </div>
                          <div className="m-my-play-con-w-q"></div>
                      </div>
                      <div className={classnames({"m-my-play-con-n":true, "animation-puse":animationPuse})}>
                          <img src={admin} alt=""/>
                      </div>
                  </div>

                  {/*bot*/}
                  <div className="m-my-play-bot">
                      <div className="m-my-play-bot-t">
                          <span><i className="icon-bf-live" /></span>
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
                            defaultValue={percent}
                            min={0}
                            max={100}
                            step={10}
                          />
                          <span>{allTime}</span>
                      </div>
                      <div className="m-my-play-bot-b">
                          <span><i className="icon-bf-xh" /></span>
                          <span><i className="icon-bf-l" /></span>
                          <span onClick={this.playAudio}><i className={animationPuse ? "icon-bf-bf":"icon-bf-zt"} style={{fontSize:38}}/></span>
                          <span onClick={this.next}><i className="icon-bf-r" /></span>
                          <span onClick={()=>this.setState({playMusicLists:true})}><i className="icon-bf-list" /></span>
                      </div>
                  </div>

                  {/*PlayMusicLists*/}
                  {playMusicLists && <PlayMusicLists close={()=>this.setState({playMusicLists:false})} playMusicList={playMusicList}/>}

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
