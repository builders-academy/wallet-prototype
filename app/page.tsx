"use client";
import AddressDisplay from "@/components/Address/AddressDisplay";
import {
  Address,
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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
      <>
        <Card>
          <CardHeader>Connected to {network}</CardHeader>
          <CardContent>
            <p>Click the button to connect your wallet</p>
          </CardContent>
          <CardFooter>
            <Button onClick={onConnect}>Connect</Button>
          </CardFooter>
        </Card>
      </>
    );
  }
  return (
    <div className="App">
      <AddressDisplay
        network={network}
        addresses={addressInfo}
        onDisconnect={onDisconnect}
      />
    </div>
  );
};

export default Home;
