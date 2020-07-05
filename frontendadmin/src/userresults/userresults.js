import  React  from "react";
import  Header from "../header/header"
import { instance } from '../helpers/apirequest';
import { authFunction } from "../helpers/auth"
import "../dashboard/dashboard.css"
import { toast } from "react-toastify";
class Userresult extends React.Component{
    constructor(props){
        super(props);        
        this.getQuestionList = this.getQuestionList.bind(this);
        this.props = props;
        this.state = {
            quizes : []            
        }
    }

    componentDidMount(){
        this.getQuestionList()    
    }

    async getQuestionList(){
        let userId = authFunction.getUserId();
        let user = { userId }
        let response = await instance.post('admin/user/userresults',user,true);
        if(response.status){
            this.setState({
                quizes : response.data
            })
        }
    }

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
                    <h3>MCQ quiz results</h3>                    
                </div>
                <table>
                    <tr>
                        <th style={{"width":"5%","borderBottom":"1px solid"}}>Sr No</th>
                        <th style={{"width":"40%","borderBottom":"1px solid"}}>Username</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>Total Question</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>Attempted Question</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>Time</th>
                        <th style={{"width":"10%","borderBottom":"1px solid"}}>Right Answer</th>                        
                        {/* <th style={{"width":"10%","borderBottom":"1px solid"}}>Actions</th> */}
                    </tr>
                    {(this.state.quizes.length >0)?this.state.quizes.map((que,ind)=>
                        <tr>
                            <td style={{"textAlign":"center"}}>{ind+1}</td>
                            <td style={{"textAlign":"center"}}>{que.username}</td>
                            <td style={{"textAlign":"center"}}>{que.total_question}</td>
                            <td style={{"textAlign":"center"}}>{que.attempted_question}</td>
                            <td style={{"textAlign":"center"}}>{que.timer}</td>
                            <td style={{"textAlign":"center"}}>{que.correct_answer}</td>                            
                            {/* <td style={{"textAlign":"center"}}><button onClick={()=>{this.openDeleteModal(que)}}>Delete</button></td> */}
                        </tr>
                        )
                    :
                    <tr>
                        <td colSpan="4">No Data</td>
                    </tr>
                    }
                </table>                              
                </div>
                
                {/* Delete Modal */}

                <div id="deleteModal" class="modal">  
                    <div class="modal-content">
                        <span class="close" onClick={()=>{this.closeDeleteModal()}}>&times;</span>
                        <p>Delete This Quiz Result</p>                    
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

export default Userresult;