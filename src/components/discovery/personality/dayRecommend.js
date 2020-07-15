import React,{ Component } from 'react';
import { NavBar,SearchBar,Icon,Toast } from 'antd-mobile';
import { withRouter } from 'dva/router';
import { api } from "../../../utils/api";
import bgImg from '../../../assets/images/dayRemmend.jpg';

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 个性推荐 - 每日歌曲推荐
*/
class DayRecommend extends Component{
  constructor(props) {
      super(props);
      this.state = {
          recommendList:[]
      }
  }

  componentDidMount() {
      //获取每日歌曲推荐
      api.personalized_songs().then(res =>{
          if(res.code === 200){
              this.setState({
                  recommendList: res.recommend
              });
          }
      }).catch(err =>{
          Toast.fail('发生错误');
      });
  }

  render(){
      const { recommendList } = this.state;
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
                <div className="m-dis-day-top">
                    {/*recommendList.length > 0 ? recommendList[0].picUrl :*/}
                    <img src={bgImg} alt=""/>
                    <span><i className="icon-d-day-t" />{recommendList.length}</span>
                </div>
                {
                    recommendList.map((item,index) =>{
                        // console.log(item.artists.length)
                        let val = item.artists.length === 1 && item.artists.length > 0? '' : '/';
                        return <div key={index} className="m-dis-day-item">
                            <img src={item.album.picUrl} alt=""/>
                            <div>
                                <p>{item.name}</p>
                                <p>
                                    {item.artists.map((itemI,indexI) => {
                                        return <span key={itemI.id}>{indexI === 0 ? '' : val}{itemI.name}</span>
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

export default withRouter(DayRecommend);
