import { Link, useMediaQuery } from "@material-ui/core";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useEns } from "src/hooks/useENS";
import copy from "copy-to-clipboard";
import CopyIcon from "../../../assets/icons/Copy.png";
import { useDispatch } from "react-redux";
import { error, info } from "../../../slices/MessagesSlice";

export default function WalletAddressEns() {
  const { data: ens } = useEns();
  const { address } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const dispatch = useDispatch();
  const content = ens?.name || shorten(address);
  if (!address) return null;
  const goCopy = (text: string) => {
    if (copy(text)) {
      dispatch(info("Copied!"));
    } else {
      dispatch(error("Failed, please click to Copy!"));
    }
  };
  return (
    <div className="wallet-link">
      {ens?.avatar && <img className="avatar" src={ens.avatar} alt={address} />}

      <Link href={`https://testnet.bscscan.com/address/${address}`} target="_blank">
        {content}
      </Link>
      <div className="small-icon" onClick={() => goCopy(address)}>
        <img src={CopyIcon} alt="" />
      </div>
    </div>
  );
}
