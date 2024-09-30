  import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { makeStyles } from "@material-ui/core/styles";
import { useContext } from "react";
import themeContext from "../../components/context/themeContext";
import Axios from "../../utils/axios";
import NavigationMenuList from "./NavigationMenuList";

  // mui style
  const useStyles = makeStyles({
    list: {
      width: 500,
    },
    fullList: {
      width: "auto",
    },
  });

  export default function NavDrawer() {
    // custome http
    const { token, user, logout, http } = Axios();

    // create style
    const classes = useStyles();


    const context = useContext(themeContext);

    const { toggleDrawer, isDawerOpen } = context; 

    const logoutHandle = () => {
      if (token != undefined) {
        logout();
      }
    };

    return (
      <div className="position-relative">
        <span className="bar-dawer-btn">
        <button
          onClick={toggleDrawer(true)}
          type="button"
          className="btn d-flex justify-content-center align-items-center text-white "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="25"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
            />
          </svg>
        </button>

        </span>
        <span className="grid-dawer-btn">
        <button
          onClick={toggleDrawer(true)}
          type="button"
          className="btn d-flex justify-content-center align-items-center " 
        >
          <svg
            width="24"
            height="24"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 20.4V14.6C14 14.2686 14.2686 14 14.6 14H20.4C20.7314 14 21 14.2686 21 14.6V20.4C21 20.7314 20.7314 21 20.4 21H14.6C14.2686 21 14 20.7314 14 20.4Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3 20.4V14.6C3 14.2686 3.26863 14 3.6 14H9.4C9.73137 14 10 14.2686 10 14.6V20.4C10 20.7314 9.73137 21 9.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M14 9.4V3.6C14 3.26863 14.2686 3 14.6 3H20.4C20.7314 3 21 3.26863 21 3.6V9.4C21 9.73137 20.7314 10 20.4 10H14.6C14.2686 10 14 9.73137 14 9.4Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3 9.4V3.6C3 3.26863 3.26863 3 3.6 3H9.4C9.73137 3 10 3.26863 10 3.6V9.4C10 9.73137 9.73137 10 9.4 10H3.6C3.26863 10 3 9.73137 3 9.4Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        </span>
        <SwipeableDrawer
          anchor="left"
          open={isDawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <NavigationMenuList toggleDrawer={toggleDrawer} />
          <button
            onClick={logoutHandle}
            type="button"
            className="btn w-100 d-block text-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
            >
              <path
                fill={"#949BA1"}
                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
              />
            </svg>
            <span className="ms-2">Logout</span>
          </button>
        </SwipeableDrawer>
      </div>
    );
  }
