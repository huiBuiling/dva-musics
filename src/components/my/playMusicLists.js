import React,{Component} from 'react';
import cricle from '../../assets/images/cricle.png';
import cricleUn from '../../assets/images/uncricle.png';

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
        dataList:props.playMusicList,
        isActive:0,
      }
  }

  render (){
      const { dataList,isActive } = this.state;
      return(
          <div className="m-my-play-list">
              <div className="m-my-play-list-t">
                <div className="m-my-play-list-t-t">
                  <span className="fl"><i className="icon-bf-list-xh" />列表循环</span>
                  <span className="fr">
                    <span><i className="icon-bf-list-sc" />收藏</span>
                    <span><i className="icon-bf-list-del" /></span>
                  </span>
                </div>
                <div className="m-my-play-list-t-b">
                  <ul>
                    {dataList.map((item,index)=>{
                        return <li key={index}
                                   className={isActive === index ? "active":""}
                                >
                                   <div onClick={()=>this.setState({isActive:index})}>
                                     <span><img src={isActive === index ? cricle : cricleUn} alt=""/>{item.name}</span>
                                     <span className="singer"> - </span>
                                     <span className="singer">{item.ar[0].name}</span>
                                   </div>
                                   <span onClick={()=>{
                                     this.setState({
                                       dataList:dataList.filter((itemI,indexI) => indexI !== index),
                                       isActive: isActive === index ?  -1:isActive
                                     })}
                                   }>
                                     <i className="icon-close2" />
                                   </span>
                               </li>
                    })}
                  </ul>
                </div>
              </div>

              <div className="m-my-play-list-close" onClick={this.props.close}>
                <span>关闭</span>
              </div>
          </div>
      )
  }
}

export default PlayMusicLists;
