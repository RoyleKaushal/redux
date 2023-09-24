import {createStore,applyMiddleware,combineReducers} from 'redux';
import logger from 'redux-logger'
import axios from 'axios'
import thunk from 'redux-thunk'
const history=[]; 

//action name constants

const inc = "account/increment";
const dec = "account/decrement";
const incByAmt = "account/incrementByAmount";

const getAccUserPending="account/getUser/pending";
const getAccUserFullfilled="account/getUser/fullfilled";
const getAccUserRejected="account/getUser/rejected";

const incBonus="bonus/increment"

//functions for Action (Action creators)


function getAccountUserFullfilled(value){
    return {type:getAccUserFullfilled,payload:value}
}
function getAccountUserPending(){
    return {type:getAccUserPending}
}
function getAccountUserRejected(error){
    return {type:getAccUserRejected,error:error}
}
 function getUserAccount(id){
    return async(dispatch,getState)=>{
        try{
            dispatch(getAccountUserPending());
            const {data}= await axios.get(`http://localhost:3000/accounts/${id}`);
            dispatch(getAccountUserFullfilled(data.amount));
        }catch(error){
            dispatch(getAccountUserRejected(error.message));
        }
       
    }
   
}



function increment(){
    return {type:inc}
}
function decrement(){
    return {type:dec}
}
function incrementBonus(){
    return {type:incBonus}
}
function incrementByAmount(value){
    return {type:incByAmt,payload:value}
}
const accountReducer=(state={amount:1},action)=>{
    switch(action.type){
        case getAccUserFullfilled: return {amount:action.payload,pending:false};
        case getAccUserPending: return {...state,pending:true};
        case getAccUserRejected: return {...state,pending:false,error:action.error};


        case inc: return {amount:state.amount+1};
        case dec: return {amount:state.amount-1};
        case incByAmt:  return {amount:state.amount+action.payload};
        default: return state
}}
const bonusReducer=(state={points:1},action)=>{
    switch(action.type){
       
        case incBonus: return {points:state.points+1};

        case incByAmt: if(action.payload>=100){
            return {points:state.points+1};
        }
        
        default: return state
}}
const store=createStore(combineReducers({
    account:accountReducer,
    bonus:bonusReducer
}),applyMiddleware(logger.default,thunk.default));


// store.subscribe(()=>{
//     history.push(store.getState())
//     console.log(history);
// })
setTimeout(()=>{
    store.dispatch(getUserAccount(30));
    // store.dispatch(incrementByAmount(20))
    // store.dispatch(incrementBonus())


},2000);

