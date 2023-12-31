import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Form from "./Form";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import Create from "./Create";
import Response from "./Response";
import Myforms from "./Myforms";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Create />} />
          <Route path="create" element={<Create />} />
          <Route path="myforms" element={<Myforms />} />
          <Route path="response" element={<Response />} />
        </Route>
        <Route path="/forms/:id" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
