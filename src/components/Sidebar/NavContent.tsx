/* eslint-disable */
import "./Sidebar.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Divider, Link, Paper, SvgIcon } from "@material-ui/core";
import { NavItem } from "@olympusdao/component-library";
import React from "react";

import { ReactComponent as MBTCIcon } from "../../assets/icons/Vector.svg";
// import Social from "./Social";

type NavContentProps = {
  handleDrawerToggle?: () => void;
};

const NavContent: React.FC<NavContentProps> = ({ handleDrawerToggle }) => {
  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href={"/#/home"} target="_blank" style={{ marginBottom: "1rem", paddingLeft: "35px" }}>
              <SvgIcon
                color="primary"
                component={MBTCIcon}
                viewBox="0 0 85 61"
                style={{ minWidth: "77px", minHeight: "66px", width: "77px" }}
              />
            </Link>
            {/* <WalletAddressEns /> */}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} underline="none" />
              <NavItem to="/mine" icon="dashboard" label={t`Mine`} underline="none" />
              <NavItem to="/pool" icon="dashboard" label={t`Pool`} underline="none" />
              <NavItem to="/mint" icon="dashboard" label={t`Mint`} underline="none" />
              <NavItem to="/market" icon="dashboard" label={t`NFT Market`} underline="none" />
              <Box className="menu-divider">
                <Divider />
              </Box>
            </div>
          </div>
        </div>
        {/* <Box className="dapp-menu-social" display="flex" justifyContent="center">
          <div className="social_box">
            <Social />
          </div>
        </Box> */}
      </Box>
    </Paper>
  );
};

export default NavContent;
