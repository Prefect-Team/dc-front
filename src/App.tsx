// eslint-disable-next-line simple-import-sort/imports
import "./style.scss";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import useBonds from "./hooks/useBonds";
import { useWeb3Context } from "./hooks";
import { shouldTriggerSafetyCheck } from "./helpers";

import { calcBondDetails } from "./slices/BondSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { error, info } from "./slices/MessagesSlice";

import NotFound from "./views/404/NotFound";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { getAllBonds } from "./slices/BondSliceV2";
import { NetworkId } from "./constants";
import { trackGAEvent } from "./helpers/analytics";
import { getAllInverseBonds } from "./slices/InverseBondSlice";
import { Home } from "./views/Home";
import HomeLayout from "./components/HomeLayout";
import { Wrap } from "./views";

const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL

function App() {
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const { address, connect, connectionError, hasCachedProvider, provider, connected, networkId, providerInitialized } =
    useWeb3Context();

  const [walletChecked, setWalletChecked] = useState(false);

  // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
  const { bonds } = useBonds(networkId);

  async function loadDetails(whichDetails: string) {
    const loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: networkId, provider: loadProvider }));
      if (
        networkId === NetworkId.MAINNET ||
        networkId === NetworkId.TESTNET_RINKEBY ||
        networkId === NetworkId.BSC_TESTNET
      ) {
        bonds.map(bond => {
          // NOTE (appleseed): getBondability & getLOLability control which bonds are active in the view for Bonds V1
          // ... getClaimability is the analogue for claiming bonds
          if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
            dispatch(calcBondDetails({ bond, value: "", provider: loadProvider, networkID: networkId }));
          }
        });
        dispatch(getAllBonds({ provider: loadProvider, networkID: networkId, address }));
        dispatch(getAllInverseBonds({ provider: loadProvider, networkID: networkId, address }));
      }
    },
    [networkId, address],
  );

  const loadAccount = useCallback(
    loadProvider => {
      if (!providerInitialized) {
        return;
      }
    },
    [networkId, address, providerInitialized],
  );

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
        trackGAEvent({
          category: "App",
          action: "connect",
        });
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on DC!"));
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      if (networkId !== -1) {
        loadDetails("account");
        loadDetails("app");
      }
    }
  }, [walletChecked, networkId]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected && providerInitialized) {
      loadDetails("account");
    }
  }, [connected, networkId, providerInitialized]);

  useEffect(() => {
    if (connectionError) dispatch(error(connectionError.text));
  }, [connectionError]);

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <Switch>
      <Route>
        <HomeLayout>
          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route exact strict path="/home" component={Home}></Route>
            <Route path="/error">
              <Wrap />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </HomeLayout>
      </Route>
    </Switch>
  );
}

export default App;
