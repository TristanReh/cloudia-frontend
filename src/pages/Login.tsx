import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sha256 from 'crypto-js/sha256'

enum LoginState {
  EMAIL,
  LOGIN,
  REGISTER
}

export default function Login()  {
    const navigate = useNavigate();

    const [loginState, setLoginState] = useState<LoginState>(LoginState.EMAIL);

    const [emailInput, setEmailInput] = useState<string>("");
    const [emailInputValid, setEmailInputValid] = useState<boolean>(false);

    const [loginPasswordInput, setLoginPasswordInput] = useState<string>("");    
    const [registerPasswordInput, setRegisterPasswordInput] = useState<string>("");
    const [repeatPasswordInput, setRepeatPasswordInput] = useState<string>("");

    const [lastErrorMessage, setLastErrorMessage] = useState<string>("");

    useEffect(()=>{
      if (repeatPasswordInput !== registerPasswordInput)
        setLastErrorMessage("The passwords do not match")
      else
        setLastErrorMessage("")
    }, [repeatPasswordInput])

    function handleEmailInput(e : React.ChangeEvent<HTMLInputElement>) {
      setEmailInput(e.target.value);
      setEmailInputValid(e.target.value.includes("@"));
      setLoginState(LoginState.EMAIL);
        
      // Reset passwords
      setLoginPasswordInput("");
      setRegisterPasswordInput("");
      setRepeatPasswordInput("");
    }

    function handleLogin() {
      axios.get("http://192.168.2.177:8000/login", {
        withCredentials: true,
        headers: {
          "email": emailInput,
          "password": sha256(loginPasswordInput).toString()
        }
      }).then(res => {
          let status = res.status;
          if (status == 200) navigate("/")
        })
        .catch(err => {
          let status = err.response.status;
          if (status == 401 && loginState === LoginState.EMAIL) setLoginState(LoginState.LOGIN)
          else if (status == 401 && loginState === LoginState.LOGIN) {
            setLoginPasswordInput("")
            setLastErrorMessage("Wrong password")
          }
          else if (status == 404 && loginState === LoginState.EMAIL) {
            setLoginState(LoginState.REGISTER) 
          }
        })
    }

    function handleRegister() {
      axios.post("http://192.168.2.177:8000/register", {}, {
        withCredentials: true,
        headers: {
          "email": emailInput,
          "password": sha256(registerPasswordInput).toString()
        }
      }).then(_ => { setLoginState(LoginState.LOGIN); })
      .catch(err => {
        let status = err.response.status;
        if (status == 400) setLastErrorMessage(err.response.message)
      })
    }

    return (
      <div className="flex flex-row min-w-screen min-h-screen justify-center items-center bg-violet-100 ">
        <div className="gap-6 p-[150px] drop-shadow-2xl flex flex-col items-center rounded-[60px] bg-white w-[700px] h-[1000px]">
            <h1 className="font-bold text-3xl mt-7 mb-8">Continue with your Email</h1>
            <input 
              type="email"
              value={emailInput}
              onChange={(e) => handleEmailInput(e) }
              placeholder="Email" 
              className={`focus:outline-violet-300 p-4 border-2 rounded-xl w-full ${!emailInput.length ? "border-slack-800": !emailInputValid ? "border-red-200" : "border-green-200"}`}/>
            {
              loginState == LoginState.LOGIN ? 
                  <input 
                    type="password"
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    placeholder="Password" 
                    className="focus:outline-violet-300 p-4 border-2 rounded-xl w-full"/>
              : loginState == LoginState.REGISTER ?
                <>
                  <input 
                    type="password"
                    value={registerPasswordInput}
                    onChange={(e) => setRegisterPasswordInput(e.target.value)}
                    placeholder="Password" 
                    className={`focus:outline-violet-300 p-4 border-2 rounded-xl w-full ${!registerPasswordInput.length ? "border-slack-800": registerPasswordInput.length < 5 ? "border-orange-200" : "border-green-200"}`}/>
                  <input 
                    type="password" 
                    value={repeatPasswordInput}
                    onChange={(e) => setRepeatPasswordInput(e.target.value)}
                    placeholder="Repeat Password" 
                    className={`focus:outline-violet-300 p-4 border-2 rounded-xl w-full ${!repeatPasswordInput.length ? "border-slack-800": repeatPasswordInput != registerPasswordInput? "border-red-200" : "border-green-200"}`}/>
                </>
              : null
            }

            {
              loginState == LoginState.EMAIL ? 
                <button className="mt-3 w-full bg-violet-300 p-4 rounded-xl font-medium text-slate-700" onClick={() => handleLogin()}>
                Continue
                </button>
              : loginState == LoginState.LOGIN ?
                <button className="mt-3 w-full bg-violet-300 p-4 rounded-xl font-medium text-slate-700" onClick={() => handleLogin()}>
                  Login
                </button>
              : loginState == LoginState.REGISTER ?
                <button disabled={registerPasswordInput != repeatPasswordInput || registerPasswordInput.length < 6} className="mt-3 w-full bg-violet-300 p-4 rounded-xl font-medium text-slate-700 disabled:bg-slate-200" onClick={() => handleRegister()}>
                Register 
                </button>
              : null
            }

            { lastErrorMessage ? <p className="text-red-300">Error: {lastErrorMessage}</p> : null }
        </div>
      </div>
    )
}