var jwt = require('jsonwebtoken');
var userModel = require("../models/user");
exports.func = function(){
    return {
        /* function to check whether required req param is exist in post or not*/
        validateReqParam : function(post, reqparam){
            var remain = [];
            var req = [];
            var invalid = []           
            for(var i=0;i<reqparam.length;i++){                
                if(typeof post[reqparam[i]]!='undefined'){                                                           
                    if(post[reqparam[i]]==''){
                        req.push(reqparam[i]);                        
                    }else{
                        if(reqparam[i] == 'email'){
                            var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if (!(emailRex.test(post[reqparam[i]]))) {
                                invalid.push(reqparam[i])
                            }
                        }else if(reqparam[i] == 'date'|| reqparam[i] == 'dateOfBirth'){
                            let date_regex = /^(0[1-9]|1[012])[- /.] (0[1-9]|[12][0-9]|3[01])[- /.]/
                            if(!date_regex.test(post[reqparam[i]])){
                                if(new Date(post[reqparam[i]]) == 'Invalid Date'){
                                    invalid.push(reqparam[i])
                                }
                            }else{
                                invalid.push(reqparam[i])
                            }
                        }else if(reqparam[i]=='maxParticipants'){
                            if(isNaN(post[reqparam[i]])){                                                                    
                                invalid.push(reqparam[i])
                            }
                        }else if(reqparam[i]=='time'){
                            let reg = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/
                            if(!reg.test(post[reqparam[i]])){                                                                    
                                invalid.push(reqparam[i])
                            }
                        }
                    }
                }else{                    
                    remain.push(reqparam[i]);
                }
            }              
            var respose = {'missing':remain,'blank':req , 'invalid':invalid};
            return respose;
        },
        loadErrorTemplate: function(elem){
            var blank_str = '', missing_str = '',invalid_str = '';    
            
            var missing = elem.missing;    
            if(missing.length>0){
                missing_str = missing.join(',');        
                missing_str+=' missing';
            }
            var blank = elem.blank;    
            if(blank.length>0){        
                blank_str = blank.join(',');        
                blank_str+=' should not be blank';
            }
            var invalid = elem.invalid;
            if(invalid.length>0){        
                invalid_str = invalid.join(',');        
                invalid_str+=' invalid';
            }
            var str = ""
            if(blank_str.trim() != '' && invalid_str.trim() != ''){
                var s1 = [blank_str, invalid_str];                
                str = s1.join(' \n ');
            }else if(missing_str.trim() != '' && blank_str.trim() != ''){
                var s2 = [blank_str, missing_str];                
                str = s2.join(' \n ');
            }else if(invalid_str.trim() != '' && missing_str.trim() != ''){
                var s3 = [missing_str, invalid_str];                
                str = s3.join(' \n ');
            }else{
                var s4 = [missing_str,blank_str,invalid_str];                
                str = s4.join(' \n ');
            }
            return str;
        },
        verifyTokenAdmin : function(req,res,next){
            var token = req.headers['token'];
            // console.log('Token',token,req.body)
            if(!token){
                return res.send({
                    status : -2,
                    message : 'No token provided'
                });
            } else{
                jwt.verify(token,process.env.JWT_SECRET_KEY,{ ignoreExpiration: true },function(err,decoded){
                    // console.log("errrr==========>",err);
                    if(err){
                        if (err.name === 'TokenExpiredError') {
                            return res.send({
                                status : -2,
                                message : 'JWT has expired. Please login again, this is for your security!'
                            }); 
                          }else{
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate token.'
                            }); 
                          }                       
                    } else{
                        console.log("both id",decoded,decoded._id,req.body)
                        if(req.body.userId != decoded._id){
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate user.'
                            }); 
                        }else{
                            userModel.getAdminUser(req.body.userId,(err,users)=>{
                                if(users.length > 0){
                                    next();
                                }else{
                                    return res.send({
                                        status : -2,
                                        message : 'User not found.'
                                    }); 
                                }
                            })
                        }
                    }
                })
            }
        },
        verifyTokenUser : function(req,res,next){
            var token = req.headers['token'];
            // console.log('Token',token,req.body)
            if(!token){
                return res.send({
                    status : -2,
                    message : 'No token provided'
                });
            } else{
                jwt.verify(token,process.env.JWT_SECRET_KEY,{ ignoreExpiration: true },function(err,decoded){
                    // console.log("errrr==========>",err);
                    if(err){
                        if (err.name === 'TokenExpiredError') {
                            return res.send({
                                status : -2,
                                message : 'JWT has expired. Please login again, this is for your security!'
                            }); 
                          }else{
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate token.'
                            }); 
                          }                       
                    } else{
                        // console.log("both id",decoded,decoded._id,req.body)
                        if(req.body.userId != decoded._id){
                            return res.send({
                                status : -2,
                                message : 'Failed to authenticate user.'
                            }); 
                        }else{
                            userModel.getUser(req.body.userId,(err,users)=>{
                                if(users.length > 0){
                                    next();
                                }else{
                                    return res.send({
                                        status : -2,
                                        message : 'User not found.'
                                    }); 
                                }
                            })
                        }
                    }
                })
            }
        }    
    }
}