import React from "react";
import { Address, BitcoinNetworkType } from "sats-connect";

type Props = {
  network: BitcoinNetworkType;
  addresses: Address[];
  onDisconnect: () => void;
};

const AddressDisplay = ({ network, addresses, onDisconnect }: Props) => {
  return (
    <div>
      <p>{network}</p>
      {addresses.length > 0 ? (
        addresses.map((address, index) => (
          <div key={address.publicKey}>
            <p>{address.address}</p>
            <button onClick={onDisconnect}>Disconnect</button>
          </div>
        ))
      ) : (
        <p>Connect your wallet first</p>
      )}
    </div>
  );
};

export default AddressDisplay;
