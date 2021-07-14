import { ethers } from 'ethers';
import contractABI from './Number.json';

const externalProvider = new ethers.providers.JsonRpcProvider(
  `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
  "rinkeby"
);
const contractAddress = "0x5e1FCFFa6516eAFe5f8204255e92F192758F6232" 

export const numberContract = new ethers.Contract(contractAddress, contractABI, externalProvider)
