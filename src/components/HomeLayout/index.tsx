// eslint-disable-next-line simple-import-sort/imports
import "./style.scss";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { t } from "@lingui/macro";
import Logo from "../../assets/images/Vector.png";
import MenuClose from "../../assets/icons/nav-close.svg";
// import Social from "../../components/Sidebar/Social";
import Wallet from "../TopBar/Wallet";
import Messages from "../Messages/Messages";
import MyNft from "../TopBar/MyNft";
import {
  AppBar,
  Container,
  useMediaQuery,
  Link,
  Typography,
  Toolbar,
  Box,
  // Menu,
  // MenuItem,
  Collapse,
  // Button,
  // Accordion,
  // AccordionSummary,
  // AccordionDetails,
} from "@material-ui/core";
import React, { useState } from "react";
// ExpandMore as ExpandMoreIcon
import { Menu as MenuIcon } from "@material-ui/icons";

import Headroom from "headroom.js";
import { useWeb3Context } from "src/hooks/web3Context";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const location = useLocation();
  const [zoomed, setZoomed] = useState(false);
  const { connected, provider, address, connect } = useWeb3Context();
  const [anchorElNav, setAnchorElNav] = useState(false);

  useEffect(() => {
    const header: HTMLElement = document.querySelector(".fixed-header") as HTMLElement;
    const headroom = new Headroom(header);
    headroom.init();
  }, []);

  const handleOpenNavMenu = () => {
    setAnchorElNav(true);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(false);
  };

  const links = [
    {
      name: t`Home`,
      href: "#home",
    },
    // {
    //   name: t`NFT MarketPlace`,
    //   href: "#marketPlace",
    // },
    // {
    //   name: t`Claim`,
    //   href: "#claim",
    // },
    // {
    //   name: t`About`,
    //   href: "#about",
    // },
    // {
    //   name: t`How it works`,
    //   href: "#work",
    // },
  ];

  return (
    <div className={`home ${isSmallScreen ? "isMobile" : ""} `}>
      <AppBar className="fixed-header">
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap style={{ lineHeight: 1, paddingTop: "6px" }}>
              <img src={Logo} alt="Quint" className="header-logo" />
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {links.map((link, index) => (
                <Link href={link.href} underline="none" key={index} onClick={handleCloseNavMenu}>
                  <Typography variant="h6" style={{ fontSize: "17px" }}>
                    {link.name}
                  </Typography>
                </Link>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1, justifyContent: "flex-end", display: { xs: "flex", md: "none" } }}>
              {anchorElNav ? (
                <Box onClick={handleCloseNavMenu}>
                  <img src={MenuClose} alt="Quint" className="menu-icon-close" />
                </Box>
              ) : (
                <Box className="right_con">
                  <MyNft />
                  <Wallet />
                  <MenuIcon aria-haspopup="true" onClick={handleOpenNavMenu} className="menu-icon"></MenuIcon>
                </Box>
              )}
            </Box>
            <Box sx={{ justifyContent: "flex-end", display: { xs: "none", md: "flex" } }} className="top_btnbox">
              <MyNft />
              <Wallet />
            </Box>
          </Toolbar>
          <Box sx={{ display: { xs: "block", md: "none" } }} className="list_box">
            <Collapse in={Boolean(anchorElNav)}>
              <Box>
                {links.map((link, index) => (
                  <Box key={index} onClick={handleCloseNavMenu} className="moblie-menu-item">
                    <Link underline="none" href={link.href}>
                      <Typography className="moblie-menu-text">{link.name}</Typography>
                    </Link>
                  </Box>
                ))}
                {connected ? null : (
                  <div className="wallet_top" onClick={handleCloseNavMenu}>
                    <Wallet />
                  </div>
                )}
              </Box>
            </Collapse>
          </Box>
        </Container>
      </AppBar>
      {children}
      <Messages />
      {/* <div className="bottom">
        <Container
          style={{
            paddingTop: isSmallScreen || isVerySmallScreen ? "2rem" : "0",
            paddingBottom: isSmallScreen || isVerySmallScreen ? "2rem" : "0rem",
            width: isSmallScreen || isVerySmallScreen ? "100%" : "1120px",
          }}
        >
          <div className="top_cont">
            <div className="left_first">
              <img src={isFoundation ? LogoCoin : Logo} alt="Quint" className="header-logo" />
            </div>
            <Box style={{ width: "100%", display: "flex" }}>
              <p className="content">
                <span>QUINT</span> is the revolutionary token bringing real-world rewards to investors by linking the
                metaverse with reality. Revolutionary super-staking pools deliver returns while unlocking exclusive
                lifestyle perks. With a Boutique NFT Market Place, Quint Shop and more!
              </p>
            </Box>
          </div>
        </Container>
        <div className="bottom_cont">
          <Container
            style={{
              paddingTop: isSmallScreen || isVerySmallScreen ? "2rem" : "0",
              paddingBottom: isSmallScreen || isVerySmallScreen ? "2rem" : "0rem",
              width: isSmallScreen || isVerySmallScreen ? "100%" : "1120px",
              display: isSmallScreen || isVerySmallScreen ? "block" : "flex",
            }}
          >
            <div className="left_text"></div>
            <div className="right_con">
              <Social />
            </div>
          </Container>
        </div>
      </div> */}
    </div>
  );
}
