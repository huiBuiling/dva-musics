import React, {Component} from 'react';
import { Carousel} from 'antd-mobile';
import { withRouter } from 'dva/router';
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/2/15
 * @Description: 发现 - 个性推荐 - 动态
 */
@withRouter
class PersonalityDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dynaminList:[],     //动态列表
        }
    }

    componentDidMount() {
        //获取动态
        request('event').then(data =>{
            if(data.data.code === 200){
                this.setState({
                    dynaminList:data.data.event
                });
            }
        })
    }

    render() {
        const { dynaminList } = this.state;

        return (
            <div className="m-dis-dynamic">
                {/*列表*/}
                {
                    dynaminList.map((item, index) =>{
                        console.log(item.json);
                        const json = JSON.parse(item.json);
                        //video
                        let val = json.song && json.song.artists.length === 1 ? '' : '/';
                        return <div className="m-dis-dynamic-item" key={index}>
                                    <img src={item.user.avatarUrl} alt=""/>
                                    <div className="m-dis-dynamic-item-all">
                                        <p>{item.user.nickname}</p>
                                        <p className="msg"><span>{item.info.commentThread.resourceTitle}</span></p>
                                        <p>{json.msg}</p>

                                        {/*video or song*/}
                                        {json.song ?
                                            <div className="m-dis-dynamic-item-all-m">
                                                {/*id*/}
                                                <img src={json.song.album.picUrl} alt=""/>
                                                <div>
                                                    <p>{json.song.name}</p>
                                                    <p>
                                                        {json.song.artists.map((itemA, indexA) => {
                                                            return <span
                                                                key={indexA}>{indexA == 0 ? '' : val}{indexA.name}</span>
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            :
                                            <div className="m-dis-dynamic-item-all-m">
                                                {/*videoId json.video.creator.backgroundUrl  coverUrl*/}
                                                <img src={json.video.coverUrl} />
                                                <div>
                                                    <p>{json.video.title ? json.video.title : json.video.description}</p>
                                                    <p>{json.video.creator.nickname}</p>
                                                </div>
                                            </div>
                                        }

                                        {/*img*/}
                                        <div className="m-dis-dynamic-item-all-c">
                                            {item.pics.map((itemP, indexP) =>{
                                                return <img key={indexP} src={itemP.originUrl} alt="" />
                                            })}
                                        </div>
                                    </div>
                                </div>
                    })
                }
            </div>
        )
    }
}

export default PersonalityDynamic;
