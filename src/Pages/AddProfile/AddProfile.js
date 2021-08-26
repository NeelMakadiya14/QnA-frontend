import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import PersonalDetails from "./PersonalDetails";
import Acad from "./Acad";
import ProfilePic from "./ProfilePic";
import MyAppBar from "../../Components/MyAppBar";
import { useNavigate } from "@reach/router";
import axios from "axios";
import queryString from "query-string";
import { Cookies, useCookies } from "react-cookie";
import { Box } from "@material-ui/core";

require("dotenv").config();

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: "9%",
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ["Personal Details", "Work details", "Add Profile Pic"];

const API_URL = process.env.REACT_APP_BACKEND_URL;

const sendData = (obj, userCookie, setCookie) => {
  console.log("Setdata Called..");

  let cancel;

  if (cancel) {
    cancel();
  }

  axios
    .post(`${API_URL}/api/users/adduser`, obj, {
      cancelToken: new axios.CancelToken((c) => {
        cancel = c;
      }),
    })
    .then((res) => {
      console.log(res);
      let authCookie = { ...userCookie, complateProfile: true };
      console.log(authCookie);
      setCookie("userCookie", authCookie);
      console.log("Done ....");
      // navigate(`/profile/${userCookie.email}`);
    })
    .catch((err) => console.log(err));
};
export default function AddProfile(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const navigate = useNavigate();
  //  const history = useHistory();
  //  histort.push("/profile");

  const [data, setData] = useState({});

  const cookies = new Cookies();
  const [cookie, setCookie] = useCookies([""]);
  const userCookie = cookies.get("userCookie");

  const email = userCookie.email;

  //  console.log(process.env);
  console.log("URL : ", API_URL);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/users/getUser?` + queryString.stringify({ email }))
      .then((res) => {
        if (res.data !== false) {
          console.log("get : ", res.data[0]);
          let obj = {
            fname: res.data[0].Name.split(" ")[0],
            lname: res.data[0].Name.split(" ")[1],
            mobile: res.data[0].Mnumber,
            twitter: res.data[0].Twitter,
            city: res.data[0].City,
            state: res.data[0].State,
            country: res.data[0].Country,
            company: res.data[0].Company,
            location: res.data[0].Clocation,
            AboutYourself: res.data[0].Bio,
            website: res.data[0].Website,
            imgUrl: res.data[0].picUrl,
            linkedInUrl: res.data[0].linkedInUrl,
          };
          //   let obj = res.data[0];
          setData(obj);
        }
      })
      .catch((err) => console.log(err));

    console.log("retriveed data", data);
  }, []);

  console.log("data : ", data);

  const handleNext = () => {
    console.log("previousStep : ", activeStep);
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <PersonalDetails data={data} setData={setData} next={handleNext} />
        );
      case 1:
        return (
          <Acad
            data={data}
            setData={setData}
            next={handleNext}
            back={handleBack}
          />
        );
      case 2:
        return (
          <ProfilePic
            data={data}
            setData={setData}
            next={handleNext}
            back={handleBack}
          />
        );
      case 3:
        console.log("post : ", data);
        const obj = {
          GID: userCookie.GID,
          email: userCookie.email,
          Name: data.fname + " " + data.lname,
          Mnumber: data.mobile,
          Twitter: data.twitter,
          City: data.city,
          State: data.state,
          Country: data.country,
          Company: data.company,
          Clocation: data.location,
          Bio: data.AboutYourself,
          Website: data.website,
          picUrl: data.imgUrl,
          linkedInUrl: data.linkedInUrl,
        };
        console.log("post after : ", obj);

        sendData(obj, userCookie, setCookie);

        return null;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <MyAppBar />
      <Box display="flex" justifyContent="center" alignItems="center">
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Complate Your Profile
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>{getStepContent(activeStep)}</React.Fragment>
          </Paper>
        </main>
      </Box>
    </React.Fragment>
  );
}
