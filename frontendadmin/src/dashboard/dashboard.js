import  React  from "react";
import  Header from "../header/header"
import { instance } from '../helpers/apirequest';
import { authFunction } from "../helpers/auth"
import "./dashboard.css"
import { toast } from "react-toastify";
class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.openAddModal = this.openAddModal.bind(this);
        this.closeAddQueModal = this.closeAddQueModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.handleRadiobutton = this.handleRadiobutton.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.getQuestionList = this.getQuestionList.bind(this);
        this.props = props;
        this.state = {
            questions : [],
            questionId : "",
            question : "",
            a : "",
            b : "",
            c : "",
            d : "",
            answer : "",
        }
    }

    componentDidMount(){
        this.getQuestionList()    
    }

    async getQuestionList(){
        let userId = authFunction.getUserId();
        let user = { userId }
        let response = await instance.post('admin/question/listquestions',user,true);
        if(response.status){
            this.setState({
                questions : response.data
            })
        }
    }
    /** Add new Question Modal Start */

    openAddModal(){
        this.setState({
            answer : 'a'
        })
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    }

    closeAddQueModal(){
        this.setState({
            questionId : "",
            question : "",
            a : "",
            b : "",
            c : "",
            d : "",
            answer : 'a'
        })
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    handleQuestionChange(e){
        this.setState({
            question : e.target.value
        })
    }

    handleRadiobutton(e){
        this.setState({
            answer : e.target.value
        })
    }

    handleOptionChanges(e){
        // console.log("Value",e.target.name,e.target.value)
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    validateQuestion(){
        let stateObj = this.state;
        if(stateObj.question.trim() === ""){
            return "question."
        }else if(stateObj.a.trim() === ""){
            return "option A"
        }
        else if(stateObj.b.trim() === ""){
            return "option B"
        }
        else if(stateObj.c.trim() === ""){
            return "option C"
        }
        else if(stateObj.d.trim() === ""){
            return "option D"
        }
        return false
    }

    async addQuestion(){
        let validate = this.validateQuestion();
        if(!(validate)){
            let newQuestion = {}
            newQuestion['userId'] = authFunction.getUserId();
            newQuestion['question'] = this.state.question;
            newQuestion['a'] = this.state.a;
            newQuestion['b'] = this.state.b;
            newQuestion['c'] = this.state.c;
            newQuestion['d'] = this.state.d;
            newQuestion['answer'] = this.state.answer;
            if(this.state.questionId !== ""){
                newQuestion['questionId'] = this.state.questionId;
                let response = await instance.post("admin/question/updatequestion",newQuestion,true)
                if(response.status){
                    toast.success(response.message);
                    this.getQuestionList()
                    this.closeAddQueModal()
                }
            }else{
                let response = await instance.post("admin/question/createquestion",newQuestion,true)
                if(response.status){
                    toast.success(response.message);
                    this.getQuestionList()
                    this.closeAddQueModal()
                }
            }
        }else{
            toast.error(`Please write ${validate}`)
        }
    }

    /** Add new Question Modal End */    

    /** Edit Modal Start */

    openEditModal(question){

        // console.log("Que",question)
        this.setState({
            questionId : (question._id)?question._id:"",
            question : (question.question)?question.question:"",
            a : (question.a)?question.a:"",
            b : (question.b)?question.b:"",
            c : (question.c)?question.c:"",
            d : (question.d)?question.d:"",
            answer : (question.answer)?question.answer:""
        })
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    }

    /** Edit Modal End */

    /** Delete Start */

    openDeleteModal(que){
        this.setState({ 
            questionId : que._id
        })
        var modal = document.getElementById("deleteModal");
        modal.style.display = "block";
    }

    closeDeleteModal(){
        this.setState({ 
            questionId : ""
        })
        var modal = document.getElementById("deleteModal");
        modal.style.display = "none";
    }

    async deleteConfirm(){
        let deletObj = {}
        deletObj['userId'] = authFunction.getUserId();
        deletObj['questionId'] = this.state.questionId;
        deletObj['status'] = '2';        
        let response = await instance.post("admin/question/updatequestion",deletObj,true)
            if(response.status){
                toast.success(response.message);
                this.getQuestionList()
                this.closeDeleteModal()
            }        
    }

    /** Delete End */
    render(){
        return(
            <div>
                <Header/>
                <div>
                <div  style={{"textAlign":"center"}}>
                    <h3>MCQ question List</h3>
                    <button onClick={(e)=>{this.openAddModal()}}>Add Question</button>
                </div>
                <table>
                    <tr>
                        <th style={{"width":"5%","borderBottom":"1px solid"}}>Sr No</th>
                        <th style={{"width":"40%","borderBottom":"1px solid"}}>Question</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>A</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>B</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>C</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>D</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>Answer</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>Actions</th>
                    </tr>
                    {(this.state.questions.length >0)?this.state.questions.map((que,ind)=>
                        <tr>
                            <td style={{"textAlign":"center"}}>{ind+1}</td>
                            <td style={{"textAlign":"center"}}>{que.question}</td>
                            <td style={{"textAlign":"center"}}>{que.a}</td>
                            <td style={{"textAlign":"center"}}>{que.b}</td>
                            <td style={{"textAlign":"center"}}>{que.c}</td>
                            <td style={{"textAlign":"center"}}>{que.d}</td>
                            <td style={{"textAlign":"center"}}>{que.answer.toUpperCase()}</td>
                            <td style={{"textAlign":"center"}}><button onClick={()=>{this.openEditModal(que)}}>Edit</button>{" "}<button onClick={()=>{this.openDeleteModal(que)}}>Delete</button></td>
                        </tr>
                        )
                    :
                    <tr>
                        <td colSpan="4">No Data</td>
                    </tr>
                    }
                </table>                              
                </div>
                <div id="myModal" class="modal">  
                <div class="modal-content">
                    <span class="close" onClick={()=>{this.closeAddQueModal()}}>&times;</span>
                    <p>{(this.state.questionId !== "")?"Edit Question":"Add New Question"}</p>
                    <table>
                        <tr>
                            <td>
                                Question : <input style={{"width":"500px"}}  name="question" type="text" value={this.state.question} placeholder="Write Question" onChange={(e)=>{this.handleQuestionChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td style={{"textAlign":"left"}}>
                                <label>Option A : </label>
                                <input name="a" type="text" value={this.state.a} onChange={(e)=>{this.handleOptionChanges(e)}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="a" checked={this.state.answer == "a"} onChange={(e)=>{this.handleRadiobutton(e)}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <label>Option B : </label>
                                <input name="b" type="text" value={this.state.b} onChange={(e)=>{this.handleOptionChanges(e)}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="b" checked={this.state.answer == "b"} onChange={(e)=>{this.handleRadiobutton(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td style={{"textAlign":"left"}}>
                                <label>Option C : </label>
                                <input name="c" type="text" value={this.state.c} onChange={(e)=>{this.handleOptionChanges(e)}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="c" checked={this.state.answer == "c"} onChange={(e)=>{this.handleRadiobutton(e)}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <label>Option D : </label>
                                <input name="d" type="text" value={this.state.d} onChange={(e)=>{this.handleOptionChanges(e)}}/>
                            </td>
                            <td style={{"textAlign":"left"}}>
                                <input name="is_answer" type="radio" value="d" checked={this.state.answer == "d"} onChange={(e)=>{this.handleRadiobutton(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{"textAlign":"center"}}>                                                                
                                <button onClick={(e)=>{this.addQuestion()}} >{(this.state.questionId !== "")?"Update Question":"Add Question"}</button>
                            </td>
                        </tr>
                    </table>
                </div>
                </div>
                {/* Delete Modal */}

                <div id="deleteModal" class="modal">  
                    <div class="modal-content">
                        <span class="close" onClick={()=>{this.closeDeleteModal()}}>&times;</span>
                        <p>Delete This Question</p>                    
                        <table style={{"textAlign":"center"}}>
                            <tr colSpan="2">
                                <td >
                                    Are You Sure?
                                </td>
                            </tr>
                            <tr>
                                <td>
                                <button onClick={()=>{this.deleteConfirm()}}>Yes</button>
                                </td>
                                <td>
                                    <button onClick={()=>{this.closeDeleteModal()}}>No</button>
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