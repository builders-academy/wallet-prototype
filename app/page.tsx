"use client";
import AddressDisplay from "@/components/Address/AddressDisplay";
import {
  Address,
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";
import useLocalStorage from "@/hooks/useLocalStorage";

const Home = () => {
  const network = BitcoinNetworkType.Mainnet;
  const [addressInfo, setAddressInfo] = useLocalStorage<Address[]>(
    "addresses",
    []
  );

  const isConnected = addressInfo.length > 0;

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

  if (!isConnected) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Connected to {network}</p>
          <p>Click the button to connect your wallet</p>
          <button onClick={onConnect}>Connect</button>
        </header>
      </div>
    );
  }
  return (
    <div className="App">
      <div className="App-body">
        <AddressDisplay
          network={network}
          addresses={addressInfo}
          onDisconnect={onDisconnect}
        />
      </div>
    </div>
  );
};

export default Home;
