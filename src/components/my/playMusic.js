import React,{Component} from 'react';
import { NavBar, Icon } from 'antd-mobile';
import admin from '../../assets/images/admin.png';

/**
 * @author hui
 * @date 2019/1/16
 * @Description: playMusic
*/
class PlayMusic extends Component{
  constructor(props) {
      super(props);
      this.state={

      }
  }

  render (){
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
                      <p>DAOKO/米津玄师</p>
                    </div>
                  </NavBar>

                  {/*animate*/}
                  <div className="m-my-play-con">
                    {/*animated infinite rotateOut*/}
                    <div className="m-my-play-con-w">
                      {/*animated infinite rotateOut delay-2s*/}
                      <div className="">
                      </div>
                    </div>
                    {/*animated infinite heartBeat*/}
                    <div className="m-my-play-con-n">
                      <img src={admin} alt=""/>
                    </div>
                  </div>

                  {/*bot*/}
                  <div className="m-my-play-bot">

                  </div>

              </div>
          </div>
      )
  }
}

export default PlayMusic;
