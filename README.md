### Running it locally

1. Set up your .env file with `KOVAN_PRIVATE_KEY`, `REACT_APP_MORALIS_APP_ID`, `REACT_APP_MORALIS_SERVER_URL`, and `REACT_APP_ALCHEMY_API_KEY` defined. Before deploying, you'll also need to add your `KOVAN_PRIVATE_KEY`, `MUMBAI_MATIC_KEY`, and `FUJI_AVALANCHE_KEY`. All variables that begin with `REACT_APP` will be available throughout the code; for security purposes, keys and wallets do not have this.
2. run `npm install`
3. run `npm run deploy-kovan` to deploy the smart contracts on the kovan network. This will automatically populate your `constants/PoolFactory.json` and `constants/poolFactoryAddress.js` files. You can also run `npm run deploy-mumbai` and `npm run deploy-fuji` to get set up on those networks as well.
4. run `npm start` to run it in [http://localhost:3000](http://localhost:3000)

### Contributing

No changes or pull requests directly on `main` will be permitted. All pull requests should be made against the `develop` branch. Once that branch is tested and approved, it will be merged into `main`, and deployed.

### Deploying

Smart Picks deploys automatically on updates to the `main` branch. It is deployed on IPFS via Fleek, and is available at [https://smart-picks.on.fleek.co/](smart-picks.on.fleek.co)

### How it works

Each chain has its own Pool Factory smart contract, through which users can generate their own pool. All smart contracts maintain strict rules for buy-in price, number of entrants allowed, and one bracket per user.

![Create Pool flow](https://i.imgur.com/94u6apE.png)

Our pools will close 24 hours after the tournament ends, and automatically pay out to the winner.

![Close pool flow](https://i.imgur.com/ibRYfcU.png)
