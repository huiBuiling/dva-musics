import React, {Component} from 'react';
import { NavBar, Icon, SearchBar, Tabs } from 'antd-mobile'
import DiscoveryPersonality from './discoveryPersonality';
import DiscoveryAnchorStation from './discoveryAnchorStation';

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现
 */
class IndexDiscovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        // simulate img loading
        setTimeout(() => {
            this.setState({
                data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);
    }

    render() {
        const tabs = [
            {title: '个性推荐'},
            {title: '主播电台'},
        ];
        return (
            <div className="m-dis">
                {/*top*/}
                <NavBar
                    mode="light"
                    icon={<i style={{fontSize:23}} className="icon-dis-ly"/>}
                    onLeftClick={() => console.log('onLeftClick')}
                    rightContent={<span onClick={() => {
                        this.props.history.push('playMusic')
                    }}><i className="icon-m-bfz"/></span>}
                ><SearchBar placeholder="Search" maxLength={8}/></NavBar>

                <div className="m-dis-t">
                    <Tabs tabs={tabs}
                          initialPage={0}
                          // onChange={(tab, index) => {}}
                          // onTabClick={(tab, index) => {}}
                    >
                        {/*个性推荐*/}
                        <DiscoveryPersonality />

                        {/*主播电台*/}
                        <DiscoveryAnchorStation />
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default IndexDiscovery;
