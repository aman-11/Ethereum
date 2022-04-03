import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { accountConnected } from "../atom/accountAtom";

function Home() {
  const navigate = useNavigate();
  const [account, setAccount] = useRecoilState(accountConnected);

  const ifConnectedToWallet = async () => {
    const { ethereum } = window;
    // console.log("eth", ethereum);

    if (!ethereum) {
      console.log("Please install Metamask");
      return;
    }

    //now means i have metamask so find the  authorized account
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      // console.log("acc", account);

      setAccount(account);
    } else {
      console.log("no auth acc");
    }
  };

  useEffect(() => {
    ifConnectedToWallet();
  }, []);

  const connectWallet = async () => {
    if (account) navigate("/wave");

    const { ethereum } = window;

    if (!ethereum) {
      alert("Get a metmask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    //popup metamask appears
    //select acc and authorize it
    setAccount(accounts[0]);
    // console.log("acc set -->", accounts[0]);

    navigate(`/wave/${accounts[0]}`);
  };

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="flex-grow" />
        <p className="text-6xl tracking-normal self-center">
          👋
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Wave Portal
          </span>
        </p>
        <div className="flex-grow flex-col flex">
          <p className="font-semibold text-white text-2xl mt-8 md:text-4xl">
            Send me a wave through the metaverse{" "}
            <span className="animate-pulse">✨</span>
          </p>
          <button
            onClick={connectWallet}
            type="button"
            className="bg-gradient-to-r cursor-pointer from-pink-500 to-yellow-500 rounded-md p-2 pl-4 pr-4 self-center mt-6 hover:text-white hover:scale-110 transition ease-out duration-150"
          >
            <span className="text-xl font-bold"> Let's Go </span>
          </button>
        </div>
        <p className="font-semibold text-4xl text-white mb-8">
          Build with <span className="text-purple-400">Buildspace</span> 🦄
        </p>
      </div>
    </div>
  );
}

export default Home;
