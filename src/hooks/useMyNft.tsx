import { Nft_ADDRESS, Nft_ABI, Referral_ADDRESS, Referral_ABI } from "src/contract";
import { useWeb3Context } from "src/hooks/web3Context";
import { bnToNum } from "src/helpers";
import { ethers } from "ethers";
import { t } from "@lingui/macro";
import { error, info } from "../slices/MessagesSlice";
import { useDispatch } from "react-redux";

interface listObj {
  id: string;
  level: string;
}
export const useMyNft = async () => {
  const { provider, address } = useWeb3Context();
  const signer = provider.getSigner();
  const dispatch = useDispatch();
  try {
    const getBalanceInfo = new ethers.Contract(Nft_ADDRESS, Nft_ABI, signer);
    const nftLevelInfo = new ethers.Contract(Referral_ADDRESS, Referral_ABI, signer);
    const tx = await getBalanceInfo.balanceOf(address);
    const banlance = bnToNum(tx);
    console.log(banlance, "balance");
    const list: Array<listObj> = [];
    for (let i = 0; i < banlance; i++) {
      const txTwo = await getBalanceInfo.tokenOfOwnerByIndex(address, i);
      const id = bnToNum(txTwo).toString();
      const levelTx = await nftLevelInfo.fetchNFTLevel(id);
      const levelTxNum = bnToNum(levelTx).toString();
      list.push({ id: id, level: levelTxNum });
    }
    console.log(list, "liost");
    return list;
    // setLoading(false);
    dispatch(info(t`Success to getBalanceInfo`));
  } catch (err) {
    console.log({ err });
    // setLoading(false);
    dispatch(error(t`Fail to getBalanceInfo`));
  }
};
