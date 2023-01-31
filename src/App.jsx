import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header } from "./components";
import Home from "./pages/Home";
import Coin from "./pages/Coin";
import { makeStyles } from "@material-ui/core";

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coins/:id" element={<Coin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

const useStyles = makeStyles({
  App: {
    minHeight: "100vh",
    backgroundColor: "#14161a",
    color: "#fff",
  },
});
