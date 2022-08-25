/**
 * Simple customized react hook for retreiving Tronweb injection and handle Tronlink events.
 * Created by Saverio F. Colla
 */

import { useState, useEffect } from "react";

function getTronWebState() {
  //console.log("LoggedIn:",window.tronWeb.defaultAddress.base58)
  return {
    installed: !!window.tronWeb,
    //loggedIn: !!window.tronWeb.defaultAddress.base58,
    connected: window.tronLink?.ready,
    host: window.tronWeb?.eventServer?.host,
  };
}
async function getTronWeb() {
  return await new Promise(resolve => {
    var obj = setInterval(() => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(obj);
        console.log("TronWeb catch! address: ", window.tronWeb.defaultAddress.base58);
        console.log("HOST", window.tronWeb.fullNode.host);
        resolve(window.tronWeb.defaultAddress.base58);
      }
    }, 10);
  });
}
async function requestAccount() {
  const { tronLink } = window;
  const res = await tronLink.request({ method: "tron_requestAccounts" });
  return res;
}

export default function useTronWeb() {
  const [userAddress, setUserAddress] = useState("");
  const [isTronWeb, setTronWeb] = useState(getTronWebState());
  const [event, setEvent] = useState({
    type: "",
    data: null,
    msg: "",
  });

  /* TronLink injection */
  useEffect(() => {
    if (window.tronLink) {
      handleTronLink();
    } else {
      window.addEventListener("tronLink#initialized", handleTronLink, {
        once: true,
      });
      // If the is not dispatched by the end of the timeout,
      // the user probably doesn't have tronlink installed
      setTimeout(handleTronLink, 3000);
    }

    return () => window.removeEventListener("tronLink#initialized", handleTronLink);
  }, []);

  /* Tronweb events */
  useEffect(() => {
    function handleMessage(e) {
      if (e.data.message && e.data.message.action === "tabReply") {
        //console.log("tabReply event", e.data.message)
        handleTabReply(e.data.message.data.data, e.data.message.data.success, e.data.message.data.uuid);
      }

      if (e.data.message && e.data.message.action === "setAccount") {
        //console.log("setAccount event", e.data.message)
        handleAccountChanged(e.data.message.data);
      }

      // Network node: Main, Shasta, ecc.
      if (e.data.message && e.data.message.action === "setNode") {
        //console.log("setNode event", e.data.message)
        handleNodeChanged(e.data.message.data.node);
      }

      // Wallet account connection
      if (e.data.message && e.data.message.action === "connect") {
        // console.log("connection", e.data.message)
        // console.log("tronWeb", window.tronWeb)
        // console.log("tronLink", window.tronLink)
        setTronWeb(() => getTronWebState());
        handleConnection(e.data);
      }

      // Wallet account dis-connection
      if (e.data.message && e.data.message.action === "disconnect") {
        console.log("disconnection", e);
        // console.log("tronWeb", window.tronWeb)
        // console.log("tronLink", window.tronLink)
        setTronWeb(() => getTronWebState());
        handleConnection(e.data);
      }
    }

    window.addEventListener("message", e => handleMessage(e));

    return () => window.removeEventListener("message", e => handleMessage(e));
  }, []);

  /* Account injection */
  useEffect(() => {
    getConnect();
  }, []);
  function getConnect() {
    getTronWeb().then(address => {
      setUserAddress(address);
      setTronWeb(() => getTronWebState());
      requestAccount().then(res => {
        console.log("Request Account:", res.code === 200 ? "Account injection OK!" : res.message);
      });
    });
  }
  /* Handle functions */
  function handleTronLink() {
    const { tronLink } = window;
    if (tronLink) {
      console.log("TronLink detected!");
      console.log("TronWeb obj:", window.tronWeb);
      console.log("TronLink obj:", window.tronLink);
      console.log("TronWeb present:", !!window.tronWeb);
      setTronWeb(() => getTronWebState());
    } else {
      console.log("Install tronlink extension");
    }
  }
  function handleAccountChanged(data) {
    /* Called when account address changes */
    setUserAddress(data.address);

    setTronWeb(() => getTronWebState());
    setEvent({
      type: "setAccount",
      data: data,
      msg: "current address:" + data.address,
    });
  }
  function handleNodeChanged(newNode) {
    /* Called when network node changes */
    var chain_msg = "";
    if (newNode.chain === "_") {
      chain_msg = "tronLink currently selects the main chain";
    } else {
      chain_msg = "tronLink currently selects the side chain";
    }
    setTronWeb(() => getTronWebState());
    setEvent({
      type: "setNode",
      data: newNode,
      msg: chain_msg,
    });
  }
  function handleTabReply(data, success, uuid) {
    if (success) {
      setTronWeb(() => getTronWebState());
      setEvent({
        type: "tabReply",
        data: data,
        msg: uuid,
      });
    }
  }
  function handleConnection(data) {
    setEvent({
      type: data.message.action,
      data: data,
      msg: data.message,
    });
  }
  // const handleDisConnect = useCallback(async () => {
  //   window.tronWeb.handleConnection
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1);
  //   setUserAddress("");
  // }, [userAddress]);
  function handleDisConnect() {
    setTronWeb({
      installed: false,
      connected: false,
      host: "",
    });

    setUserAddress("");
  }
  return { isTronWeb, userAddress, event, getConnect, handleDisConnect };
}
