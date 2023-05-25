import React from 'react'
import { Link } from 'react-router-dom'
import {useState} from 'react'
import { Icon } from 'react-icons-kit'
import {eye} from 'react-icons-kit/feather/eye'
import {eyeOff} from 'react-icons-kit/feather/eyeOff'
import Button from "@material-ui/core/Button";
import '../../App.css'
import BackgroundImage from '../../assets/images/MovieWalpOpacity.png'
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { Dialog } from '@material-ui/core';
import { useHistory } from "react-router-dom";

export default function SignUpPage() {

  const [formErrors, setFormErrors] = useState({});
  const [registerError, setregisterError] = useState(null);
  const [registerSuccess, setregisterSuccess] = useState(false);
  const [type, setType]=useState('password');
  const [icon, setIcon]=useState(eyeOff);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });

  

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

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last Name is required';
      isValid = false;
    } else if (formData.lastName.trim().length < 3) {
      errors.lastName = 'Last Name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    }
    else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };
  const history = useHistory();
  const handleLoginClick = () => {
    
    history.push("/login"); 
  };

  const handleSubmit = (e) => {
    console.log(formData.name)
    e.preventDefault();

    if (validateForm()) {
      console.log('Valid form');

     
let data = JSON.stringify({
  "firstName": formData.name,
  "lastName": formData.lastName,
  "email": formData.email,
  "password": formData.password
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:5000/api/user/register',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  setregisterSuccess(true);
  setregisterError(null);
  setFormData({ name: '', lastName: '', email: '', password: '' });
})
.catch((error) => {
  console.log(error);
  setregisterSuccess(false);
  setregisterError(error.response.data.message);
          
});
    } else {
      console.log('Invalid form');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));

   
  };

  const handleCloseDialog = () => {
    setregisterSuccess(false);
    setregisterError(null);
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
         <h1>Register</h1>
         <div className='padding-login'>

              <p>
                <div>

                <label htmlFor="name">Name</label>
                <br/>
                 <div className='input-field'>
           <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

                    </div>
                    <div className='form-error'>
                    {formErrors.name && <span>{formErrors.name}</span>}

                    </div>
                </div>
                
            </p>
            <p>
                <div>

                <label htmlFor="lastName">Last Name</label>
                <br/>
                <div className='input-field'>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                  
                 
                      
                    </div>
                    <div className='form-error'>
                    {formErrors.lastName && <span className=''>{formErrors.lastName}</span>}

                    </div>
                </div>
                
            </p>
            
            <p>
                
           
            <label htmlFor="email">Email Adress</label>
            <br/>
                      <div className='input-field'>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              <div className='form-error'>
                {formErrors.email && <span>{formErrors.email}</span>}
              </div>
               
            </p>
            <p>
            <label htmlFor="password">Password:</label>
            
            <br/>
            <div className='input-field'>
            <input type={type} id="password" name="password" value={formData.password} onChange={handleChange} />
                <span onClick={handleToggle}><Icon icon={icon} size={20}/></span>
            </div>
            <div className='form-error'>
                {formErrors.password && <span>{formErrors.password}</span>}
            </div>
          
        </p>
            
            <p>
               <button id="sub_btn" type="submit">Register</button>
           </p>
          
       
         </div>
         <p >
                  You already have an account ? 
               <p><Link to="/login"  className="custom-link" >Sing in</Link></p>     
               </p>
        </form>
        <Dialog open={registerError || registerSuccess} onClose={handleCloseDialog}>
    <div style={{ padding: "2rem" ,textAlign : "center", }}>
      {registerSuccess ? (
        <h4 className='textColor-valid '>Registration successful </h4>
      ) : (
        <h4 className='textColor-error '>{registerError}</h4>
      )}
      <p>

      </p>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem"}}>
        <Button className='dialog_btn'
         
          onClick={handleCloseDialog}
        >
          Cancel
        </Button>
        {registerSuccess && (
          <Button className='dialog_btn'
         
            onClick={handleLoginClick}
          >
            Login
          </Button>
        )}
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
