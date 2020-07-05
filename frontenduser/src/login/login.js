import  React  from "react";
import { toast } from "react-toastify";
import { instance } from '../helpers/apirequest';
class Login extends React.Component{
    constructor(props){
        super(props);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.props = props;
        this.state = {
            username : "",
            password : "",
        }
    }

    componentDidMount(){
    }

    handleUsernameChange(e){
        this.setState({
            username : e.target.value
        })
    }

    handlePasswordChange(e){
        this.setState({
            password : e.target.value
        })
    }

    async onLogin(e){
        e.preventDefault()
        if(this.state.username && this.state.username.length > 0 && this.state.password && this.state.password.length > 0){
            let user = {
                username : this.state.username,
                password : this.state.password           
            }
            let response = await instance.post('user/login',user);
            // console.log("Response",response)
            if(response.status){
                localStorage.setItem('token',response.data.token)
                localStorage.setItem('user',JSON.stringify(response.data))
                window.location.reload()
            }
        }else{
            if(!(this.state.username && this.state.username.length > 0)){
                toast.error("Please enter username.")
            }else if(!(this.state.password && this.state.password.length > 0)){
                toast.error("Please enter password.")
            }
        }
        
    }

    render(){
        return(
            <div>
                <div class="loginbox" style={{"textAlign":"center"}}>
                <h3>Login</h3>
                <form name="loginform" onSubmit={(e)=>this.onLogin(e)}>
                    <div style={{"marginBottom":"10px"}}>
                        <label>
                            Username : 
                        </label>
                        {" "}<input name="username" type="text" maxLength="15" onChange={this.handleUsernameChange}/>
                    </div>
                    <div style={{"marginBottom":"10px"}}>
                        <label>
                            Password : 
                        </label>
                        {" "}<input name="username" type="password" maxLength="15" onChange={this.handlePasswordChange}/>
                    </div>
                    <div>
                        <button name="submit" type="submit">
                            Login
                        </button>
                    </div>
                </form>
                </div>
            </div>
        )
    }
}

export default Login;