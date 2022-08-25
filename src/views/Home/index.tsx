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
// import { CUR_NETWORK_ID } from "src/constants/network";
import { useWeb3Context } from "src/hooks/web3Context";
import logoImg from "../../assets/images/dc_logo.png";
import { error } from "../../slices/MessagesSlice";
import { useDispatch } from "react-redux";
import { DigitalCurrency_ABI, UXDT_ADDRESS, ERC20_ABI, ERC20_ADDRESS } from "src/contract";
import { ethers } from "ethers";
import { bnToNum } from "src/helpers";
import BN from "bignumber.js";
export function Home() {
  const maxInt = new BN("2").pow(new BN("256").minus(new BN("1")));
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const { connected, provider, address, networkId } = useWeb3Context();
  const signer = provider.getSigner();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [luntime, setLunchTime] = useState(1661111648);
  const [buyValue, setBuyValue] = useState("");
  const [usdxPrice, setUsdxPrice] = useState("1.00000001");
  const [balance, setBalance] = useState("0.00000000");
  const [worth, setWorth] = useState("0.00000000");
  const handleChangeBuyValue = (e: any) => {
    setBuyValue(e.target.value);
  };
  // get luntime
  const getLunchTime = async () => {
    setLoading(true);
    try {
      const uxdtContract = new ethers.Contract(UXDT_ADDRESS, DigitalCurrency_ABI, signer);
      const tx = await uxdtContract.launchTime();
      const time = bnToNum(tx);
      setLunchTime(time);
      console.log(tx, "tx", time, loading);
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to getLunchTime`));
    }
  };
  // get balance
  const getBalances = async () => {
    setLoading(true);
    try {
      const uxdtContract = new ethers.Contract(UXDT_ADDRESS, DigitalCurrency_ABI, signer);
      const tx = await uxdtContract.balanceOf(address);
      console.log(tx);
      const balanceVal = bnToNum(tx).toFixed(8);
      setBalance(balanceVal);
      console.log(tx, "tx", balanceVal);
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to getBalances`));
    }
  };
  // buy
  const buyAction = async () => {
    setLoading(true);
    try {
      const usdContract = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, signer);
      const tx = await usdContract.approve(UXDT_ADDRESS, maxInt.c?.join(""));
      const txCB = await tx.wait();
      console.log(txCB, "tx");
      if (txCB.status) {
        const uxdtContract = new ethers.Contract(UXDT_ADDRESS, DigitalCurrency_ABI, signer);
        const tx = await uxdtContract.Buy(buyValue);
        console.log(tx, "[]===");
      }
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to Purchase`));
    }
  };
  useEffect(() => {
    if (provider && address) {
      getLunchTime();
      getBalances();
    }
  }, [connected]);
  useEffect(() => {
    const timer = setInterval(() => {
      const timeNow = parseInt((new Date().getTime() / 1000).toString());
      const price = Math.pow(1.618, (timeNow - luntime) / 31536000).toFixed(8);
      setUsdxPrice(price);
      const worth = (Number(price) * Number(balance)).toFixed(8);
      setWorth(worth);
    }, 1000);
    return () => clearInterval(timer);
  }, [usdxPrice]);
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
              <div className="left">{address.slice(0, 7) + "..." + address.slice(-4)}</div>
              <div className="right">
                <ul>
                  <li>
                    <p className="title">UXDT Price in USD</p>
                    <p className="content">{usdxPrice}</p>
                  </li>
                  <li>
                    <p className="title">My UXDT Balance</p>
                    <p className="content">{balance}</p>
                  </li>
                  <li>
                    <p className="title">My USD Net Worth</p>
                    <p className="content">{worth}</p>
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
              <button className="action_box" onClick={buyAction}>
                Buy
              </button>
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
