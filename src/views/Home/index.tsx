import "./styles.scss";
import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import {
  // Container,
  useMediaQuery,
  Typography,
  // Box,
  // FormControl,
  // Input,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { CUR_NETWORK_ID } from "src/constants/network";
import { useWeb3Context } from "src/hooks/web3Context";
// import { useHistory, useLocation } from "react-router-dom";
// import { error, info } from "../../slices/MessagesSlice";
// import { useDispatch } from "react-redux";
// import { Referral_ADDRESS, Referral_ABI, ERC20_ABI } from "src/contract";
// import { ethers } from "ethers";
// import { bnToNum, formatMBTC } from "src/helpers";
// import BN from "bignumber.js";
// import { updateStatus } from "../../slices/UserInfo";
export function Home() {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const { connected, provider, address, networkId } = useWeb3Context();
  const signer = provider.getSigner();
  const [loading, setLosding] = useState(false);
  useEffect(() => {
    if (provider && networkId === CUR_NETWORK_ID && address) {
    }
  }, [connected]);
  return (
    <div className={isSmallScreen ? "isMobile" : ""}>
      <div className="block1"></div>
      <Backdrop open={loading} className="loading_box">
        <CircularProgress color="inherit" />
        <Typography variant="h5" style={{ marginLeft: "1rem" }}>
          {t`Communicating with blockchain nodes...`}
        </Typography>
      </Backdrop>
    </div>
  );
}
