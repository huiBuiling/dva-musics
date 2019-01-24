/**
 * @author hui
 * @date 2019/1/24
 * @Description: playMusic
*/
export default {
  namespace: 'playMusic',
  state: {
    playMusicList:[],
    // playMusicId:null
  },
  reducers: {
    'getPlayMusicList'(state, { payload: data }) {
      debugger
      return {
        playMusicList:state.data,
        // playMusicId:state.id
      };
    }
  },
};
