import action from './action';
import initailState from './state';

export default (state = initailState,{type,data})=>{
    if(action[type]){
        return action[type](state,data);
    }else{
        return state;
    }
}