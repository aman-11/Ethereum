import React, { useState } from "react";
import TypeWriter from "react-typewriter";
import { ethers } from "ethers";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@badrap/bar-of-progress";

//import  abi
import abi from "../utils/WavePortal.json";

function HandleWave() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { accId: account } = useParams();

  const progress = new ProgressBar({
    size: 3,
    color: "#FE595E",
    className: "z-50",
    delay: 1200,
  });

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        setLoading(true);
        progress.start();
        const provider = new ethers.providers.Web3Provider(ethereum); //provider helps you to talk to ethereum node

        const signer = provider.getSigner(); //we person are as signer and our metamask account represent us
        const contractAddress = "0x8145D6a7384a0108dfB7dAB61e1229fE848a8754";
        const contractABI = abi.abi;
        //now we need contract to communicate --> params --> (contractAddress, contractABI, signer)
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // !!reading data from blockchain
        //now we got contract
        // let count = await wavePortalContract.getTotalWaves(); //our contratc function
        // console.log("Retrieved total wave count...", count.toNumber());

        // !!writing data to blockchain with some message
        const waveTxn = await wavePortalContract.wave(message, {
          gasLimit: 300000,
        }); //!! for now hard coded
        // console.log("Mining Object", waveTxn);
        // console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        // console.log("Mined -- ", waveTxn.hash);

        setMessage("");
        progress.finish();
        setLoading(false);
      } else {
        console.error("Ethereum object doesn't exist!");
      }
    } catch (error) {
      progress.finish();
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className=" flex flex-col py-12 px-12 pr-6">
        <h1 className="text-5xl mb-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
          I am<TypeWriter typing={0.5}> Aayush Aman </TypeWriter>
        </h1>
        <p className="text-lg">
          I am a Developer and so that's pretty cool right? Connect your
          Ethereum wallet and wave at me!
        </p>
        <div className="flex flex-col">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                  focus:ring-red-500 focus:border-red-500 block w-full focus:outline-none p-2.5 mt-6"
            placeholder="Drop you Spotify links..."
            required
          />
          <button
            onClick={wave}
            disabled={loading || !message.trim()}
            type="button"
            className="rounded-md p-2 pl-4 pr-4  mt-6 hover:text-white hover:scale-105 transition ease-out duration-200 
            bg-gradient-to-r cursor-pointer from-pink-500 to-yellow-500  text-base font-medium text-white focus:outline-none
             sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed
            hover:disabled:bg-gray-300 hover:disabled:scale-100 "
            // className="bg-gradient-to-r cursor-pointer from-pink-500 to-yellow-500 rounded-md p-2 pl-4 pr-4  mt-6 hover:text-white hover:scale-105 transition ease-out duration-150 hover:mr-2"
          >
            <span className="text-xl font-bold">
              {" "}
              {loading ? "Processing..." : " Wave 👋"}{" "}
            </span>
          </button>
          <p
            onClick={() => navigate("/")}
            className="not-allowed text-md underline cursor-pointer self-center mt-2 hover:scale-95 duration-100 ease-in"
          >
            Connect different wallet ?
          </p>
        </div>
      </div>
    </div>
  );
}

export default HandleWave;
