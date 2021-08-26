import React, { useState, useEffect } from "react";
import MyAppBar from "../Components/MyAppBar";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import Select from "@material-ui/core/Select";
import { FormControl, Box, GridListTileBar } from "@material-ui/core";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import StorageIcon from "@material-ui/icons/Storage";
import { Toolbar, Grid } from "@material-ui/core";
import { tags_home } from "../Utils/Constant";
import { useNavigate } from "@reach/router";
import axios from "axios";
import Loader from "../Components/Loader";
import QuestionCard from "../Components/QuestionCard";
import { drawerWidth } from "../Utils/Constant";
import { WindowsFilled } from "@ant-design/icons";

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth,
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const handleChange = (tag, navigate) => {
  console.log(tag);
  navigate(`/${tag}`);
  window.location.reload();
};

const ListItems = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ListItem
        button
        onClick={() => {
          handleChange("Apptitude", navigate);
        }}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Apptitude" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("Maths", navigate);
        }}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Maths" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("Tech", navigate);
        }}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Tech" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("Database", navigate);
        }}
      >
        <ListItemIcon>
          <StorageIcon />
        </ListItemIcon>
        <ListItemText primary="Database" />
      </ListItem>
    </div>
  );
};

const ProgrammingListItems = () => {
  const navigate = useNavigate();
  return (
    <div>
      <ListSubheader inset>Programming</ListSubheader>
      <ListItem
        button
        onClick={() => {
          handleChange("Java", navigate);
        }}
      >
        <ListItemIcon>
          <i class="devicon-java-plain colored"></i>
        </ListItemIcon>
        <ListItemText primary="Java" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("JavaScript", navigate);
        }}
      >
        <ListItemIcon>
          <i class="devicon-javascript-plain colored"></i>
        </ListItemIcon>
        <ListItemText primary="JavaScript" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("HTML", navigate);
        }}
      >
        <ListItemIcon>
          <i class="devicon-html5-plain colored"></i>
        </ListItemIcon>
        <ListItemText primary="HTML" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("Cpp", navigate);
        }}
      >
        <ListItemIcon>
          <i class="devicon-cplusplus-plain colored"></i>
        </ListItemIcon>
        <ListItemText primary="C++" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("CSS", navigate);
        }}
      >
        <ListItemIcon>
          <i class="devicon-css3-plain colored"></i>
        </ListItemIcon>
        <ListItemText primary="CSS" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("React", navigate);
        }}
      >
        <ListItemIcon>
          <i class="devicon-react-original colored"></i>
        </ListItemIcon>
        <ListItemText primary="React" />
      </ListItem>
      <ListItem
        button
        onClick={() => {
          handleChange("Android", navigate);
        }}
      >
        <ListItemIcon>
          <i class="devicon-android-plain colored"></i>
        </ListItemIcon>
        <ListItemText primary="Android" />
      </ListItem>
    </div>
  );
};

const ThirdListItems = (props) => {
  const navigate = useNavigate();
  return (
    <div>
      <ListSubheader inset>More</ListSubheader>
      <FormControl style={{ marginLeft: 10 }}>
        <Select
          native
          onChange={(event) => handleChange(event.target.value, navigate)}
        >
          <option> {props.tag ? props.tag : "None"} </option>
          {tags_home.map((x, i) => (
            <option key={i} value={x}>
              {x}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default function Home(props) {
  const classes = useStyles();
  console.log(props.tag);

  const [question, setQuestion] = useState([]);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    console.log("props.tag");
    axios
      .get(`${API_URL}/api/questions/getquestionbytag?tag=${props.tag}`)
      .then((res) => {
        console.log(res.data);
        setQuestion(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={3}>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper),
            }}
            open={true}
          >
            <div className={classes.toolbarIcon}>
              {/* <IconButton>
            <ChevronLeftIcon />
          </IconButton> */}
            </div>
            <Divider />
            <List>
              <ListItems />
            </List>
            <Divider />
            <List>
              <ProgrammingListItems />
            </List>
            <Divider />
            <List>
              <ThirdListItems tag={props.tag} />
            </List>
          </Drawer>
        </Grid>
        <Grid item xs={9}>
          <Toolbar>
            <MyAppBar />
          </Toolbar>

          <div>
            {question ? (
              question.map((x, i) => <QuestionCard question={x} key={i} />)
            ) : (
              <Loader />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
