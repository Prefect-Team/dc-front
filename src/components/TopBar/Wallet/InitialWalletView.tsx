import { Trans } from "@lingui/macro";
import { Box, Button, IconButton, Typography, useMediaQuery, useTheme, withStyles } from "@material-ui/core";
// import { Skeleton } from "@material-ui/lab";
// import { Icon } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { t } from "@lingui/macro";
import {
  MBTCStaking_ABI,
  MBTCStaking_ADDRESS,
  mBTC_ADDRESS,
  MFuel_ABI,
  // mFuel_ADDRESS,
  NFTMiner_ADDRESS,
} from "src/contract";
import { useAppSelector, useWeb3Context } from "src/hooks";
import useCurrentTheme from "src/hooks/useTheme";
import DClogo from "../../../assets/images/dc_logo.png";
import WalletAddressEns from "./WalletAddressEns";
import { Referral_ADDRESS, Referral_ABI, ERC20_ABI } from "src/contract";
import { useDispatch } from "react-redux";
import { Encrypt } from "src/helpers/aes";
import baseUrl from "src/helpers/baseUrl";
import { CUR_NETWORK_ID } from "src/constants/network";
import { bnToNum, formatMBTC } from "src/helpers";
import useTronWeb from "src/hooks/useTronWeb";
const DisconnectButton = () => {
  const { userAddress, isTronWeb, handleDisConnect } = useTronWeb();

  const { disconnect, connected } = useWeb3Context();
  const disconnectWallet = () => {
    if (connected) {
      disconnect();
    } else {
      handleDisConnect();
    }
  };
  return (
    <Button onClick={disconnectWallet} className="disconnectd_btn" variant="contained" size="large" color="secondary">
      <Trans>Disconnect</Trans>
    </Button>
  );
};

const CloseButton = withStyles(theme => ({
  root: {
    ...theme.overrides?.MuiButton?.containedSecondary,
    width: "30px",
    height: "30px",
  },
}))(IconButton);

const WalletTotalValue = () => {
  const { address: userAddress, provider, networkId, providerInitialized, connected } = useWeb3Context();
  const signer = provider.getSigner();
  const isLoading = useAppSelector(s => s.app.loading);
  const marketPrice = useAppSelector(s => s.app.marketPrice || 0);
  const [currency, setCurrency] = useState<"USD" | "OHM">("USD");
  const [mbtcBalance, setMbtcBalance] = useState<string>("0");
  const [mfuelBalance, setMfuelBalance] = useState<string>("0");
  const [ERC20Address, setERC20Address] = useState("");
  const [quintBalance, setQuintBalance] = useState("0");
  const [num, setNum] = useState<number>(0);
  const dispatch = useDispatch();

  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  const getMBTCToken = async () => {
    try {
      const mbtcContract = new ethers.Contract(mBTC_ADDRESS, MFuel_ABI, signer);
      const tx = await mbtcContract.balanceOf(userAddress);
      const mbtcBalance = (tx / Math.pow(10, 18)).toFixed(2);
      setMbtcBalance(mbtcBalance || "0");
    } catch (err) {
      console.log(err);
    }
  };

  const getCoinNum = async () => {
    try {
      const PurchaseInfo = new ethers.Contract(Referral_ADDRESS, Referral_ABI, signer);
      let ercaddress = "";
      if (!ERC20Address) {
        ercaddress = await PurchaseInfo.fetchPaytype();
        // console.log(ercaddress, "txOne");
        setERC20Address(ercaddress);
      }
      const approvalInfo = new ethers.Contract(ERC20Address || ercaddress, ERC20_ABI, signer);

      const balance = await approvalInfo.balanceOf(userAddress);
      const num = formatMBTC(bnToNum(balance));
      setQuintBalance(num);
    } catch (err) {
      console.log({ err });
    }
  };

  /** nft质押中的数量 **/
  const minerAmountOf = async (address: string) => {
    try {
      const mbtcStakingContract = new ethers.Contract(MBTCStaking_ADDRESS, MBTCStaking_ABI, signer);
      const res = await mbtcStakingContract.minerAmountOf(address);
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const getNftNum = async () => {
    try {
      if (!userAddress) {
        return;
      }
      const centralApi = `${baseUrl}/system/open/api/nft/owner/detail`;
      const {
        data: { total },
      } = await fetch(centralApi, {
        method: "post",
        body: JSON.stringify({
          sign: "",
          data: Encrypt({
            contract: NFTMiner_ADDRESS,
            address: userAddress,
          }),
        }),
        headers: {
          "content-type": "application/json",
        },
      }).then(res => {
        return res.json();
      });
      const stakedNum = await minerAmountOf(userAddress);
      setNum(total + Number(stakedNum));
    } catch (err) {
      console.log({ err });
    }
  };

  // const mbtcPrice = useMBTCPrice().data || 0;

  useEffect(() => {
    try {
      if (provider && userAddress && networkId === CUR_NETWORK_ID) {
        getCoinNum();
      }
    } catch (err) {
      console.log(err);
    }
  }, [networkId, connected]);

  return (
    <Box className="tooBar-container toobar_container" onClick={() => setCurrency(currency === "USD" ? "OHM" : "USD")}>
      <WalletAddressEns />
      <div className="address-list">
        <div className="address-list-item">
          <div className="first_item">
            <img src={DClogo} className="icon" />
            <div className="name">{t`UXDT`}</div>
          </div>
          <div className="count-only">{quintBalance}</div>
        </div>
      </div>
    </Box>
  );
};

function InitialWalletView({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [currentTheme] = useCurrentTheme();
  const { networkId } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <Box className="init_container">
      <Box sx={{ padding: theme.spacing(0, 3), display: "flex", flexDirection: "column" }} className="init_box">
        <Box
          className="toolBar-title"
          sx={{ display: "flex", justifyContent: "space-between", padding: theme.spacing(3, 0) }}
        >
          <Typography variant="h1" component="div" style={{ color: "#fff", fontWeight: "500", fontSize: "24px" }}>
            {t`My Wallet`}
          </Typography>
        </Box>
        <WalletTotalValue />
        <Box className="bottom_box" sx={{ marginX: "auto" }} style={{ display: "flex", justifyContent: "center" }}>
          <DisconnectButton />
        </Box>
      </Box>
    </Box>
  );
}

export default InitialWalletView;
