
import * as AuthApi from '../api/AuthRequests'

export const logIn =(formData)=>async(dispatch)=>{
   

    //interacting with reduces for global state management and the redux
    dispatch({type:"AUTH_START"})
    
    try {
        //yeah hui hai server se batei
        const {data}=await AuthApi.logIn(formData)


        //interact hui hai reduces se
        dispatch({type:"AUTH_SUCCESS",data:data})
    } catch (error) {
        console.log(error)
        dispatch({type:"AUTH_FAIL"})
    }
    
}

// signup ke liye
export const signUp =(formData)=>async(dispatch)=>{
   

    //interacting with reduces for global state management and the redux
    dispatch({type:"AUTH_START"})
    
    try {
        //yeah hui hai server se batei
        const {data}=await AuthApi.signUp(formData)


        //interact hui hai reduces se
        dispatch({type:"AUTH_SUCCESS",data:data})
    } catch (error) {
        console.log(error)
        dispatch({type:"AUTH_FAIL"})
    }
    
}

export const logOut=()=>async(dispatch)=>{
    dispatch({type:"LOG_OUT"})
}