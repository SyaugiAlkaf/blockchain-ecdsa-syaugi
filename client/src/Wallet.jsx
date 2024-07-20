import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useState } from "react";

function hexToUint8Array(hexString) {
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const arrayBuffer = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    arrayBuffer[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return arrayBuffer;
}

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onPrivateKeyChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    try {
      // Convert hex string to Uint8Array
      const privateKeyArray = hexToUint8Array(privateKey);
      const publicKey = secp256k1.getPublicKey(privateKeyArray);
      const address = toHex(publicKey);

      // Log the generated public key and address
      console.log("Public Key:", toHex(publicKey));
      console.log("Address:", address);

      setAddress(address);

      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error("Invalid private key:", error);
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={onPrivateKeyChange}
        ></input>
      </label>

      <label>
        Wallet Address
        <input
          placeholder="Generated address"
          value={address}
          readOnly
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
