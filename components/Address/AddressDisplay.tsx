import React from "react";
import { Address, BitcoinNetworkType } from "sats-connect";

type Props = {
  network: BitcoinNetworkType;
  addresses: Address[];
  onDisconnect: () => void;
};

const AddressDisplay = ({ network, addresses, onDisconnect }: Props) => {
  return (
    <div className="card">
      <span>
        Connected Network - {network ? network : "Connect Your wallet first"}
      </span>

      {addresses.map((address) => (
        <ul key={address.publicKey}>
          <li>{address.purpose}</li>
          <li>{address.address}</li>
          <li>{address.publicKey}</li>
        </ul>
      ))}
      <br />
      <button onClick={onDisconnect}>Disconect</button>
    </div>
  );
};

export default AddressDisplay;
