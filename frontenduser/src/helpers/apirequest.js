import { BASE_URL } from "./config";
import { authFunction } from "./auth";
import { toast } from "react-toastify";

const headers = (auth=false) => {
    if(auth){
    return {
        "token": authFunction.getToken(),
        "Content-Type": "application/json"
      };
    }else{
      return {        
        "Content-Type": "application/json"
      };
    }
  };
  export const instance = {
    post: async (url, data,auth=false) => {
      let options = {
        method: "POST",
        headers: headers(auth),
        body: JSON.stringify(data)
      };
  
      return fetch(`${BASE_URL}${url}`, options)
        .then(response => {
          return response.json();
        })
        .then(resJson => {
          // session expired or user auth failed
          if(resJson.status === -2){
            authFunction.logout()
          }else{
            if(resJson.status === false){
              toast.error(resJson.message)
              return resJson;
            }else{
              return resJson;
            }
          }
        });
    },   
    get: async (url) => {
      let options = {
        method: "GET"        
      };
      return fetch(`${BASE_URL}${url}`, options)
        .then(response => {
          return response.json();
        })
        .then(resJson => {
          return resJson;
        });
    }    
  };
  