import React,{Component} from 'react';
import { NavBar, Icon, Slider } from 'antd-mobile';
import classnames from 'classnames'
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
        percent: 50,
        animationPuse:false
      }
  }

  render (){
    const { animationPuse } = this.state;
      return(
          <div className='m-my'>
              <div className="m-my-play">
                  {/*top*/}
                  <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.push('/lists')}
                    rightContent={<span><i className="icon-m-bfz" /></span>}
                  >
                    <div>
                      <p>打上花火</p>
                      <p onClick={()=>this.setState({animationPuse:!animationPuse})}>DAOKO/米津玄师</p>
                    </div>
                  </NavBar>

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
                    <div className="m-my-play-con-n">
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
                          <span>00:02</span>
                          <Slider
                            defaultValue={3}
                            min={0}
                            max={10}
                            step={0.1}
                            onChange={()=>console.log('change')}
                            onAfterChange={()=>console.log('afterChange')}
                          />
                          <span>04:34</span>
                      </div>
                      <div className="m-my-play-bot-b">
                        <span><i className="icon-bf-xh" /></span>
                        <span><i className="icon-bf-l" /></span>
                        <span><i className="icon-bf-bf" style={{fontSize:38}}/></span>
                        <span><i className="icon-bf-r" /></span>
                        <span><i className="icon-bf-list" /></span>
                      </div>
                  </div>

                  {/*PlayMusicLists*/}
                  <PlayMusicLists />

              </div>
          </div>
      )
  }
}

export default PlayMusic;