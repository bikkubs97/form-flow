import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [state, setState] = useState({
    username: "",
    password: "",
    message: "",
  });
  const navigate = useNavigate();

  async function handleSignIn(event) {
    event.preventDefault();
    setMessage("Please Wait...");
    try {
      const response = await fetch(
        "https://formflow-server.onrender.com/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: state.username,
            password: state.password,
          }),
        }
      );

      if (response.status === 202) {
        console.log("success");
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setMessage("Login Successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Incorrect username or password!");
    }
  }

  function setMessage(message) {
    setState((prevState) => ({ ...prevState, message }));
  }

  return (
    <div className="ml-8 md:flex">
      <div className="w-1/2">
        <h1 className="text-blue-600 font-extrabold text-6xl my-10">
          Form Flow
        </h1>
        <div className="animate-pulse text-xl font-medium">{state.message}</div>

        <p className="font-bold text-xl my-4">
          Welcome to form flow, For all of your form needs!
        </p>
        <h2 className="font-bold text-xl text-blue-600 my-4">Sign In</h2>
        <label htmlFor="user">Enter your name</label>
        <br />
        <input
          id="user"
          required
          value={state.username}
          onChange={(e) => setState({ ...state, username: e.target.value })}
          className="border border-blue-500"
        />
        <br />
        <div className="password">
          <label htmlFor="password">Enter Password</label>
          <br />
          <input
            type="password"
            id="password"
            required
            value={state.password}
            onChange={(e) => setState({ ...state, password: e.target.value })}
            className="border border-blue-500"
          />
          <br />
        </div>
        <button
          className="bg-yellow-400 px-2 py-1 border rounded-md my-4 hover:bg-blue-400"
          type="submit"
          onClick={handleSignIn}
        >
          Sign In
        </button>
        <p>Don't have an account? Please Sign Up.</p>
        <button
          className="bg-yellow-400 px-2 py-1 border rounded-md my-4 hover:bg-blue-400"
          onClick={() => navigate("/")}
        >
          Sign Up
        </button>
      </div>
      <div className="w-1/2 h-full mt-5 ml-5">
        <img src="form.png" alt="form" />
      </div>
    </div>
  );
}
