import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("192.168.1.16:8080/api/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((response) => {
        console.error(response);
      });
  }

  function handleUsername(event) {
    setUsername(event.target.value)
  }

  function handlePassword(event) {
    setPassword(event.target.value)
  }

  /*
  TODO: Handnle focus part of this thing
  */

  return (
    <div className="text-center flex items-center justify-center min-h-screen">
        <div className="p-4 border-2 border-black rounded-lg">
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" onChange={handlePassword} className="border-2 border-black rounded-lg m-1 p-2"/>
            </div>
            <div>
                <input type="text" onChange={handleUsername} className="border-2 border-black rounded-lg m-1 p-2"/>
            </div>
            <div>
                <button className="border-2 bg-yellow-300 border-blue-950 rounded-lg p-2 m-1 hover:">Login</button>
                <button className="border-2 bg-yellow-50 border-blue-950 rounded-lg p-2 m-1">New Account</button>
            </div>
        </form>
        </div>
    </div>
  );
}
