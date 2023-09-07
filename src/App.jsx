import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import Form from "./components/Form";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import Create from "./components/Create";
import Response from "./components/Response";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Create />} /> {/* Default route */}
          <Route path="create" element={<Create />} />
          <Route path="response" element={<Response />} />
        </Route>
        <Route path="/forms/:id" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
