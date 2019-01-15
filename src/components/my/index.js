import React,{Component} from 'react';
import { NavBar, Icon,List  } from 'antd-mobile';
import gd01 from '../../assets/images/gd01.jpg';
import gd02 from '../../assets/images/gd02.jpg';
import gd03 from '../../assets/images/gd03.jpg';

/**
 * @author hui
 * @date 2019/1/15
 * @Description: my
*/
class IndexMy extends Component{
  constructor(props) {
      super(props);
      this.state={
        data: [
          {
            img: gd01,
            title: '喜欢的音乐',
            num: '81',
          },
          {
            img: gd02,
            title: 'hah',
            num: '4',
          },
          {
            img: gd03,
            title: 'comon on',
            num: '10',
          },
        ],
        toggleGd:true,
      }
  }

  render (){
      const Item = List.Item;
      const {toggleGd, data } = this.state;
      return(
          <div className='music'>
              <div className='m-my'>
                  {/*top*/}
                  <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => console.log('onLeftClick')}
                    rightContent={<Icon key="1" type="ellipsis" />}
                  >我的音乐</NavBar>

                  {/*list*/}
                  <div>
                      {/*操作*/}
                      <List className="m-my-cz">
                          <Item
                            thumb={<span><i className="icon-m-bd"/></span>}
                            arrow="horizontal"
                            onClick={() => {}}
                          >本地音乐</Item>
                          <Item
                            thumb={<span><i className="icon-m-zj"/></span>}
                            onClick={() => {}}
                            arrow="horizontal"
                          >最近播放</Item>
                          <Item
                            thumb={<span><i className="icon-m-sc"/></span>}
                            onClick={() => {}}
                            arrow="horizontal"
                          >我的收藏</Item>
                      </List>

                      {/*歌单*/}
                      <div className="m-my-gd">
                           <p className="m-my-gd-title" onClick={()=>this.setState({toggleGd:!toggleGd})}>
                             <span><i className={toggleGd ? 'icon-m-down' : 'icon-m-up'} /></span>创建的歌单(11)
                           </p>
                          {toggleGd && data.map((item,index)=>{
                                  return (
                                      <div className="m-my-gd-item" key={index}>
                                          <img src={item.img} alt=""/>
                                          <div>
                                              <h3>{item.title}</h3>
                                              <p>{item.num}</p>
                                          </div>
                                      </div>
                                  )
                              })
                          }
                      </div>
                  </div>
              </div>
          </div>
      )
  }
}

export default IndexMy;
