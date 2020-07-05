const express = require('express');
const router = express.Router();
const func = require('../../config/functions');
const functions = func.func();
const questionModel = require('../../models/questions');
let response = {};
/** List Questions
 * @requires userId
 * @returns  Array of Questions
 */
router.post("/listquestions",functions.verifyTokenAdmin,(req,res)=>{
    var post = req.body;
    var required_params = ['userId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        questionModel.showQuestionList((err,questions)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                response = { status : true, message : "Success.", data : questions}
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


/** Create New Question
 * @requires userId,question,a,b,c,d,answer
 * @returns  questionObject
 */
router.post("/createquestion",functions.verifyTokenAdmin,(req,res)=>{
    var post = req.body;
    var required_params = ['userId','question','a','b','c','d','answer'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        let createQuestionObject = {             
            question : post.question,
            a : post.a,
            b : post.b,
            c : post.c,
            d : post.d,
            answer : post.answer,
        }
        let instanceQuestionSchema =new  questionModel(createQuestionObject);
        instanceQuestionSchema.save((err,newQuestions)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                response = { status : true, message : "Question created successfully.", data : newQuestions}
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


/** Update Question 
 * @requires (optional) question,a,b,c,d,answer
 * @returns questionObject
 */
router.post("/updatequestion",functions.verifyTokenAdmin,(req,res)=>{  
    let post = req.body;  
    let updateObject = { status : 1 }
    if(typeof(post.question) !== "undefined" && post.question !== ""){
        updateObject['question'] = post.question;
    }
    if(typeof(post.a) !== "undefined" && post.a !== ""){
        updateObject['a'] = post.a;
    }
    if(typeof(post.b) !== "undefined" && post.b !== ""){
        updateObject['b'] = post.b;
    }
    if(typeof(post.c) !== "undefined" && post.c !== ""){
        updateObject['c'] = post.c;
    }
    if(typeof(post.d) !== "undefined" && post.d !== ""){
        updateObject['d'] = post.d;
    }   
    if(typeof(post.answer) !== "undefined" && post.answer !== ""){
        updateObject['answer'] = post.answer;
    }  
    if(typeof(post.status) !== "undefined" && post.status !== ""){
        updateObject['status'] = (post.status)?post.status:1;
    } 
    var required_params = ['userId','questionId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    // console.log('update Object',updateObject)
    if(valid){
        questionModel.updateQuestion(post.questionId,updateObject,(err,questionObj)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                let message = "Question Updated Successfully."
                if(typeof(post.status) !== "undefined" && post.status !== "" && (post.status == "2" || post.status == 2)){
                    message = "Question Deleted."
                }
                response = { status : true, message : message, data: questionObj}
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