import React,{ Component } from 'react';
import { NavBar,SearchBar,Icon } from 'antd-mobile';
import { withRouter } from 'dva/router';
import request from "../../../utils/request";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 个性推荐 - 每日歌曲推荐
*/
@withRouter
class DayRecommend extends Component{
  constructor(props) {
      super(props);
      this.state = {
          recommendList:[]
      }
  }

  componentDidMount() {
      //获取每日歌曲推荐
      request('recommend/songs').then(data =>{
          if(data.data.code === 200){
              this.setState({
                  recommendList:data.data.recommend
              });
          }
      });
  }

  render(){
    return (
        <div className="m-dis">
            {/*top*/}
            <NavBar
                mode="light"
                icon={<Icon type="left"/>}
                onLeftClick={() => this.props.history.go(-1)}
                rightContent={<span onClick={() => {
                    this.props.history.push('playMusic')
                }}><i className="icon-m-bfz"/></span>}
            ><SearchBar placeholder="Search" maxLength={8}/></NavBar>

            <div className="m-dis-day">
                {
                    this.state.recommendList.map((item,index) =>{
                        console.log(item.artists.length)
                        let val = item.artists.length === 1 ? '' : '/';
                        return <div key={index} className="m-dis-day-item">
                            <img src={item.album.picUrl} alt=""/>
                            <div>
                                <p>{item.name}</p>
                                <p>
                                    {item.artists.map((itemI,indexI) => {
                                        return <span key={itemI.id}>{indexI == 0 ? '' : val}{itemI.name}</span>
                                    })}
                                    <span> - {item.album.name}</span>
                                </p>
                            </div>

                        </div>
                    })
                }
            </div>
        </div>
    )
  }
}

export default DayRecommend;
