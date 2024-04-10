import React from 'react';
import './App.css';
import HomePage from "./pages/homePage/HomePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AnalysisPage from "./pages/analysisPage/AnalysisPage";
import SmellPage from "./pages/smellPage/SmellPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/analysis/:id" element={<AnalysisPage/>}/> // Pagina dettaglio per una singola analisi
              <Route path="/analysis/:id/smell/:id" element={<SmellPage/>}/> // Pagina dettaglio per un singolo smell
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
