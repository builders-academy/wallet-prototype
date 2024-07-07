"use client";
import React, { useEffect, useState } from "react";
import { getAgentExecutor } from "@/agents/analyst";
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
  const [scrapingResult, setScrapingResult] = useState<string | null>(null);
  // const [userInput, setUserInput] = useState<string>("");
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

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

  const handleAgentInvocation = async () => {
    try {
      const agentExecutor = await getAgentExecutor();
      const response = await agentExecutor.invoke({
        input: `Fetch the most beneficial swap options based on the current balance. The balance is: 40 stx. Please do not provide detailed information on available swap options, just provide the best one including the potential benefits and any associated fees or risks. The data should be specific to the current balance and pool token stats and should help in making an informed decision for the best swap option.
`,
      });
      setAgentResponse(response.output); // assuming response has a property 'output'
    } catch (error) {
      console.error("Error invoking agent:", error);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleAgentInvocation();
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>Connected to {network}</CardHeader>
        <CardContent>Click the button to connect your wallet</CardContent>
        <CardFooter>
          <Button onClick={onConnect}>Connect</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="App flex justify-center items-center gap-4 flex-col">
      {balanceData && (
        <Card>
          <CardHeader>Balance Information</CardHeader>
          <CardContent> Stx-Balance: {balanceData.balance}</CardContent>
          <Button onClick={onDisconnect} variant="destructive">
            Disconnect
          </Button>
        </Card>
      )}

      {scrapingResult && (
        <Card>
          <CardHeader>Scraping Result</CardHeader>
          <CardContent>{scrapingResult}</CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        {/* <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your input"
        /> */}
        <Button type="submit">Analyze my Stacks</Button>
      </form>

      {agentResponse && (
        <Card>
          <CardHeader>Agent Response</CardHeader>
          <CardContent>{agentResponse}</CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;
