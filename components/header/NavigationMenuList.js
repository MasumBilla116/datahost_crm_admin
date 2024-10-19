import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useContext } from "react";
import { CheckAccessCode } from "../../utils/CheckAccessCode";
import ML_Accounts from "../moduleList/Accounts";
import ML_Booking from "../moduleList/Booking";
import ML_Channel from "../moduleList/Channel";
import ML_Customer from "../moduleList/Customer";
import ML_Housekeeping from "../moduleList/Housekeeping";
import ML_Inventory from "../moduleList/Inventory";
import ML_Laundry from "../moduleList/Laundry";
import ML_Locker from "../moduleList/Locker";
import ML_Restaurant from "../moduleList/POS";
import ML_Purchase from "../moduleList/Purchase";
import ML_RoomService from "../moduleList/RoomService";
import ML_RoomsAndTower from "../moduleList/RoomTower";
import ML_Settings from "../moduleList/Settings";
import ML_Suppliers from "../moduleList/Suppliers";
import ML_Transport from "../moduleList/Transport";
import Hrm from "./../../components/moduleList/Hrm";
import themeContext from "./../context/themeContext";

// mui style
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function NavigationMenuList(props) {
   
  // context
  const context = useContext(themeContext);
  const {
    settingsObj,
    CurrencyInfoActive,
    setInvoiceLength,
    invoiceLength,
    setHoldDataNotification,
    holdDataNotification,
    fetchHoldDataList,
    setModuleItems,
    moduleNameString,
    breadcrumbList,
    toggleDrawer,
    userId,
    permission
  } = context;

  // style
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className="d-flex justify-content-between align-items-center p-2">
        <h5>Modules</h5>
        <button onClick={toggleDrawer(false)} className="btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="12"
            viewBox="0 0 384 512"
          >
            <path
              fill="currentColor"
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
          </svg>
        </button>
      </div>
     { CheckAccessCode("m.hrm", userId,permission) &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="hrm"
        >
          <Typography className={classes.heading}>HRM</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <Hrm toggleDrawer={toggleDrawer}/>
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.cstmr", userId, permission) && <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Customer"
        >
          <Typography className={classes.heading}>Customer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Customer />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.bkng", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="booking"
        >
          <Typography className={classes.heading}>Booking</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Booking />
          </ul>
        </AccordionDetails>
      </Accordion>}

     {CheckAccessCode("m.rm_srvs", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Room-Service"
        >
          <Typography className={classes.heading}>Room Service</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_RoomService />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.rm_tr", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Room-Tower"
        >
          <Typography className={classes.heading}>Room & Tower</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_RoomsAndTower />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.rstrnt", userId, permission)  && <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Restaurant"
        >
          <Typography className={classes.heading}>Restaurant</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Restaurant />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.hskpng", userId, permission)  && <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Housekeeping"
        >
          <Typography className={classes.heading}>Housekeeping</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Housekeeping />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.lndr", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Laundry"
        >
          <Typography className={classes.heading}>Laundry</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Laundry />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.lckr", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Locker"
        >
          <Typography className={classes.heading}>Locker</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Locker />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.tnsprt", userId, permission)  && <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Transport"
        >
          <Typography className={classes.heading}>Transport</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Transport />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.invtr", userId, permission)  && <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Inventory"
        >
          <Typography className={classes.heading}>Inventory</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Inventory />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.prchs", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Purchase"
        >
          <Typography className={classes.heading}>Purchase</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Purchase />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.splr", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Supplier"
        >
          <Typography className={classes.heading}>Supplier</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Suppliers />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.acnt", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="Accounts"
        >
          <Typography className={classes.heading}>Accounts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Accounts />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.stng", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="settings"
        >
          <Typography className={classes.heading}>Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Settings />
          </ul>
        </AccordionDetails>
      </Accordion>}

      {CheckAccessCode("m.chnl", userId, permission)  &&  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="CHANNEL"
        >
          <Typography className={classes.heading}>CHANNEL</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="res-navbar-menu-list list-item-none ps-0">
            <ML_Channel />
          </ul>
        </AccordionDetails>
      </Accordion>}
    </div>
  );
}
