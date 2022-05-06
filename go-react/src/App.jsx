import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PlayGo from "./pages/PlayGo.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<PlayGo />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
