const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const async = require('async')
const func = require('../../config/functions');
const functions = func.func();
const questionModel = require('../../models/questions');
const quizModel = require('../../models/quiz');
let response = {};
/** List Questions
 * @requires userId
 * @returns  Array of Questions
 */
router.post("/listquestions",functions.verifyTokenUser,(req,res)=>{
    var post = req.body;
    var required_params = ['userId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        questionModel.showStudentQuestionList((err,questions)=>{
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

router.post("/submitquiz",functions.verifyTokenUser,(req,res)=>{
    var post = req.body;
    var required_params = ['userId','attempted_question','total_question','timer'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        if(post.questions  && post.questions.length > 0){
            questionModel.showQuestionList((err,questions)=>{
                if(err){
                    response = { status : false, message : "Oops! Something went wrong."}
                    res.send(response);
                }else{
                    var all_questions = questions;
                    var quiz_questions = []
                    var total_correct = 0;
                    async.each(post.questions,(question,cbQue)=>{
                        let get_original_que = all_questions.filter((que) =>{return que._id == question._id})
                        if(get_original_que.length > 0){
                            let temp_question = {}
                            temp_question['question_id'] = mongoose.Types.ObjectId(get_original_que[0]._id);
                            temp_question['question'] = get_original_que[0].question;
                            temp_question['answer'] = get_original_que[0].answer;
                            temp_question['given_answer'] = question.answer;
                            if(get_original_que[0].answer === question.answer){
                                temp_question['correct'] = true;
                                total_correct += 1;
                            }else{
                                temp_question['correct'] = false;
                            }
                            cbQue()
                            quiz_questions.push(temp_question);
                        }else{
                            cbQue()
                        }
                    },(err)=>{
                        if(err){
                            response = { status : false, message : "Oops! Something went wrong."}
                            res.send(response);
                        }else{
                            let quizObject = {}
                            quizObject['user_id'] = mongoose.Types.ObjectId(post.userId);
                            quizObject['questions'] = quiz_questions;
                            quizObject['attempted_question'] = post.attempted_question;
                            quizObject['correct_answer'] = total_correct;
                            quizObject['total_question'] = post.total_question;
                            quizObject['timer'] = post.timer;
                            let instanceQuizSchema = new  quizModel(quizObject);
                            instanceQuizSchema.save((err,newQuiz)=>{
                                if(err){
                                    response = { status : false, message : "Oops! Something went wrong."}
                                    res.send(response);
                                }else{
                                    response = { status : true, message : "Question Submitted successfully.", data : newQuiz}
                                    res.send(response);
                                }
                            })
                        }
                    })
                    // response = { status : true, message : "Success.", data : questions}
                    // res.send(response);
                }
            })
        }else{
            let quizObject = {}
            quizObject['user_id'] = mongoose.Types.ObjectId(post.userId);
            quizObject['questions'] = [];
            quizObject['attempted_question'] = post.attempted_question;
            quizObject['correct_answer'] = 0;
            quizObject['total_question'] = post.total_question;
            let instanceQuizSchema = new  questionModel(quizObject);
            instanceQuizSchema.save((err,newQuiz)=>{
                if(err){
                    response = { status : false, message : "Oops! Something went wrong."}
                    res.send(response);
                }else{
                    response = { status : true, message : "Question created Submitted.", data : newQuiz}
                    res.send(response);
                }
            })            
        }        
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