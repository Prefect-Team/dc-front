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
    { name: "MetaMask", imgUrl: metamask, content: "Connect to your MetaMask Wallet", isWeb3: true },
    { name: "WalletConnect", imgUrl: scan, content: "Scan with WalletConnect to connect", isWeb3: true },
    {
      name: "Binance Chain Wallet",
      imgUrl: BianceWalletLogo,
      content: "Connect to your Binance Chain Wallet",
      isWeb3: true,
    },
    { name: "UXDT Chain Wallet", imgUrl: Tron, content: "Connect to your Uxdt Chain Wallet", isWeb3: false },
  ];
  const collectWallet = (item: any) => {
    if (item.isWeb3) {
      // console.log(item);
      connect();
    } else {
      getConnect();
    }
  };
  return (
    <div className="chose_box wallet_chose_box">
      <ul>
        {walletList &&
          walletList.map((item, index) => {
            return (
              <li key={index} onClick={() => collectWallet(item)}>
                <div className="top">
                  <img src={item.imgUrl} />
                  <p className="name">{item.name}</p>
                </div>
                <p className="conent_bottom">{item.content}</p>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
export default Walletconnect;
