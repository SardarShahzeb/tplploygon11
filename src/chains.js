// import type { AddEthereumChainParameter } from '@web3-react/types'

const ETH = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

const MATIC = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

const CELO = {
  name: "Celo",
  symbol: "CELO",
  decimals: 18,
};

// interface BasicChainInformation {
//   urls: string[]
//   name: string
// }

// interface ExtendedChainInformation extends BasicChainInformation {
//   nativeCurrency: AddEthereumChainParameter['nativeCurrency']
//   blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
// }

function isExtendedChainInformation(chainInformation) {
  return !!chainInformation.nativeCurrency;
}

export function getAddChainParameters(chainId) {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

const getInfuraUrlFor = (network) =>
  `https://${network}.infura.io/v3/2506256890a14a8d82af436e349e65c4}`;
const getAlchemyUrlFor = (network) =>
  process.env.alchemyKey
    ? `https://${network}.alchemyapi.io/v2/${process.env.alchemyKey}`
    : undefined;

export const MAINNET_CHAINS = {
  137: {
    urls: ["https://polygon-mainnet.g.alchemy.com/v2/HpqPv8tECj8F2CK3Zxyk8acQgPoS0_lQ/"],
    name: "Mumbai",
  },
};

export const CHAINS = {
  ...MAINNET_CHAINS,
};

export const URLS = Object.keys(CHAINS).reduce((accumulator, chainId) => {
  const validURLs = CHAINS[chainId].urls;

  if (validURLs.length) {
    accumulator[chainId] = validURLs;
  }

  return accumulator;
}, {});
