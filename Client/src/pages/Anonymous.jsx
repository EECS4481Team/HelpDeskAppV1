import React,{useState,useEffect} from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/logo.png";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { anonymousRoute } from "../utils/APIRoutes";

function Anonymous(){
    const navigate = useNavigate();
    const [values,setValues]=useState({
        username: "",
        usercode: "",
    });

    const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover:true,
    draggable: true,
    theme: "dark",
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
        if(handleValidation()){
                console.log("in validation",anonymousRoute);
            const {usercode,username} = values;
            const {data} = await axios.post(anonymousRoute,{
                username,
                usercode,
            });
            if(data.status === false){
                toast.error(data.msg, toastOptions);
            }
            if(data.status === true){
                const article = {  name: username}
                axios.post('localhost/adminLogin', article)
                // localStorage.setItem(`eecs4481-project`, JSON.stringify(data.user));
                navigate("/");
            }
            
        }
    };

    const handleValidation =() => {
        const {usercode,username} = values;
        if(usercode === ""){
            console.log("inm validation",toast);
            toast.error("Username and usercode is required",toastOptions);
            return false;
        }else if (username.length === ""){
            toast.error("Username and usercode is required",toastOptions);
            return false;
        }
        return true;
    }

    const handleChange = (event) =>{
        setValues({...values,[event.target.name]:event.target.value});
    };
    return (
    <>
        <FormContainer>
            <form onSubmit={(event)=>handleSubmit(event)}>
                <div className="brand">
                    <img src={Logo} alt="Logo" />
                    <h1>Sneaky Chat</h1>
                </div>
                <input type="text" placeholder="Username" name="username" onChange={(e)=> handleChange(e)}/>
                <input type="text" placeholder="User code" name="usercode" onChange={(e)=> handleChange(e)}/>
                <button type="submit">Log In</button>
                <span>  
                    Don't have an account ? <Link to="/register">Register</Link>
                    </span>
                <span>
                    Are you Admin ? <Link to="/login">Login</Link>
                </span>
            </form>
        </FormContainer>
        <ToastContainer />
    </>
    );
}

const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap : 1rem;
align-items: center;
background-color: #b4c2d9;
.brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img{
        height: 9rem;
    }
    h1{
        color: white;
        font-size: 2.5em;
    }
}
form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #6f86ab;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input{
        background-color: white;
        padding: 1rem;
        border: 0.1rem solid #707b8c;
        border-radius: 0.4rem;
        color: black;
        width: 100%;
        font-size: 1rem;
        &:focus{
            border: 0.1rem solid #707b8c;
            outline: none;
        }
    }
    button{
        background-color: #4163bf;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
        &:hover{
            background-color: #4e0eff;
        }
    }
    span {
        color: white;
        text-transform: uppercase;
        text-align: center;
        a {
            color: #adc1f7;
            text-transform: none;
            font-weight: bold;
            
        }
    }
}
`;

export default Anonymous;