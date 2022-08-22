import { useQuery } from "react-query";
import { NFTMiner_ADDRESS } from "src/contract";
import { useWeb3Context } from "./web3Context";
import { useHistory } from "react-router-dom";
import { Encrypt } from "src/helpers/aes";
import baseUrl from "src/helpers/baseUrl";
import { CUR_NETWORK_ID } from "src/constants/network";
export const useNftBalance = () => {
  const { address, networkId } = useWeb3Context();
  const history = useHistory();
  const KEY = history?.location?.key || "";
  const requestUrl = `${baseUrl}/system/open/api/nft/owner/detail`;
  const { data } = useQuery(`${KEY}-${address}`, async () => {
    try {
      const response = await fetch(requestUrl, {
        method: "post",
        body: JSON.stringify({
          sign: "",
          data: Encrypt({
            contract: NFTMiner_ADDRESS,
            address: address,
          }),
        }),
        headers: {
          "content-type": "application/json",
        },
      }).then(res => {
        return res.json();
      });
      if (!response) throw new Error("No response from BTCZ");
      return response?.data?.total || 0;
    } catch (err) {
      console.log(err);
    }
    return 0;
  });
  if (networkId === CUR_NETWORK_ID) {
    return [data];
  } else {
    return [0];
  }
};
