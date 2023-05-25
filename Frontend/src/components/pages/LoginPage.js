import React from 'react'
import { Link } from 'react-router-dom'
import {useState} from 'react'
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye'
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import '../../App.css'
import BackgroundImage from '../../assets/images/MovieWalpOpacity.png'
import { FaTimes } from 'react-icons/fa';
import { Dialog } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import axios from "axios";



export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const [type, setType]=useState('password');
  const [icon, setIcon]=useState(eyeOff);

  const handleToggle=()=>{    
    if(type==='password'){
      setIcon(eye);      
      setType('text');
    }
    else{
      setIcon(eyeOff);     
      setType('password');
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let data = JSON.stringify({
      "email": email,
      "password": password
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/api/user/login',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config).then((response) => {
      console.log(JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);
      console.log( response.data.token);
      history.push("/home");
    }).catch((error) => {
      console.log(error);
      setErrorMessage("Invalid email or password");
    });
};
  

    return (
    
            <div className="text-center ">
            <header style={ HeaderStyle }>
            <div className="center-screen ">
            <form className='my-form' onSubmit={handleSubmit} >
            <Link to="/"> 
            <button className="circle-button" >    
            <FaTimes />
            </button>
            </Link>
            <h1>Sign In</h1>
            <div className='padding-login'>
            <p>
               <label htmlFor="email">Email</label>
            <br/>
            <div className='input-field'>
              <input type="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
              <div className='form-error'>
              </div>
            </p>
            <p>
            <label htmlFor="password">Password:</label>
            <br/>
            <div className='input-field'>
            <input type={type} value={password} onChange={(e) => setPassword(e.target.value)} />
            <span onClick={handleToggle}><Icon icon={icon} size={20}/></span>
            </div>
            <div className='form-error'>
            </div>
             </p>
            <p>
              <button id="sub_btn" type="submit">Login</button>
           </p>
         </div>
         <p > Don't have an account ? 
          <p><Link to="/register"  className="custom-link" >Register</Link></p>     
          </p>
        </form>

        <Dialog open={!!errorMessage} onClose={() => setErrorMessage(null)}>
        <div style={{ padding: "2rem" ,textAlign : "center", }}>
        <h4 className='textColor-error '>{errorMessage}</h4>
        <p> </p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem"}}>
        <Button className='dialog_btn'  onClick={() => setErrorMessage(null)}>
          Cancel
        </Button>
        </div>
        </div>
        </Dialog>
        </div>
         </header>
          </div>
        )
    }
    
    const HeaderStyle = {
        width: "100%",
        height: "100vh",
        background: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    }