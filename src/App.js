import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Wave from "./components/Wave";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wave/:accId" element={<Wave />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
