import React, { useContext, useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "@reach/router";
import { v1 as uuid } from "uuid";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import axios from "axios";
import queryString from "query-string";
import Button from "@material-ui/core/Button";
import GoogleLogin from "react-google-login";
import { GoogleOutlined } from "@ant-design/icons";
import Font from "react-font";
import TextField from "@material-ui/core/TextField";
import { useNavigate } from "@reach/router";
import { Cookies, useCookies } from "react-cookie";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  search: {
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
  },
  dropdown: {
    color: "white",
  },
  place: {
    color: "secondary",
  },
}));

export default function MyAppBar(props) {
  const classes = useStyles();

  const id = uuid();

  const [cookie, setCookie] = useCookies([""]);
  const cookies = new Cookies();
  const userCookie = cookies.get("userCookie");
  console.log("MYAPPBAR...");
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const client_id = process.env.REACT_APP_CLIENT_ID;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const logout = () => {
    //const { cookies } = this.props;
    cookies.remove("userCookie");
    window.location.href = "/";
    // return false;
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userCookie ? (
        <MenuItem
          component={Link}
          to={
            userCookie.complateProfile
              ? `/profile/${userCookie.email}`
              : `//editprofile`
          }
          onClick={handleMenuClose}
        >
          My Profile
        </MenuItem>
      ) : null}

      <MenuItem component={Link} to="/editprofile" onClick={handleMenuClose}>
        {" "}
        Edit Profile{" "}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          logout();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const responseGoogle = (response) => {
    console.log(response);
    let authCookie = {
      email: response.profileObj.email,
      name: response.profileObj.name,
      GID: response.googleId,
    };

    axios
      .get(`${API_URL}/api/users/getUser?email=${response.profileObj.email}`)
      .then((response) => {
        if (response.data == false) {
          authCookie = { ...authCookie, complateProfile: false };
          console.log(authCookie);
          setCookie("userCookie", authCookie);

          navigate(`/editprofile`);
        } else {
          authCookie = { ...authCookie, complateProfile: true };
          console.log(authCookie);
          setCookie("userCookie", authCookie);

          navigate(`/`);
        }
      })
      .catch(() => {
        console.log("Error!");
      });

    // window.location.reload();
  };

  const fail = (res) => {
    console.log("Failed ", res);
  };

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [pic, setPic] = useState("");
  const loading = open && options.length === 0;
  const CloudName = process.env.REACT_APP_CLOUD_NAME;
  const navigate = useNavigate();

  const gotoProfile = (option) => {
    console.log(option);
    navigate(`/profile/${option.email}`);
    window.location.reload();
  };

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      var option;
      axios
        .get(`${API_URL}/authorlist?name=${inputValue}`)
        .then((res) => {
          option = res.data;
          console.log(option);

          if (active) {
            setOptions(option);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })();

    return () => {
      active = false;
    };
  }, [loading, inputValue, setInputValue]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Font family="Viga">
            <Button
              size="medium"
              href="/"
              style={{
                color: "white",
                fontSize: "20px",
                fontFamily: "Viga",
                fontStyle: "italic",
              }}
            >
              QnA
            </Button>
          </Font>

          <div style={{ marginLeft: "auto", marginRight: "20px" }}>
            {userCookie ? (
              userCookie.complateProfile ? (
                <Button
                  size="large"
                  href={`/ask`}
                  style={{ paddingRight: "20px", color: "white" }}
                >
                  Ask A Question
                </Button>
              ) : (
                <Button
                  size="large"
                  href={`/editprofile`}
                  style={{ paddingRight: "20px", color: "white" }}
                >
                  Ask A Question
                </Button>
              )
            ) : null}

            {userCookie === undefined ? (
              <GoogleLogin
                clientId={client_id}
                buttonText=""
                onSuccess={responseGoogle}
                onFailure={fail}
                size="medium"
                href="/"
                render={(renderProps) => (
                  <GoogleOutlined
                    onClick={renderProps.onClick}
                    disabled={false} //disabled={renderProps.disabled}
                    style={{ fontSize: "30px" }}
                  />
                )}
              >
                {/* <Link to="/"> </Link> */}
              </GoogleLogin>
            ) : (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                size="large"
              >
                <AccountCircle />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
