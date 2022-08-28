import metamask from "../../../assets/images/meta.svg";
import scan from "../../../assets/images/scan.svg";
import BianceWalletLogo from "../../../assets/images/binance-wallet.png";
import Tron from "../../../assets/images/tronlink.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import useTronWeb from "src/hooks/useTronWeb";
function Walletconnect() {
  const { connect, connected, address, disconnect } = useWeb3Context();
  const { getConnect, userAddress, isTronWeb, event } = useTronWeb();
  const walletList = [
    { name: "MetaMask", imgUrl: metamask,content:"Connect to your MetaMask Wallet" },
    { name: "WalletConnect", imgUrl: scan,content:"Scan with WalletConnect to connect" },
    { name: "Binance Chain Wallet", imgUrl: BianceWalletLogo,content:"Connect to your Binance Chain Wallet" },
    { name: "UXDT Chain Wallet", imgUrl: Tron,content:"Connect to your Uxdt Chain Wallet" },
  ];
  const collectWallet = (item: any) => {
    console.log(item);
  };
  return (
    <div className="wallet_chose_box">
      <ul>
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
