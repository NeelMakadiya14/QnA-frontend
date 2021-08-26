import React, { useEffect, useState } from "react";
import MyAppBar from "../Components/MyAppBar";
import { Toolbar } from "@material-ui/core";
import Editor from "../Components/Editor";
import { Formik } from "formik";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
} from "@material-ui/core";
import axios from "axios";
import queryString from "query-string";
import { Cookies } from "react-cookie";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useNavigate } from "@reach/router";
import { tags } from "../Utils/Constant.js";

require("dotenv").config();

export default function Ask() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const cookies = new Cookies();
  const userCookie = cookies.get("userCookie");
  const email = userCookie.email;

  const [question, setQuestion] = useState({});
  const [body, setBody] = useState("");

  const navigate = useNavigate();

  return (
    <div>
      <Toolbar>
        <MyAppBar />
      </Toolbar>
      <Formik
        enableReinitialize={true}
        initialValues={{
          title: "",
          tags: [],
        }}
        validate={(values) => {
          const errors = {};
          return errors;
        }}
        onSubmit={async (values) => {
          console.log("Values : ", values);
          console.log("Body : ", body);
          //   setQuestion({ ...values, body: body });

          console.log("Question : ", { ...values, body: body });
          axios
            .post(
              `${API_URL}/api/questions/addquestion?` +
                queryString.stringify({ email }),
              { ...values, body: body }
            )
            .then((res) => {
              console.log("Response : ", res.data.qid);
              navigate(`/question/${res.data.qid}`);
              //   window.location.href = "/";
            })
            .catch((err) => {
              console.log("Error : ", err);
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Paper style={{ width: "60%", padding: "2%", marginTop: "5%" }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        style={{ marginLeft: "3%" }}
                      >
                        Title of the Question
                      </Typography>
                      <TextField
                        required
                        id="title"
                        name="title"
                        variant="outlined"
                        fullWidth
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Editor
                        setBody={setBody}
                        hint={"Describe the Question"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        id="tags"
                        options={tags}
                        onChange={(event, newValue) => {
                          console.log(newValue);
                          setFieldValue("tags", newValue);
                        }}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Add Tags"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Submit
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </FormControl>
          </form>
        )}
      </Formik>
    </div>
  );
}
