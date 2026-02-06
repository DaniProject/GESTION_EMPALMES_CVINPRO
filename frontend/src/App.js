import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Inicio from "./components/inicio";


const App = () =>{
  return (
    <Router basename="/GESTION_EMPALMES_CVINPRO">
      <Routes>
        <Route path="/login" component={Login}/>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/" element={<Login />} />
      </Routes> 
    </Router>
  );
}

export default App;