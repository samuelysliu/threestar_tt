import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/index';
import Dividend from './pages/dividend';
import { ConnectWallet } from './components/connectWallet';
import Web3 from 'web3'

function App() {
  const metaConnect = new ConnectWallet()
  const [userInfo, setUserInfo] = useState({ 'account': '', 'balance': '' })

  const connectWallet = () => {
    const web3 = new Web3(window.ethereum)
    metaConnect.thunderCoreTest().then(value => {
      try {
        if (value.account) {
          setUserInfo(value);
        }
      } catch (e) {
        console.log(e)
      }

    }).catch(error => {
      console.log(error)
    })

    window.ethereum.on('accountsChanged', async (accounts) => {
      if (typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
        setUserInfo({ account: accounts[0], balance: web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') })
      }
    });

    //Update data when user switch the network
    window.ethereum.on('chainChanged', async (chainId) => {
      let network = parseInt(chainId, 16)
      if (network === 18) {
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let balance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')
        setUserInfo({ account: accounts[0], balance: balance })
      } else {
        try {
          await web3.currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x12" }],
          });
        } catch (error) {
          if (error.code === 4902) {
            try {
              await web3.currentProvider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x12",
                    chainName: "ThunderCore Testnet",
                    rpcUrls: ["https://testnet-rpc.thundercore.com"],
                    nativeCurrency: {
                      name: "TST token",
                      symbol: "TST",
                      decimals: 18,
                    },
                    blockExplorerUrls: ["https://explorer-testnet.thundercore.com/"],
                  },
                ],
              });
            } catch (error) {
              alert(error.message);
            }
          }
        }
      }
    });
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index connectWallet={connectWallet} userInfo={userInfo} />}></Route>
        <Route path='/dividend' element={<Dividend connectWallet={connectWallet} userInfo={userInfo} />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
