import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSignUp() {
    if (username.length < 5 || password.length < 8) {
      setMessage(
        "Username must be at least 5 characters long, and password must be at least 8 characters long."
      );
      return;
    }

    setMessage("Please Wait...");

    try {
      const response = await fetch(
        "http://localhost:3000/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: username,
            password: password,
          }),
        }
      );

      if (response.status === 201) {
        console.log("success");
        setMessage("Success! Please login now.");
      }

      const responseText = await response.text();
      console.log(responseText);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="ml-8 md:flex">
      <div className="w-1/2">
        <h1 className="text-blue-600 font-extrabold text-6xl my-10">
          Form Flow
        </h1>
        <div className="font-xl font-medium animate-pulse">{message}</div>

        <p className="font-bold text-xl my-4 ">
          Welcome to form flow, For all of your form needs!
        </p>
        <h2 className="font-bold text-xl  text-blue-600 my-4">
          Create Your Account
        </h2>
        <label htmlFor="user">Enter your name</label>
        <br />
        <input
          id="user"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-blue-500"
        />
        <br />
        <div className="password">
          <label htmlFor="password">Enter Password</label>
          <br />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-blue-500"
          />
          <br />
        </div>
        <button
          type="button"
          className="bg-yellow-400 px-2 py-1 border rounded-md my-4 hover:bg-blue-400"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        <p>Already have an account? Please Sign In.</p>
        <button
          className="bg-yellow-400 px-2 py-1 border rounded-md my-4 hover:bg-blue-400"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>
      <div className="w-1/2 h-full mt-5 ml-5">
        <img src="form.png"  alt="form" />
      </div>
    </div>
  );
}
