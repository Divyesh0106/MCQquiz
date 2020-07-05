import React from "react";
import { authFunction } from "../helpers/auth";
import { Link } from "react-router-dom";
import './header.css';

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
                    <h2>MCQ Quiz Admin</h2>                
                </div>                 
                <div class="table">
                    <ul id="horizontal-list">                        
                        <li><Link to="/">MCQ List</Link></li>
                        <li><Link to="/userresult">User Results</Link></li>
                        <li><button onClick={(e)=>{authFunction.logout()}}>Logout</button></li>
                    </ul>
                </div>                                
            </div>
        )
    }
}
export default Header;