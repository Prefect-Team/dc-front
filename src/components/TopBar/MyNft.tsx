import { Button } from "@material-ui/core";
import "./TopBar.scss";
import { t } from "@lingui/macro";
import { useState, useEffect } from "react";
import { Nft_ADDRESS, Nft_ABI, Referral_ADDRESS, Referral_ABI } from "src/contract";
import { useWeb3Context } from "src/hooks/web3Context";
import { CUR_NETWORK_ID } from "src/constants/network";
import { error } from "../../slices/MessagesSlice";
// import {updateInfo} from "../../slices/UserInfo"
import { useDispatch, useSelector } from "react-redux";
import { bnToNum } from "src/helpers";
import { ethers } from "ethers";
interface listObj {
  id: string;
  level: string;
}
function MyNft() {
  const [nftBlance, setNftBalance] = useState<number>(0);
  const [isShowNft, setShowNft] = useState(false);
  const state: any = useSelector(state => state);
  // if (state.userinfo) {
  //   console.log(state.userinfo);
  // }
  // console.log(state.userinfo.isUpdate, "====");
  const [loading, setLoading] = useState(false);
  const { connected, provider, address, connect, networkId } = useWeb3Context();
  const signer = provider.getSigner();
  const [list, setList] = useState<Array<listObj>>([]);
  const dispatch = useDispatch();
  const showNft = async () => {
    if (!connected) {
      connect();
    } else {
      setShowNft(!isShowNft);
      // try {
      //   const getBalanceInfo = new ethers.Contract(Nft_ADDRESS, Nft_ABI, signer);
      //   const nftLevelInfo = new ethers.Contract(Referral_ADDRESS, Referral_ABI, signer);
      //   const list: any = [];
      //   for (let i = 0; i < nftBlance; i++) {
      //     const txTwo = await getBalanceInfo.tokenOfOwnerByIndex(address, i);
      //     const id: number = bnToNum(txTwo);
      //     const levelTx = await nftLevelInfo.fetchNFTLevel(id);
      //     const levelTxNum = bnToNum(levelTx);
      //     list.push({ id: id, level: levelTxNum });
      //   }
      //   console.log(list, "liost");
      //   setList(list);
      //   setLoading(false);
      // } catch (err) {
      //   console.log({ err });
      //   setLoading(false);
      //   dispatch(error(t`Fail to getBalanceInfo`));
      // }
    }
  };
  const fetchBalanceOf = async () => {
    setLoading(true);
    try {
      const getBalanceInfo = new ethers.Contract(Nft_ADDRESS, Nft_ABI, signer);
      const nftLevelInfo = new ethers.Contract(Referral_ADDRESS, Referral_ABI, signer);
      const tx = await getBalanceInfo.balanceOf(address);
      const banlance = bnToNum(tx);
      setNftBalance(banlance);
      // console.log(banlance, "balance");
      const list: any = [];
      for (let i = 0; i < banlance; i++) {
        const txTwo = await getBalanceInfo.tokenOfOwnerByIndex(address, i);
        const id = bnToNum(txTwo);
        const levelTx = await nftLevelInfo.fetchNFTLevel(id);
        const levelTxNum = bnToNum(levelTx);
        list.push({ id: id, level: levelTxNum });
      }
      // console.log(list, "liost");
      setList(list);

      setLoading(false);
      // dispatch(info(t`Success to getBalanceInfo`));
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(error(t`Fail to getBalanceInfo`));
    }
  };
  useEffect(() => {
    if (provider && networkId === CUR_NETWORK_ID && address) {
      // 执行合约操作
      fetchBalanceOf();
    }
  }, [connected, state]);
  return (
    <div className="nft_container">
      <Button className="wallet_btn nft_btn" onClick={showNft}>
        {t`My Nft:`}
        {` `}
        {nftBlance || 0}
      </Button>

      <div className={isShowNft ? "nft_content open_nft" : "nft_content"}>
        <ul>
          {list &&
            list.map((item, index) => {
              return (
                <li key={index}>
                  <div className={"img_box img_box" + item.level}></div>
                  <p>
                    NTF Grade：<span>{item.level}</span>
                  </p>
                  <p>
                    NTF id：<span>{item.id}</span>
                  </p>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default MyNft;
