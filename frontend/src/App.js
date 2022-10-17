import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers";

function App() {
  const login = async () => {
    const rawMessage = 'Some message';

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(rawMessage);
    const address = await signer.getAddress();
    const fetchOpts = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({address, msg: rawMessage, signed: signature})
    };

    fetch('http://localhost:5000/login', fetchOpts).then(res => {
      if (res.status >= 200 && res.status <= 300) {
        return res.json();
      } else {
        throw Error(res.statusText);
      }
    }).then(json => {
      // Auth succeeded
      console.log({json})
      console.log("Auth Success")
    }).catch(err => {
      // Auth failed
      console.log("Auth Failed")
    })

  }

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={login}>login</button>
        </header>
      </div>
  );
}

export default App;
