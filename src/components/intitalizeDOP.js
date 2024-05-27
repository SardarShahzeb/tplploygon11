import { startDopEngine } from "dop-wallet-old";
import LevelDB from "level-js";
import { createArtifactStore } from './create-artifact-store.ts';

export const initializeEngine = () => {
  // Name for your wallet implementation.
  // Encrypted and viewable in private transaction history.
  // Maximum of 16 characters, lowercase.
  const walletSource = 'quickstart demo';
  
  // LevelDOWN compatible database for storing encrypted wallets.
  const dbPath = 'engine.db';
  const db = new LevelDB(dbPath);
  
  // Whether to forward Engine debug logs to Logger.
  const shouldDebug = true;
  
  // Persistent store for downloading large artifact files required by Engine.         
  const artifactStore = createArtifactStore('local/dir');
  
  // Whether to download native C++ or web-assembly artifacts.
  // True for mobile. False for nodejs and browser.
  const useNativeArtifacts = false;
  
  // Whether to skip merkletree syncs and private balance scans. 
  // Only set to TRUE in shield-only applications that don't 
  // load private wallets or balances.
  const skipMerkletreeScans = false;

  const poiNodeURLs = [];
  
  // Add a custom list to check Proof of Innocence against.
  // Leave blank to use the default list for the aggregator node provided.
  const customPOILists = []
  
  // Set to true if you would like to view verbose logs for private balance and TXID scans
  const verboseScanLogging = false;
  
  startDopEngine(
    walletSource,
    db,
    shouldDebug,
    artifactStore,
    useNativeArtifacts,
    skipMerkletreeScans,
    poiNodeURLs,
    customPOILists,
    verboseScanLogging
  );
};
