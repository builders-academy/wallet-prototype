"use client";
import { useEffect, useState } from "react";
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

// Define the type for balance data
interface BalanceData {
  balance: string;
  locked: string;
  unlock_height: number;
  nonce: number;
  balance_proof: string;
  nonce_proof: string;
}

const Home: React.FC = () => {
  const network = BitcoinNetworkType.Mainnet;
  const [addressInfo, setAddressInfo] = useLocalStorage<Address[]>(
    "addresses",
    []
  );
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);

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
        alert("User cancelled the request");
      },
    });
  };

  const onDisconnect = () => {
    setAddressInfo([]);
    setBalanceData(null);
  };

  const stackAddressInfo = addressInfo.find(
    (address) => address.purpose === AddressPurpose.Stacks
  );

  const stackAddress = stackAddressInfo?.address;
  // console.log(stackAddress);

  const getBalance = async () => {
    if (!stackAddress) {
      console.error("Stack address is not defined");
      return;
    }

    try {
      const res = await fetch(
        `https://api.mainnet.hiro.so/v2/accounts/${stackAddress}`
      );
      const data: BalanceData = await res.json();
      // console.log(data);
      setBalanceData(data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    if (stackAddress) {
      getBalance();
    }
  }, [stackAddress]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>Connected to {network}</CardHeader>
        <CardContent>
          <CardContent>Click the button to connect your wallet</CardContent>
        </CardContent>
        <CardFooter>
          <Button onClick={onConnect}>Connect</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="App flex justify-center items-center gap-4">
      <AddressDisplay
        network={network}
        addresses={addressInfo}
        onDisconnect={onDisconnect}
      />

      {balanceData && (
        <Card>
          <CardHeader>Balance Information</CardHeader>
          <CardContent>Balance: {balanceData.balance}</CardContent>
          <CardContent>Locked: {balanceData.locked}</CardContent>
          <CardContent>Unlock Height: {balanceData.unlock_height}</CardContent>
          <CardContent>Nonce: {balanceData.nonce}</CardContent>
          <CardContent>Balance Proof: {balanceData.balance_proof}</CardContent>
          <CardContent>Nonce Proof: {balanceData.nonce_proof}</CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;
