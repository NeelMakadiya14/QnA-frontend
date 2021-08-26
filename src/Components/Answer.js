import { grid } from "@material-ui/system";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Cookies } from "react-cookie";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { Typography, Box, Paper, Grid } from "@material-ui/core";
import { Markup } from "interweave";
import {
  CaretUpFilled,
  CaretDownFilled,
  CaretDownOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import queryString from "query-string";

export default function Answer(props) {
  const cookie = new Cookies();
  const userCookie = cookie.get("userCookie");
  let email = userCookie ? userCookie.email : "";
  let userId;

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const [count, setCount] = useState(0);
  const [upVoted, setUpvoted] = useState(false);
  const [downVoted, setDownvoted] = useState(false);

  const upVote = async () => {
    let upVote;
    upVoted ? (upVote = "0") : (upVote = "1");
    axios
      .post(
        `${API_URL}/api/answers/upvote?` +
          queryString.stringify({
            email,
            aid: props.Answer._id,
            upVoted: upVote,
          })
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    upVoted ? setCount(count - 1) : setCount(count + 1);
    setUpvoted(!upVoted);
  };

  const downVote = async () => {
    let downVote;
    downVoted ? (downVote = "0") : (downVote = "1");
    axios
      .post(
        `${API_URL}/api/answers/downvote?` +
          queryString.stringify({
            email,
            aid: props.Answer._id,
            downVoted: downVote,
          })
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    downVoted ? setCount(count + 1) : setCount(count - 1);
    setDownvoted(!downVoted);
  };

  useEffect(async () => {
    if (userCookie) {
      await axios
        .get(`${API_URL}/api/users/getUser?email=${email}`)
        .then((response) => {
          //  console.log(response);
          console.log(response.data[0]);
          const data = response.data[0];
          userId = data._id;
        })
        .catch(() => {
          console.log("Error!");
        });

      props.Answer.upvote.upVoters.includes(userId)
        ? setUpvoted(true)
        : setUpvoted(false);
      props.Answer.downvote.downVoters.includes(userId)
        ? setDownvoted(true)
        : setDownvoted(false);
    }

    setCount(
      props.Answer.upvote.upVoters.length -
        props.Answer.downvote.downVoters.length
    );
  }, []);

  return (
    <div>
      <div>
        <Box display="flex" style={{ width: "100%" }}>
          <Paper style={{ padding: "2%", margin: "3%", width: "100%" }}>
            <Grid container>
              <Grid item xs={1}>
                {!userCookie || downVoted ? (
                  <CaretUpFilled style={{ color: "gray", fontSize: "250%" }} />
                ) : upVoted ? (
                  <CaretUpFilled
                    onClick={upVote}
                    style={{ color: "#1976d2", fontSize: "250%" }}
                  />
                ) : (
                  <UpOutlined
                    onClick={upVote}
                    style={{
                      fontSize: "180%",
                      marginTop: 5,
                      marginLeft: 5,
                    }}
                  />
                )}
                <Typography variant="h6" style={{ marginLeft: 13 }}>
                  {count}
                </Typography>
                {!userCookie || upVoted ? (
                  <CaretDownFilled
                    style={{ color: "gray", fontSize: "250%" }}
                  />
                ) : downVoted ? (
                  <CaretDownFilled
                    onClick={downVote}
                    style={{ color: "#1976d2", fontSize: "250%" }}
                  />
                ) : (
                  <DownOutlined
                    onClick={downVote}
                    style={{ fontSize: "180%", marginLeft: 5 }}
                  />
                )}
              </Grid>
              <Grid item xs={11} style={{ marginTop: "0%" }}>
                <Markup content={props.Answer.body} />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </div>
    </div>
  );
}
