const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");

// Avalanche Fuji Testnet chainId (hex)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  console.log({ balance });
  return (balance / 1e18).toFixed(4);
}

function shortenAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

function resetUI(message) {
  statusEl.textContent = message;
  statusEl.style.color = "#e84142";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";

  connectBtn.disabled = false;
  connectBtn.textContent = "Connect Wallet";
  connectBtn.style.backgroundColor = "#e84142";
}


async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    return;
  }

  console.log("window.ethereum", window.ethereum);

  try {
    statusEl.textContent = "Connecting...";

    // Request wallet accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    addressEl.textContent = shortenAddress(address);

    console.log({ address });

    // Get chainId
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    console.log({ chainId });

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";

      //disable button
      connectBtn.disabled = true;
      connectBtn.textContent = "Connected";
      connectBtn.style.backgroundColor = "#44bd32";
      connectBtn.style.cursor = "not-allowed";


      // Get AVAX balance
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      console.log({ balanceWei });

      balanceEl.textContent = formatAvaxBalance(balanceWei);
    } else {
      networkEl.textContent = "Wrong Network ❌";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "#fbc531";
      balanceEl.textContent = "-";
    }
  } catch (error) {
    console.error(error);
    resetUI("Connection Failed ❌");
  }
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      resetUI("Wallet disconnected ❌");
    } else {
      addressEl.textContent = shortenAddress(accounts[0]);
      statusEl.textContent = "Account Changed 🔄";
    }
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}


connectBtn.addEventListener("click", connectWallet);
