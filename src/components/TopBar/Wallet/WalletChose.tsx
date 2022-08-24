import ethUrl from "../../../assets/images/ETH.png";
import bscUrl from "../../../assets/images/BSC.png";
import trxUrl from "../../../assets/images/TRX.png";
import { useWeb3Context } from "src/hooks/web3Context";
import useTronWeb from "src/hooks/useTronWeb";
function WalletChose() {
  const { connect, connected, address } = useWeb3Context();
  const { getConnect, userAddress, isTronWeb, event } = useTronWeb();
  const walletList = [
    { name: "BSC", imgUrl: bscUrl },
    { name: "ETH", imgUrl: ethUrl },
    { name: "TRX", imgUrl: trxUrl },
  ];
  const collectWallet = (item: any) => {
    console.log(item);
    if (item.name == "TRX") {
      getConnect();
    } else {
      connect();
    }
  };
  return (
    <div className="chose_box">
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
