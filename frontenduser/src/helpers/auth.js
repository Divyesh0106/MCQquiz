export const authFunction = {
        authCheck : function() {           
            let token = localStorage.getItem('token');
            console.log("token",token)
            if (token) {
                return true;    
            } else {        
                return false;
            } 
        },
        getToken : function(){
            let token = localStorage.getItem('token');
            console.log("Token",token)
            if (token) {
                return token;
            } else {        
                return "";
            } 
        },
        getUserId : function(){
            let user = JSON.parse(localStorage.getItem('user'));
            console.log("Token",user)
            if (user && user._id) {        
                return user._id;
            } else {        
                return "";
            } 
        },
        logout : function(){
            localStorage.clear();
            window.location.href = "/"
        }
}