import { useState } from "react";

enum LoginState {
  EMAIL,
  LOGIN,
  REGISTER
}

export default function Login()  {
    const [loginState, setLoginState] = useState<LoginState>(LoginState.REGISTER);

    const [emailInput, setEmailInput] = useState<string>("");
    const [emailInputValid, setEmailInputValid] = useState<boolean>(false);

    const [loginPasswordInput, setLoginPasswordInput] = useState<string>("");    
    const [registerPasswordInput, setRegisterPasswordInput] = useState<string>("");
    const [repeatPasswordInput, setRepeatPasswordInput] = useState<string>("");

    function handleEmailInput(e : React.ChangeEvent<HTMLInputElement>) {
      setEmailInput(e.target.value);
      setEmailInputValid(e.target.value.includes("@"));
      setLoginState(LoginState.EMAIL);
        
      // Reset passwords
      setLoginPasswordInput("");
      setRegisterPasswordInput("");
      setRepeatPasswordInput("");
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
            <button className="mt-3 w-full bg-violet-300 p-4 rounded-xl font-medium text-slate-700" onClick={() => setLoginState(LoginState.LOGIN)}>
              {
                loginState == LoginState.LOGIN ? "Login" : loginState == LoginState.REGISTER ? "Register" : "Continue"
              }
            </button>
        </div>
      </div>
    )
}