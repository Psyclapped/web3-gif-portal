/*
 * We are going to be using the useEffect hook!
 */
import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import idl from './idl.json';

// Change this up to be your Twitter if you want.
const TWITTER_HANDLE = 'psyclapped';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
  'https://media.giphy.com/media/3o7btLwXZ9XqQZqZyY/giphy.gif',
]

const App = () => {
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */

  // State declaration
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          /*
          The solana object gives us a function that will allow
          us to connect directly with the user's wallet!
          */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            `Connected with Public Key:`,
            response.publicKey.toString()
          );
          /*
          set the user's publicKey in state to be used later
          */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log(`Connected with Public Key: ${response.publicKey.toString()}`);
      setWalletAddress(response.publicKey.toString());
    }
  }

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log(`Gif link: ${inputValue}`);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('No gif link provided!');
    }
  }

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
        >
          <input
            type="text"
            placeholder="Enter gif link!"
            value={inputValue}
            onChange={onInputChange}
            />
          <button type="submit" className="cta-button submit-gif-button">Submit</button>
        </form>
      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log(`Fetching GIF list...`);
      // call solana program here.

      // set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">Community GIF Project</p>
          <p className="sub-text">
            ✨ View Our GIF Collection In The Metaverse ✨
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`follow me @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
