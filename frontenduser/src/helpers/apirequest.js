import { BASE_URL } from "./config";
import { authFunction } from "./auth";

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
        headers: headers(),
        body: JSON.stringify(data)
      };
  
      return fetch(`${BASE_URL}${url}`, options)
        .then(response => {
          return response.json();
        })
        .then(resJson => {
          return resJson;
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
  