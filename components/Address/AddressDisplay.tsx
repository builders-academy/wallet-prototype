import React from "react";
import { Address, BitcoinNetworkType } from "sats-connect";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  network: BitcoinNetworkType;
  addresses: Address[];
  onDisconnect: () => void;
};

const AddressDisplay = ({ network, addresses, onDisconnect }: Props) => {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Card>
        <CardHeader>Connected to {network}</CardHeader>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.publicKey}>
              <CardContent className="font-bold m-2">
                {address.purpose?.toUpperCase() + " ADDRESS"}
                <Button variant="ghost">{address.address}</Button>
              </CardContent>
              <CardContent className="font-bold m-2">
                {address.purpose?.toUpperCase() + " PUBLICKEY"}
                <Button variant="ghost">{address.publicKey}</Button>
              </CardContent>
            </div>
          ))
        ) : (
          <p>Connect your wallet first</p>
        )}
        <CardFooter>
          <Button onClick={onDisconnect} variant="destructive">
            Disconnect
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddressDisplay;
