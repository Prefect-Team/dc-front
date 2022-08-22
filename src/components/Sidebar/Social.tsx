import { Link, useMediaQuery } from "@material-ui/core";
// import { ReactComponent as Telegram } from "../../assets/images/telegram-line.svg";
// import { ReactComponent as Github } from "../../assets/images/github.svg";
// import { ReactComponent as Facebook } from "../../assets/images/Facebook.svg";
// import { ReactComponent as Twitter } from "../../assets/images/Twitter.svg";
// import { ReactComponent as Instagram } from "../../assets/images/Instagram.svg";

import React from "react";
import { useLocation } from "react-router-dom";
import "./Sidebar.scss";

const Social: React.FC = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const isHome = location.pathname.indexOf("home") > 0;

  return (
    <div className="social-row">
      <div className="social-row-icon add_margin">
        <Link href="#home" className="social-row-icon">
          {/* <SvgIcon component={Facebook} /> */}
          <span>Home</span>
        </Link>
      </div>
      <div className="social-row-icon add_margin">
        <Link href="#marketPlace" className="social-row-icon">
          {/* <SvgIcon component={Twitter} /> */}
          <span>NFT MarketPlace</span>
        </Link>
      </div>
      <div className="social-row-icon add_margin">
        <Link href="#claim" className="social-row-icon">
          {/* <SvgIcon component={Instagram} /> */}
          <span>Claim</span>
        </Link>
      </div>
      <div className="social-row-icon add_margin">
        <Link href="#about">
          {/* <SvgIcon component={Github} /> */}
          <span>About</span>
        </Link>
      </div>
      <div className="social-row-icon add_margin">
        <Link href="#work" className="social-row-icon">
          {/* <SvgIcon component={Telegram} /> */}
          <span>How it works</span>
        </Link>
      </div>
    </div>
  );
};

export default Social;
