import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import HandleWave from "./HandleWave";
import { LightningBoltIcon } from "@heroicons/react/solid";
import ShowWaves from "./ShowWaves";
import { ethers } from "ethers";

//import  abi
import abi from "../utils/WavePortal.json";

function Wave() {
  const { accId: account } = useParams();
  const [allWaves, setAllWaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllWavesData = async () => {
    if (!account) return;

    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractAddress = "0x8145D6a7384a0108dfB7dAB61e1229fE848a8754";
      const contractABI = abi.abi;

      //connect contract and access getwave functn
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const waves = await wavePortalContract.getAllWaves();
      //!!refer README file to see the return waves array
      //need address, timestamp, and message in our UI so cleanit
      let cleanedWaves = [];
      cleanedWaves = waves?.map((wave) => ({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message,
      }));

      setAllWaves(cleanedWaves);
    } catch (error) {
      console.error(error);
    }
  };

  // console.log("waves---", allWaves);

  useEffect(() => {
    getAllWavesData();

    //!! ----------------for events--------------
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
        ...prevState,
      ]);
    };

    //let listen to the event published by contract on each transaction
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      const contractAddress = "0x8145D6a7384a0108dfB7dAB61e1229fE848a8754";
      const contractABI = abi.abi;

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave); // take params --> eventName, method
    }

    //clean up callback after render
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-md md:px-10 p-4 flex justify-end">
        <LightningBoltIcon className="h-6 w-6 self-center " />
        <span className="font-semibold ml-2 bg-gradient-to-r rounded-full py-1 px-3 from-red-200 to-yellow-200 ">
          {account}
        </span>
      </header>

      <main className="grid grid-cols-3 ">
        <section className="col-span-1 bg-red-50">
          <HandleWave />
        </section>
        <section className="col-span-2 bg-gray-90">
          <div className="flex flex-col pt-14 px-6">
            {allWaves &&
              allWaves.map((wave, index) => (
                <ShowWaves
                  key={index}
                  address={wave.address}
                  timestamp={wave.timestamp.toString()}
                  message={wave.message}
                />
              ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Wave;
