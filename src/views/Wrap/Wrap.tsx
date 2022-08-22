import "./Wrap.scss";

import { t } from "@lingui/macro";
import { Box, Typography, Zoom } from "@material-ui/core";
import { Paper } from "@olympusdao/component-library";
import { FC, useState } from "react";
import { useWeb3Context } from "src/hooks/web3Context";

import { useHistory } from "react-router-dom";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";

const Wrap: FC = () => {
  const { provider, address, connect, networkId } = useWeb3Context();
  const history = useHistory();
  usePathForNetwork({ pathName: "wrap", networkID: networkId, history });

  const [, setZoomed] = useState<boolean>(false);
  return (
    <div id="stake-view" className="wrapper">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper headerText={t`Network Error`}>
          <div className="staking-area">
            <div className={`stake-user-data`}>
              <Box width="100%" p={1} sx={{ textAlign: "center" }}>
                <Typography style={{ margin: "0 0 20px 0" }}>
                  {t`Please switch network to Binance Smart Chain Testnet!`}
                </Typography>
              </Box>
            </div>
          </div>
        </Paper>
      </Zoom>
    </div>
  );
};

export default Wrap;
