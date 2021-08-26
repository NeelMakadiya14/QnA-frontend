import React from "react";
import { Router } from "@reach/router";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import AddProfile from "./Pages/AddProfile/AddProfile";
import Ask from "./Pages/Ask";
import Question from "./Pages/Question";
import { Cookies } from "react-cookie";

export default function Routes(props) {
  const cookies = new Cookies();
  const userCookie = cookies.get("userCookie");

  return (
    <>
      <Router>
        <Home path="/" />
        <Home path="/:tag" />
        <Profile path="/profile/:email" />
        <Home path="*" />
        <AddProfile path="/editprofile" />
        <Ask path="/ask" />
        <Question path="/question/:qid" />
      </Router>
    </>
  );
}
