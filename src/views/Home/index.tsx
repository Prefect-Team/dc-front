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
import useTronWeb from "src/hooks/useTronWeb";
import logoImg from "../../assets/images/dc_logo.png";
import { error } from "../../slices/MessagesSlice";
import { useDispatch } from "react-redux";
import { DigitalCurrency_ABI, ERC20_ABI, UXDT_ADDRESS, USD_ADDRESS, BSC_USD_ADDRESS } from "src/contract";
import { ethers } from "ethers";
import { bnToNum, formatUxdt } from "src/helpers";
import BN from "bignumber.js";
export function Home() {
  const maxInt = new BN("2").pow(new BN("256").minus(new BN("1")));
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const { connected, provider, address, networkId } = useWeb3Context();
  const { userAddress, isTronWeb } = useTronWeb();
  const signer = provider.getSigner();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [luntime, setLunchTime] = useState(1661111648);
  const [buyValue, setBuyValue] = useState("");
  const [sellValue, setSellValue] = useState("");
  const [usdxPrice, setUsdxPrice] = useState("1.00000001");
  const [balance, setBalance] = useState("0.00000000");
  const [worth, setWorth] = useState("0.00000000");
  const [allowance, setAllowance] = useState(0);
  // console.log(formatUxdt(1000), "测试");
  const handleChangeBuyValue = (e: any) => {
    setBuyValue(e.target.value);
  };
  const handleChangeSellValue = (e: any) => {
    setSellValue(e.target.value);
  };
  // get luntime
  const getLunchTime = async () => {
    setLoading(true);
    try {
      const uxdtContract = new ethers.Contract(UXDT_ADDRESS, DigitalCurrency_ABI, signer);
      const tx = await uxdtContract.launchTime();
      const time = bnToNum(tx);
      setLunchTime(time);
      // console.log(tx, "tx", time, loading);
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
      const balanceVal = bnToNum(tx);
      const val = new BN(balanceVal).div(new BN(10).pow(18)).toFixed(8).toString();
      setBalance(val);
      // console.log(tx, "tx", val);
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to getBalances`));
    }
  };
  // allowance
  const toAllowance = async () => {
    try {
      const usdContract = new ethers.Contract(networkId == 4 ? USD_ADDRESS : BSC_USD_ADDRESS, ERC20_ABI, signer);
      const allowance = await usdContract.allowance(address, UXDT_ADDRESS);
      setAllowance(bnToNum(allowance));
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to Allowance`));
    }
  };
  // buy
  const buyAction = async () => {
    setLoading(true);
    try {
      const usdContract = new ethers.Contract(networkId == 4 ? USD_ADDRESS : BSC_USD_ADDRESS, ERC20_ABI, signer);
      if (allowance === 0) {
        const tx = await usdContract.approve(UXDT_ADDRESS, maxInt.c?.join(""));
        const txCB = await tx.wait();
        // console.log(txCB, "tx");
        if (txCB.status) {
          const uxdtContract = new ethers.Contract(UXDT_ADDRESS, DigitalCurrency_ABI, signer);
          const submitValue = formatUxdt(Number(buyValue));
          console.log(submitValue, "submitValue");
          const tx = await uxdtContract.Buy(submitValue);
          const tx2cb = await tx.wait();
          if (tx2cb.status) {
            setTimeout(() => window.location.reload(), 1);
          }
          // console.log(tx, "[]===");
        }
      } else {
        const uxdtContract = new ethers.Contract(UXDT_ADDRESS, DigitalCurrency_ABI, signer);
        const submitValue = formatUxdt(Number(buyValue));
        // console.log(submitValue, "submitValue");
        const tx = await uxdtContract.Buy(submitValue);
        const tx2cb = await tx.wait();
        if (tx2cb.status) {
          setTimeout(() => window.location.reload(), 1);
        }
      }
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to buy`));
    }
  };
  // sell
  const sellAction = async () => {
    setLoading(true);
    try {
      const uxdtContract = new ethers.Contract(UXDT_ADDRESS, DigitalCurrency_ABI, signer);
      // const submitValue = new BN(sellValue).multipliedBy(new BN(10).pow(18)).toString();
      const submitValue = formatUxdt(Number(sellValue));
      const tx = await uxdtContract.Sell(submitValue);
      const txcb = await tx.wait();
      if (txcb.status) {
        setTimeout(() => window.location.reload(), 1);
      }
      // console.log(tx, "[]===");
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to sell`));
    }
  };
  // buyMax
  const buyMax = async () => {
    setLoading(true);
    try {
      const usdtContract = new ethers.Contract(
        networkId == 4 ? USD_ADDRESS : BSC_USD_ADDRESS,
        DigitalCurrency_ABI,
        signer,
      );
      const tx = await usdtContract.balanceOf(address);
      // console.log(tx);
      const balanceVal = bnToNum(tx);
      const val = new BN(balanceVal).div(new BN(10).pow(18)).toFixed(8).toString();
      setBuyValue(val);
      // console.log(tx, "tx", val);
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to getBalances`));
    }
  };
  // sellMax
  const sellMax = () => {
    setSellValue(balance);
  };
  useEffect(() => {
    console.log(isTronWeb, "isTronWeb");
    if (provider && address) {
      getLunchTime();
      getBalances();
      toAllowance();
    }
  }, [connected]);

  useEffect(() => {
    if (isTronWeb.connected) {
      getLunchTime();
      getBalances();
    }
  }, [isTronWeb.connected]);

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
              <div className="left">
                {connected
                  ? address.slice(0, 7) + "..." + address.slice(-4)
                  : isTronWeb.connected
                  ? userAddress.slice(0, 7) + "..." + userAddress.slice(-4)
                  : "0x0...000"}
              </div>
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
                  <Input
                    placeholder="Amount"
                    type="number"
                    id="component-simple"
                    value={buyValue}
                    onChange={handleChangeBuyValue}
                  />
                </FormControl>
                <button onClick={buyMax} disabled={!connected}>
                  Max
                </button>
              </div>
              <button className="action_box" disabled={!connected} onClick={buyAction}>
                {allowance == 0 ? "Approve" : "Buy"}
              </button>
            </div>
            <div className="buy_box sell_box">
              <div className="left_input">
                <FormControl variant="standard" className="input_box add_margin">
                  <Input
                    placeholder="Amount"
                    id="component-simple"
                    type="number"
                    value={sellValue}
                    onChange={handleChangeSellValue}
                  />
                </FormControl>
                <button onClick={sellMax} disabled={!connected}>
                  Max
                </button>
              </div>
              <button className="action_box" disabled={!connected} onClick={sellAction}>
                Sell
              </button>
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
