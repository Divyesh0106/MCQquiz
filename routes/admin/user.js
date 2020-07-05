const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const func = require('../../config/functions');
const functions = func.func();
const userModel = require('../../models/user');
const quizModel = require('../../models/quiz');
let response = {};
/** Login User
 * @requires username,password
 * @returns userObject
 */
router.post("/login",(req,res)=>{
    var post = req.body;
    var required_params = ['username','password'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        userModel.checkAdminUserExists(post['username'],(err,userObjects)=>{
            if(userObjects.length > 0){
                bcrypt.compare(post['password'], userObjects[0].password, (err,result) => {
                    console.log("Err",err,result,post,post['password'], userObjects[0].password)
                    if (result) { 
                        let customizeObject  = {
                            _id : userObjects[0]._id,
                            username : userObjects[0].username ,                                       
                            firstName : userObjects[0].firstName,
                            lastName : userObjects[0].lastName,
                            role :userObjects[0].role  
                        }
                        response = { status : true, message : "Login successfully.", data: customizeObject }
                        res.send(response);
                    }else{
                        response = { status : false, message : "Invalid User Or Password."}
                        res.send(response);
                    }
                })
            }else{
                response = { status : false, message : "User not registered."}
                res.send(response);
            }
        })
    }else{
        var str = functions.loadErrorTemplate(elem);        
        response = {
            status : false,
            message : "Invalid request: "+ str
        }
        res.json(response);
    }
})

router.post("/userresults",(req,res)=>{
    var post = req.body;
    var required_params = ['userId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        quizModel.getAllQuizResult((err,results)=>{
            console.log("ERRR ",err,results)
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                response = { status : true, message : "success.", data: results }
                res.send(response);
            }
        })
    }else{
        var str = functions.loadErrorTemplate(elem);        
        response = {
            status : false,
            message : "Invalid request: "+ str
        }
        res.json(response); 
    }
})

module.exports = router;