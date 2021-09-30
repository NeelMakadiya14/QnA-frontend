import axios from "axios";
import React, { useState, useEffect } from "react";
import queryString from "query-string";
import Answer from "../Components/Answer";
import Loader from "../Components/Loader";
import {
  Button,
  Grid,
  Link,
  Toolbar,
  Typography,
  Box,
  Paper,
  Divider,
  Chip,
} from "@material-ui/core";
import MyAppBar from "../Components/MyAppBar";
import Editor from "../Components/Editor";
import { Markup } from "interweave";
import { Cookies } from "react-cookie";

export default function Question(props) {
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const qid = props.qid;
  const [question, setQuestion] = useState();
  const [body, setBody] = useState("");

  const cookies = new Cookies();
  const userCookie = cookies.get("userCookie");
  let email = userCookie ? userCookie.email : "";

  const sendAnswer = async () => {
    axios
      .post(
        `${API_URL}/api/answers/addanswer?` +
          queryString.stringify({ email, questionId: qid }),
        { body }
      )
      .then((res) => {
        console.log(res);
        setQuestion({ ...question, Answers: [...question.Answers, res.data] });
      });
  };

  console.log(API_URL);
  console.log(
    `${API_URL}/api/questions/getquestion?` + queryString.stringify({ qid })
  );

  useEffect(() => {
    axios
      .get(
        `${API_URL}/api/questions/getquestion?` + queryString.stringify({ qid })
      )
      .then((res) => {
        console.log(res.data);
        setQuestion(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {question ? (
        <div>
          {console.log(question)}
          {console.log(question.tag)}
          <Toolbar>
            <MyAppBar />
          </Toolbar>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Paper style={{ width: "60%", padding: "2%", margin: "3%" }}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h4">{question.title}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    style={{ marginLeft: "3%", marginBottom: "2%" }}
                  >
                    {"Asked by "}
                    <Link
                      href={`/profile/${question.Author.email}`}
                      color="inherit"
                    >
                      {question.Author.Name}
                    </Link>
                  </Typography>
                </Grid>

                <Divider style={{ width: "100%" }} />
                <Grid item xs={12}>
                  <Markup content={question.body} />
                </Grid>
                <Grid xs={12} style={{ marginBottom: "2%" }}>
                  {question.tag.map((x, i) => (
                    <Chip style={{ marginLeft: "1%" }} key={i} label={x} />
                  ))}
                </Grid>
                <Divider style={{ width: "100%" }} />
                <Grid item xs={12}>
                  <Typography
                    style={{ marginTop: "2%", marginBottom: "2%" }}
                    variant="body1"
                  >{`${question.Answers.length} Answers`}</Typography>
                </Grid>
                <Grid item xs={12}>
                  {question.Answers.map((answer, i) => (
                    <Answer
                      key={i}
                      Answer={answer}
                      Author={question.Author.email}
                    />
                  ))}
                </Grid>
                {userCookie && userCookie.complateProfile ? (
                  <div>
                    {" "}
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                        <Editor hint="Add Your Answer" setBody={setBody} />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          style={{ marginTop: "3%" }}
                          onClick={sendAnswer}
                        >
                          Submit
                        </Button>
                      </Box>
                    </Grid>
                  </div>
                ) : null}
              </Grid>
            </Paper>
          </Box>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
