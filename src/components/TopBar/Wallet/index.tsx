import { t } from "@lingui/macro";
// import { Button, SwipeableDrawer, Typography, useTheme, withStyles, useMediaQuery } from "@material-ui/core";
import { Button, useTheme } from "@material-ui/core";

import { useState } from "react";
import { useWeb3Context } from "src/hooks/web3Context";
import useTronWeb from "src/hooks/useTronWeb";
import InitialWalletView from "./InitialWalletView";
import WalletChose from "./WalletChose";
import tronLogo from "../../../assets/images/tronlink.svg";
import "./style.scss";
const WalletButton = ({ openWallet }: { openWallet: () => void }) => {
  const { connect, connected, address } = useWeb3Context();
  const { userAddress, isTronWeb, getConnect } = useTronWeb();
  const onClick = connected || isTronWeb.connected ? openWallet : connect;
  const label = connected ? address.slice(0, 6) + "..." + address.slice(-4) : t`Connect Wallet`;
  const tronLabel = isTronWeb.connected ? userAddress.slice(0, 7) + "..." + userAddress.slice(-4) : t`Connect Wallet`;
  const theme = useTheme();
  const connectTron = getConnect;
  return (
    <div className="wallet_chose_box">
      <Button className="wallet_btn" onClick={onClick}>
        {connected ? label : tronLabel}
      </Button>
      <div className="tron_box">
        <img src={tronLogo} className="tron-link" onClick={connectTron} />
      </div>
    </div>
  );
};

export function Wallet() {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const { connect, connected, address } = useWeb3Context();
  const { userAddress, isTronWeb } = useTronWeb();
  const openWallet = () => {
    setWalletOpen(!isWalletOpen);
  };
  // only enable backdrop transition on ios devices,
  // because we can assume IOS is hosted on hight-end devices and will not drop frames
  // also disable discovery on IOS, because of it's 'swipe to go back' feat
  // console.log(isWalletOpen, "isWalletOpen");
  return (
    <div className={isWalletOpen ? "wallet_box" : "wallet_box cancle_bg"}>
      <WalletButton openWallet={openWallet} />
      <WalletChose />
      {connected || isTronWeb.connected ? (
        <div className={isWalletOpen ? "wallet_container open_wallet" : "wallet_container"}>
          <InitialWalletView onClose={closeWallet} />
        </div>
      ) : null}
    </div>
  );
}

export default Wallet;
