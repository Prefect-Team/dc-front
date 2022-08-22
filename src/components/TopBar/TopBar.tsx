import "./TopBar.scss";

import { i18n } from "@lingui/core";
import { AppBar, Box, SvgIcon, Toolbar, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LocaleSwitcher } from "@olympusdao/component-library";
import { ReactComponent as MenuIcon } from "../../assets/icons/menu.svg";
// import { ReactComponent as NftMine } from "../../assets/icons/NftMine.svg";
// import { ReactComponent as NftMarket } from "../../assets/icons/NftMarket.svg";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { locales, selectLocale } from "../../locales";
import { useLocation, useHistory } from "react-router-dom";
import MyNft from "./MyNft";
// import ThemeSwitcher from "./ThemeSwitch";
import Wallet from "./Wallet";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(981)]: {
      display: "none",
    },
  },
}));

interface TopBarProps {
  theme: string;
  toggleTheme: (e: KeyboardEvent) => void;
  handleDrawerToggle: () => void;
}

function TopBar({ theme, toggleTheme, handleDrawerToggle }: TopBarProps) {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const location = useLocation();
  const history = useHistory();
  const isDetail = location.pathname.indexOf("marketDetail") >= 0;
  const onBackList = () => {
    history.go(-1);
  };

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar
        disableGutters
        className="dapp-topbar"
        style={{
          justifyContent: isDetail || isSmallScreen || isVerySmallScreen ? "space-between" : "flex-end",
        }}
      >
        <Box
          id="hamburger"
          onClick={handleDrawerToggle}
          className="toolBar-menu"
          style={{
            display: isSmallScreen || isVerySmallScreen ? "block" : "none",
          }}
        >
          <SvgIcon component={MenuIcon} htmlColor="#FFF" style={{ fontSize: 30 }} />
        </Box>
        <Box
          className="left-back"
          onClick={onBackList}
          style={{
            display: isSmallScreen || isVerySmallScreen || !isDetail ? "none" : "block",
          }}
        >
          <SvgIcon fontSize="large" style={{ color: "#FFFFFF" }} component={ArrowBackIosRoundedIcon} />
        </Box>
        <Box display="flex">
          <MyNft />
          <Wallet />
          {/* <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} /> */}
          <LocaleSwitcher
            initialLocale={i18n.locale}
            locales={locales}
            onLocaleChange={selectLocale}
            label={i18n.locale}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
