import React,{ Component } from 'react';
import { NavBar,SearchBar,Icon } from 'antd-mobile';
import request from "../../../utils/request";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 个性推荐 - 私人FM
*/
class privateFM extends Component{
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
                onLeftClick={() => console.log('onLeftClick')}
                rightContent={<span onClick={() => {
                    this.props.history.push('playMusic')
                }}><i className="icon-m-bfz"/></span>}
            ><SearchBar placeholder="Search" maxLength={8}/></NavBar>

            {
                this.state.recommendList.map((item,index) =>(
                    <div>{item.name}</div>
                ))
            }
        </div>
    )
  }
}

export default privateFM;
