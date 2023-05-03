import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine';
import type {
  CandyGuard as CandyGuardType,
  CandyMachine as CandyMachineType,
  StartDate as StartDateType,
} from '@metaplex-foundation/mpl-candy-machine';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  Option,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import type { Umi as UmiType } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage';
import { useState } from 'react';

import candyMachineStyles from './CandyMachine.module.css';

import styles from '@/styles/Home.module.css';

type CandyMachineProps = {
  walletAddress: any;
};

const CandyMachine = (props: CandyMachineProps) => {
  const { walletAddress } = props;
  const [umi, setUmi] = useState<UmiType | undefined>(undefined);
  const [candyMachine, setCandyMachine] = useState<
    CandyMachineType | undefined
  >(undefined);
  const [candyGuard, setCandyGuard] = useState<CandyGuardType | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const mintToken = async () => {
    setIsMinting(true);
    try {
      if (umi === undefined) {
        throw new Error('Umi context was not initialized.');
      }
      if (candyMachine === undefined) {
        throw new Error('Candy Machine was not initialized.');
      }
      const nftSigner = generateSigner(umi);
      // トランザクションの構築と送信を行います。
      await transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            candyGuard: candyGuard?.publicKey,
            nftMint: nftSigner,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
          }),
        )
        .sendAndConfirm(umi);
    } catch (error) {
      console.error(error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className={candyMachineStyles.machineContainer}>
      <p>Drop Date:</p>
      <p>Items Minted:</p>
      <button
        className={`${styles.ctaButton} ${styles.mintButton}`}
        onClick={mintToken}
        disabled={isMinting}
      >
        Mint NFT
      </button>
    </div>
  );
};

export default CandyMachine;
