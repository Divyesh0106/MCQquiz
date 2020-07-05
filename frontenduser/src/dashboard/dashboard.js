import React from "react";
import Header from "../header/header";
import "./dashboard.css";
import { authFunction } from "../helpers/auth"
import { instance } from "../helpers/apirequest";

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.timer = null;
        this.startExam = this.startExam.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.props = props;
        this.state = {
            exam_started : false,
            questions : [],
            total_questions : 0,
            current_question : 0,
            question_answered : [],
            timer : 0,
            correct_answer : 0
        }
    }

    convertSecondtoTime(seconds){        
        var hours = Math.floor(seconds / 60 / 60);
        var minutes = Math.floor(seconds / 60) - (hours * 60);
        var seconds = seconds % 60;
        var formatted = hours + ':' + minutes + ':' + seconds;
        return formatted;
    }

    componentDidMount(){
        // this.getQuestions();
    }

    async getQuestions(){
        let userId = authFunction.getUserId();
        let user = { userId }
        let response = await instance.post("question/listquestions",user,true)
        if(response.status){
            let temp_que_list = response.data.map((que)=>{return { '_id': que._id , 'answer': "" }})
            // console.log('temp_que_list',temp_que_list)
            this.setState({
                questions : response.data,
                total_questions : response.data.length,
                question_answered : temp_que_list
            })
        }
    }

    startExam(){
        this.getQuestions();
        let ths = this;
        this.timer = setInterval(function(){
            ths.setState({
                timer : ths.state.timer + 1
            })
        },1000)
        this.setState({
            exam_started : true
        })
    }


    next(){
        let temp_current_index = this.state.current_question;
        this.setState({
            current_question : temp_current_index + 1
        })
    }

    prev(){
        let temp_current_index = this.state.current_question;
        this.setState({
            current_question : temp_current_index - 1
        })
    }

    jump(index){
        this.setState({
            current_question : index
        })
    }

    handleRadiobutton(e,question){
        let temp_given_answers = this.state.question_answered;
        let check_already_added = temp_given_answers.filter((que)=>que._id === question._id);
        if(check_already_added.length > 0){
            let index = temp_given_answers.findIndex(x => x._id === check_already_added[0]._id);
            let temp_que_obj = temp_given_answers[index];
            temp_que_obj['answer'] = e.target.value;
            this.setState({
                question_answered : temp_given_answers
            })
        }else{
            // let temp_que_obj = {}
            // temp_que_obj['_id'] = question._id;
            // temp_que_obj['answer'] = e.target.value;
            // temp_given_answers.push(temp_que_obj);
            // this.setState({
            //     question_answered : temp_given_answers
            // })
        }
    }

    openModal(correct_answer,total_question){
        this.setState({ 
            correct_answer : correct_answer,
            total_question : total_question
        })
        var modal = document.getElementById("examModal");
        modal.style.display = "block";
    }
    

    closeModal(){
        this.setState({ 
            correct_answer : 0,
            total_question : 0            
        })
        var modal = document.getElementById("examModal");
        modal.style.display = "none";
        window.location.reload()
    }

    async submitQuiz(){
        clearInterval(this.timer)
        let temp_attempted_question = this.state.question_answered.filter((que)=> que.answer !== "")
        let attempted_question = temp_attempted_question.length;
        let total_question = this.state.total_questions;
        let userId = authFunction.getUserId()
        let questions = this.state.question_answered;
        let timer = this.convertSecondtoTime(this.state.timer);
        let quizObject = {
            userId,
            questions,
            attempted_question,
            total_question, 
            timer           
        }
        let response = await instance.post('question/submitquiz',quizObject,true);
        // console.log("RESPONSE",response)
        if(response.status){
            this.openModal(response.data.correct_answer,response.data.total_question)
            this.setState({
                exam_started : false,
                timer : 0,
                question_answered : [],
                current_question : 0
            })
        }
    }

    render(){
        return(
            <div>
                <Header/>
                <div style={{"textAlign":"center"}}>
                    <h3>Welcome to MCQ Quiz!</h3>                
                    {((!this.state.exam_started))?<button onClick={(e)=>{this.startExam()}}>Start Quiz</button>:null}
                    {(this.state.exam_started)?this.convertSecondtoTime(this.state.timer):null}
                </div>
                {(this.state.exam_started && this.state.questions.length > 0)?<div class="table">
                    <ul id="horizontal-list">
                        <button style={{"marginRight":"5px"}} onClick={(e)=>{this.prev()}} disabled={(this.state.current_question !== 0)?false:true}>{"Prev"}</button>
                        {this.state.questions.map((que,index)=><li><a className={(this.state.current_question == index)?"active":""} href="javascript:none" onClick={(e)=>{this.jump(index)}} >{index+1}</a></li>)}
                        <button style={{"marginLeft":"5px"}} onClick={(e)=>{this.next()}} disabled={(this.state.current_question !== this.state.total_questions-1)?false:true}>{"Next"}</button>
                    </ul>
                </div>:null}
                              
                {(this.state.exam_started && this.state.questions.length > 0)?<div style={{"textAlign":"center"}}>                    
                    <table className="center">
                        <tr  >
                            <td>
                            Question {this.state.current_question+1} :
                            </td>
                            <td colSpan="2" style={{"textAlign":"center"}}>
                                 {this.state.questions[this.state.current_question].question}
                            </td>                            
                        </tr>
                        <tr>
                            <td style={{"textAlign":"left"}}>
                                A : {this.state.questions[this.state.current_question].a}
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="a" checked={this.state.question_answered[this.state.current_question].answer == "a"} onChange={(e)=>{this.handleRadiobutton(e,this.state.questions[this.state.current_question])}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <label>B : </label>
                                {this.state.questions[this.state.current_question].b}
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="b" checked={this.state.question_answered[this.state.current_question].answer == "b"} onChange={(e)=>{this.handleRadiobutton(e,this.state.questions[this.state.current_question])}}/>
                            </td>
                        </tr>
                        <tr>
                            <td style={{"textAlign":"left"}}>
                                <label>C : </label>
                                {this.state.questions[this.state.current_question].c}
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="c" checked={this.state.question_answered[this.state.current_question].answer == "c"} onChange={(e)=>{this.handleRadiobutton(e,this.state.questions[this.state.current_question])}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <label>D : </label>
                                {this.state.questions[this.state.current_question].d}
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="d" checked={this.state.question_answered[this.state.current_question].answer == "d"} onChange={(e)=>{this.handleRadiobutton(e,this.state.questions[this.state.current_question])}}/>
                            </td>
                        </tr>
                        {(this.state.current_question === this.state.total_questions -1)?<tr>
                            <td>
                                <button onClick={()=>{this.submitQuiz()}}>Submit Quiz</button>
                            </td>
                        </tr>:null}
                    </table>
                </div>
                :
                (!this.state.exam_started)
                    ?null
                    :<div>
                        <p>Oops! Questions are not set yet.</p>
                    </div>
                }
                {/* Submit Exam Modal */}

                <div id="examModal" class="modal">  
                    <div class="modal-content">
                        <span class="close" onClick={()=>{this.closeModal()}}>&times;</span>                                            
                        <table style={{"textAlign":"center"}}>
                            <tr colSpan="2">
                                <td >
                                    You have given {this.state.correct_answer} correct answers out of {this.state.total_questions} questions.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <button onClick={()=>{this.closeModal()}}>Ok</button>
                                </td>                                
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;