### `Getting Started`
1. Set up your .env file with `KOVAN_PRIVATE_KEY`, `REACT_APP_MORALIS_APP_ID`, `REACT_APP_MORALIS_SERVER_URL`, and `ALCHEMY_API_KEY` defined.
2. run `npm install`
3. run `npx hardhat deploy-kovan` to deploy the smart contracts on the kovan network. This will automatically populate your `constants/PoolFactory.json` and `constants/poolFactoryAddress.js` files
4. run `npm start` to run it in [http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
