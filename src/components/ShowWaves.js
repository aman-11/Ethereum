import React from "react";

function ShowWaves({ address, timestamp, message }) {
  return (
    <div className="flex flex-col mb-6 py-7 px-2 pr-4 border hover:opacity-80 hover:shadow-lg transition duration-200 ease-out first:border-t">
      <p className="font-medium text-xl">
        Account : <span className="!text-lg ">{address}</span>{" "}
      </p>
      <p className="text-xl pt-3 pb-3 mt-2 self-start">
        Link : <span className="cursor-pointer underline">{message}</span>
      </p>
      <p className="self-center border-t mt-4 text-md text-gray-400">{timestamp}</p>
    </div>
  );
}

export default ShowWaves;
