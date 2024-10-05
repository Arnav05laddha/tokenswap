import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import A from './contractabi.json'; // The ABI you created
import './App.css';
import tokenList from "./list.json";

// Use the actual deployed contract address
const contractAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const contractABI = A.abi;



function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [amountIn, setAmountIn] = useState('');  // Correct state for input field
  const [amountOut, setAmountOut] = useState(''); // Correct state for input field
  const [isConnected, setIsConnected] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null); // Track selected token

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const swapContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(swapContract);
      }
    }
    loadWeb3();
  }, []);

  const handleTokenChange = (event) => {
    const token = tokenList.find(t => t.ticker === event.target.value);
    setSelectedToken(token);
  };

  // Prevent form submission from refreshing the page
  const handleInputChange = (e) => {
    e.preventDefault(); // Prevent the form submission default behavior
    setAmountIn(e.target.value);
  };

  const handleOutputChange = (e) => {
    e.preventDefault(); // Prevent the form submission default behavior
    setAmountOut(e.target.value);
  };

  const handleSwap = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!selectedToken) {
      alert("Please select a token");
      return;
    }
    console.log("Selected token for swap:", selectedToken);
    // Add your contract interaction here using selectedToken.address
  };

  const swapExactInputSingle = async () => {
    if (contract) {
      try {
        await contract.methods
          alert()
          .swapExactInputSingle(web3.utils.toWei(amountIn.target.value, 'ether'))
          .send({ from: account });
        alert('Swap completed!');
      } catch (error) {
        console.error('Error in swapExactInputSingle:', error);
      }
    }
  };

  const swapExactOutputSingle = async () => {
    if (contract) {
      try {
        await contract.methods
          .swapExactOutputSingle(
            web3.utils.toWei(amountOut, 'ether'),
            web3.utils.toWei(amountIn, 'ether')
          )
          .send({ from: account });
        alert('Swap completed!');
      } catch (error) {
        console.error('Error in swapExactOutputSingle:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Token Swap</h1>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <p>Account: {account}</p>
          <button onClick={() => setAccount(null)}>Disconnect</button>
        </div>
      )}

      <div>
        <h2>Swap Exact Input Single</h2>
        <form onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission */}
          <input
            type="text"
            placeholder="Amount in (SETH)"
            value={amountIn}
            onChange={handleInputChange}
          />
          <button type="button" onClick={swapExactInputSingle}>Swap</button>
        </form>
      </div>

      <div>
        <h2>Select a Token to Swap</h2>
        <select onChange={handleTokenChange} defaultValue="">
          <option value="" disabled>Select Token</option>
          {tokenList.map((token, index) => (
            <option key={index} value={token.ticker}>
              {token.name} ({token.ticker})
            </option>
          ))}
        </select>
        <button onClick={handleSwap}>Swap</button>

        {selectedToken && (
          <div>
            <h3>Selected Token Details</h3>
            <p>Name: {selectedToken.name}</p>
            <p>Ticker: {selectedToken.ticker}</p>
            <p>Address: {selectedToken.address}</p>
          </div>
        )}
      </div>

      <div>
        <h2>Swap Exact Output Single</h2>
        <form onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission */}
          <input
            type="text"
            placeholder="Amount out (USDC)"
            value={amountOut}
            onChange={handleOutputChange}
          />
          <button type="button" onClick={swapExactOutputSingle}>Swap</button>
        </form>
      </div>
    </div>
  );
}

export default App;
