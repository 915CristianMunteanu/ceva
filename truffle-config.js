module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",       // Localhost (default: none)
      port: 7545,              // Standard port for Ganache CLI
      network_id: "*",         // Any network (default: none)
      gas: 6721975,            // Gas limit - the maximum gas that transactions can use
      gasPrice: 20000000000    // Gas price - how much you are willing to pay per unit gas
    },
  },
  compilers: {
    solc: {
      version: "0.8.9" // Fetch exact version
    }
  }
};
