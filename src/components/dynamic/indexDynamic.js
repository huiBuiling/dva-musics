import React, {Component} from 'react';
import { NavBar, SearchBar } from 'antd-mobile';
import DynamicList from './dynamicList';

/**
 * @author hui
 * @date 2019/2/18
 * @Description: 朋友圈
 */
class IndexDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="m-dis">
                {/*<audio
                    // controls
                    ref='audio'
                    preload="true"
                    id="dy-audio"
                />*/}

                {/*top*/}
                <NavBar
                    mode="light"
                    icon={<i style={{fontSize:23}} className="icon-dis-ly"/>}
                    // onLeftClick={() => console.log('onLeftClick')}
                    rightContent={<span onClick={() => {
                        this.props.history.push('playMusic')
                    }}><i className="icon-m-bfz"/></span>}
                ><SearchBar placeholder="Search" maxLength={8}/></NavBar>

                <div className="m-dis-t">
                    <DynamicList />
                </div>
            </div>
        )
    }
}

export default IndexDynamic;
