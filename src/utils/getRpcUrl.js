import random from "lodash/random";

// Array of available nodes to connect to
export const nodes = [
  "https://polygon-mainnet.g.alchemy.com/v2/HpqPv8tECj8F2CK3Zxyk8acQgPoS0_lQ/",
  "https://polygon-mainnet.g.alchemy.com/v2/HpqPv8tECj8F2CK3Zxyk8acQgPoS0_lQ/",
  "https://polygon-mainnet.g.alchemy.com/v2/HpqPv8tECj8F2CK3Zxyk8acQgPoS0_lQ/",
];
// export const nodes = ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"]

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1);
  return nodes[randomIndex];
};

export default getNodeUrl;
