import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("http://localhost:8080/login", {
        email: username,
        password: password,
      },
      { withCredentials: true })
      .then((response) => {
        console.log(response);
        navigate("/");
      })
      .catch((response) => {
        console.error(response);
        alert("Invalid credentials");
      });
  }

  function handleEmail(event) {
    setUsername(event.target.value)
  }

  function handlePassword(event) {
    setPassword(event.target.value)
  }

  function handleNewAccount(event) {
    event.preventDefault();
    navigate("/new-account");
  }

  /*
  TODO: Handnle focus part of this thing
  */

  return (
    <div className="text-center flex items-center justify-center min-h-screen">
        <div className="p-4 border-2 border-black rounded-lg">
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        type="text"
                        placeholder="Email"
                        onChange={handleEmail}
                        className="border-2 border-black rounded-lg m-1 p-2"/>
                </div>
                <div>
                    <input 
                        type="text"
                        placeholder="Password" 
                        onChange={handlePassword} 
                        className="border-2 border-black rounded-lg m-1 p-2"/>
                </div>
                <div>
                    <button 
                        type="submit" 
                        className="border-2 bg-yellow-300 border-blue-950 rounded-lg p-2 m-1 shadow-xl hover:"
                    >Login</button>
                    <button 
                        type="button"
                        onClick={handleNewAccount}
                        className="border-2 bg-yellow-50 border-blue-950 rounded-lg p-2 m-1 shadow-xl hover:"
                        >New Account</button>
                </div>
            </form>
        </div>
    </div>
  );
}
