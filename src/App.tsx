import React from "react";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import CodeEditor from "./CodeEditor";

export default function App() {
  return (
      <Router>
        <div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/users">Users</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/users" element={<Users/>}></Route>
            <Route path="/" element={<CodeEditor/>}></Route>
          </Routes>
        </div>
      </Router>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
