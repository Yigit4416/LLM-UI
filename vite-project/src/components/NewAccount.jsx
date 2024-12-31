import { useState } from "react";
import axios from "axios";

export default function NewAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("192.168.1.16:8080/api/new-account", {
        username: username,
        password: password,
        email: email,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((response) => {
        console.error(response);
      });
  }

  function handleUsername(event) {
    setUsername(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  return (
    <div className="text-center flex items-center justify-center min-h-screen">
      <div className="p-4 border-2 border-black rounded-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <input type="text" onChange={handleUsername} className="border-2 border-black rounded-lg m-1 p-2" placeholder="Username"/>
          </div>
          <div>
            <input type="password" onChange={handlePassword} className="border-2 border-black rounded-lg m-1 p-2" placeholder="Password"/>
          </div>
          <div>
            <input type="email" onChange={handleEmail} className="border-2 border-black rounded-lg m-1 p-2" placeholder="Email"/>
          </div>
          <div>
            <button className="border-2 bg-yellow-300 border-blue-950 rounded-lg p-2 m-1">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
