import React,{Component} from 'react';
import { NavBar, Icon, Slider } from 'antd-mobile';
import admin from '../../assets/images/admin.png';

/**
 * @author hui
 * @date 2019/1/22
 * @Description: playMusic lists
*/
class PlayMusicLists extends Component{
  constructor(props) {
      super(props);
      this.state={
        percent: 50,
      }
  }

  render (){
      return(
          <div className="m-my-play-list">
            <div>
              <div className="m-my-play-list-t">
                <span className="fl"><i className="icon-bf-list-xh" />列表循环</span>
                <span className="fr">
                  <span><i className="icon-bf-list-sc" />收藏</span>
                  <span><i className="icon-bf-list-del" /></span>
                </span>
              </div>
              <div className="m-my-play-list-b">
                <ul>
                  <li>
                    <span></span>
                    <span></span>
                  </li>
                </ul>
              </div>
              <div className="m-my-play-list-close">
                <span>关闭</span>
              </div>
            </div>
          </div>
      )
  }
}

export default PlayMusicLists;
