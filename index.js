import {createStore} from 'redux';

const history=[]; 
const reducer=(state={amount:1},action)=>{
    if(action.type==="increment"){
        return {amount:state.amount+1};
    }
    return state;
}
const store=createStore(reducer);


store.subscribe(()=>{
    history.push(store.getState())
    console.log(history);
})
setInterval(()=>{
    store.dispatch({type:'increment'});

},2000);

