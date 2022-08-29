import ethUrl from "../../../assets/images/ETH.png";
import bscUrl from "../../../assets/images/BSC.png";
import trxUrl from "../../../assets/images/TRX.png";
import { useWeb3Context } from "src/hooks/web3Context";
import useTronWeb from "src/hooks/useTronWeb";
import { setChainId } from "src/constants/network";
import { useState } from "react";
function WalletChose() {
  const { connect, connected, address, disconnect } = useWeb3Context();
  const { getConnect, userAddress, isTronWeb, event } = useTronWeb();
  const [showStatus, setStatus] = useState(false);
  const [choedChain, setChoedChain] = useState(bscUrl);
  const walletList = [
    { name: "BSC", imgUrl: bscUrl, chainId: 56 },
    { name: "ETH", imgUrl: ethUrl, chainId: 1 },
    { name: "TRX", imgUrl: trxUrl, chainId: 3 },
  ];
  const collectWallet = (item: any) => {
    console.log(item);
    setChoedChain(item.imgUrl);
    setChainId(item.chainId);
  };
  const setListStatus = () => {
    setStatus(!showStatus);
  };
  return (
    <div className={showStatus ? "show_others chose_box" : "chose_box"} onClick={setListStatus}>
      <ul>
        <li>
          <img src={choedChain} alt="" />
        </li>
        {walletList &&
          walletList.map((item, index) => {
            return (
              <li key={index} onClick={() => collectWallet(item)}>
                <img src={item.imgUrl} />
              </li>
            );
          })}
      </ul>
    </div>
  );
}
export default WalletChose;
