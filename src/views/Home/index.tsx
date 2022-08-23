import "./styles.scss";
import { t } from "@lingui/macro";
import { useEffect, useState } from "react";
import {
  // Container,
  useMediaQuery,
  Typography,
  // Box,
  FormControl,
  Input,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { CUR_NETWORK_ID } from "src/constants/network";
import { useWeb3Context } from "src/hooks/web3Context";
import logoImg from "../../assets/images/dc_logo.png";
export function Home() {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const { connected, provider, address, networkId } = useWeb3Context();
  const signer = provider.getSigner();
  const [loading, setLosding] = useState(false);
  const [buyValue, setBuyValue] = useState("");
  const handleChangeBuyValue = (e: any) => {
    setBuyValue(e.target.value);
  };
  useEffect(() => {
    if (provider && networkId === CUR_NETWORK_ID && address) {
    }
  }, [connected]);
  return (
    <div className={isSmallScreen ? "isMobile" : ""}>
      <div className="block1">
        <div className="video_box">
          <video
            src={window.location.origin + (isSmallScreen ? "/phone.mp4" : "/final.mp4")}
            muted
            autoPlay
            loop
            playsInline={true}
            controls={false}
            className="coin-vedio"
          ></video>
        </div>
        <div className="container_box">
          <div className="top_box">
            <div className="top_cont">
              <img src={logoImg} />
              <p className="title">Digital Currency</p>
            </div>
            <div className="bottom_cont">
              <div className="left">0x0000...0000</div>
              <div className="right">
                <ul>
                  <li>
                    <p className="title">UXDT Price in USD</p>
                    <p className="content">000 000 000. 00</p>
                  </li>
                  <li>
                    <p className="title">My UXDT Balance</p>
                    <p className="content">000 000 000. 00</p>
                  </li>
                  <li>
                    <p className="title">My USD Net Worth</p>
                    <p className="content">000 000 000. 00</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bottom_box">
            <div className="buy_box">
              <div className="left_input">
                <FormControl variant="standard" className="input_box add_margin">
                  <Input placeholder="Amount" id="component-simple" value={buyValue} onChange={handleChangeBuyValue} />
                </FormControl>
                <button>Max</button>
              </div>
              <button className="action_box">Buy</button>
            </div>
            <div className="buy_box sell_box">
              <div className="left_input">
                <FormControl variant="standard" className="input_box add_margin">
                  <Input placeholder="Amount" id="component-simple" value={buyValue} onChange={handleChangeBuyValue} />
                </FormControl>
                <button>Max</button>
              </div>
              <button className="action_box">Sell</button>
            </div>
          </div>
        </div>
      </div>

      <Backdrop open={loading} className="loading_box">
        <CircularProgress color="inherit" />
        <Typography variant="h5" style={{ marginLeft: "1rem" }}>
          {t`Communicating with blockchain nodes...`}
        </Typography>
      </Backdrop>
    </div>
  );
}
