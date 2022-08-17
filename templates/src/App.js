import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/index';
import Dividend from './pages/dividend';
import { ConnectWallet } from './components/connectWallet';
import Web3 from 'web3'
import BNBTokenImage from './images/BNB.png'

function App() {
  const metaConnect = new ConnectWallet()
  const [userInfo, setUserInfo] = useState({ 'account': '', 'balance': '' })
  const [chainId, setChainId] = useState()
  const [token, setToken] = useState()
  const [originTokenUrl, setOriginTokenUrl] = useState()

  const connectWallet = () => {
    const web3 = new Web3(window.ethereum)

    metaConnect.thunderCore().then(value => {
      try {
        if (value.account) {
          setUserInfo(value);
        }

        window.ethereum.on('accountsChanged', async (accounts) => {
          if (typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
            setUserInfo({ account: accounts[0], balance: web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') })
          }
        });

        //Update data when user switch the network
        window.ethereum.on('chainChanged', async (chainId) => {
          let network = parseInt(chainId, 16)
          if (network === 108 || String(network) === process.env.REACT_APP_BSC) {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let balance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')
            setUserInfo({ account: accounts[0], balance: balance })
            chainIdSetting(network)
          } else {
            try {
              await web3.currentProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x6c" }],
              });
            } catch (error) {
              if (error.code === 4902) {
                try {
                  await web3.currentProvider.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: "0x6c",
                        chainName: "ThunderCore",
                        rpcUrls: ["https://mainnet-rpc.thundercore.com"],
                        nativeCurrency: {
                          name: "TT token",
                          symbol: "TT",
                          decimals: 18,
                        },
                        blockExplorerUrls: ["https://viewblock.io/thundercore"],
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

      } catch (e) {
        console.log(e)
      }

    }).catch(error => {
      console.log(error)
    })


  }

  const chainIdSetting = (value) => {
    if (String(value) === process.env.REACT_APP_BSC) {
      setToken("BNB")
      setOriginTokenUrl(BNBTokenImage)
    } else {
      setToken("TT")
      setOriginTokenUrl("https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1.25,format=auto/https%3A%2F%2F1384322056-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FHVry7OTN1UZzjjhTeYXg%252Ficon%252Ftc2CvK0iK8pBB1anEcAT%252F10990.png%3Falt%3Dmedia%26token%3Dd308595a-a25f-4dc2-bd7e-8237f6d9f8e1")
    }
  }

  useEffect(() => {
    metaConnect.getChainId().then(value => {
      chainIdSetting(value)
    }).catch(error => console.log(error))
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index connectWallet={connectWallet} userInfo={userInfo} token={token} originTokenUrl={originTokenUrl} />}></Route>
        <Route path='/dividend' element={<Dividend connectWallet={connectWallet} userInfo={userInfo} token={token} />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
