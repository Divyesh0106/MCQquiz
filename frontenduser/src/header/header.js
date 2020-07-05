import React from "react";
import { authFunction } from "../helpers/auth";

class Header extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
        this.state = {

        }
    }
    render(){
        return(
            <div  style={{"textAlign":"center"}}>
                <div>
                    <h2>MCQ Quiz</h2>                
                </div>
                <div> 
                    <button onClick={(e)=>{authFunction.logout()}}>Logout</button>
                </div>
            </div>
        )
    }
}
export default Header;