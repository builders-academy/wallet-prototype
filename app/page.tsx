"use client";
import React from "react";
import AddressDisplay from "@/components/Address/AddressDisplay";

import {
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
  type Address,
} from "sats-connect";
import useLocalStorage from "@/hooks/useLocalStorage";

const Home = () => {
  const network = BitcoinNetworkType.Mainnet;
  const [addressInfo, setAddressInfo] = useLocalStorage<Address[]>(
    "addresses",
    []
  );
  const onConnect = async () => {
    getAddress({
      payload: {
        purposes: [
          AddressPurpose.Stacks,
          AddressPurpose.Payment,
          AddressPurpose.Ordinals,
        ],
        message: "Smart Wallet needs your address info.",
        network: {
          type: network,
        },
      },
      onFinish: (response) => {
        // console.log(response.addresses);
        setAddressInfo(response.addresses);
      },
      onCancel: () => {
        alert("user cancelled the request");
      },
    });
  };

  const onDisconnect = () => {
    setAddressInfo([]);
  };
  return (
    <div>
      <button onClick={onConnect}>Connect</button>

      <AddressDisplay
        network={network}
        addresses={addressInfo}
        onDisconnect={onDisconnect}
      />
    </div>
  );
};

export default Home;
