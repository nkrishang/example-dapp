import * as React from "react";
import dotenv from 'dotenv';

import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import ConnectButton from "./components/ConnectButton";
import { Spinner } from "./components/Spinner";

import { numberContract } from "./utils/contract";

dotenv.config()

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContractComponent />
    </Web3ReactProvider>
  );
}

function ContractComponent() {

  const context = useWeb3React()
  const { library, account, active } = context;

  const [currentNum, setCurrentNum] = React.useState(0)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {

    async function getCurrentNumber() {
      const currentNumber = await numberContract.mainNumber()
      setCurrentNum(
        parseInt(currentNumber.toString())
      )
    }

    getCurrentNumber()
  }, [])

  React.useEffect(() => {

    numberContract.on("NumberChanged", (caller, newNumber) => {
      const parsedNumber = parseInt(newNumber.toString())
      setCurrentNum(parsedNumber);
    })

  }, [])

  async function incrementNumber() {
    if(library && account) {
      setLoading(true);

      try {

        const tx = await numberContract.connect(library.getSigner(account)).incrementNumber()
        window.alert(`You can view your transaction at https://rinkeby.etherscan.io/tx/${tx.hash}`)

        await tx.wait()

      } catch(err) {
        window.alert(JSON.stringify(err))
      }

      setLoading(false)
    }
  }

  const incrementButtonDisabled = !active || !account
  
  return (
    <div className="w-1/3 m-auto flex justify-center my-4">
      <div className="flex flex-col">

        <ConnectButton />

        <p className="my-4">{`Current number: ${currentNum}`}</p>

        <button
          disabled={incrementButtonDisabled}
          className={`p-2 border ${incrementButtonDisabled ? "border-gray-300 text-gray-300" : "border-black"}`}
          onClick={incrementNumber}
        >
          {loading && (
            <div className="m-auto flex justify-center">
              <Spinner
                color={"black"}
                style={{ height: "25%", marginLeft: "-1rem" }}
              />
            </div>
          )}

          {!loading && (
            <p>
              increment number
            </p>
          )}
        </button>
      </div>
    </div>
  );
}
