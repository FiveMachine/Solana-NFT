import {
  fetchCandyMachine,
  safeFetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine';
import { act, render, screen } from '@testing-library/react';

import CandyMachine from '@/components/CandyMachine';

jest.mock('@metaplex-foundation/mpl-candy-machine', () => ({
  fetchCandyMachine: jest.fn(),
  safeFetchCandyGuard: jest.fn(),
  mplCandyMachine: jest.fn(),
}));

jest.mock('@metaplex-foundation/mpl-essentials', () => ({
  setComputeUnitLimit: jest.fn(),
}));

jest.mock('@metaplex-foundation/mpl-token-metadata', () => ({
  mplTokenMetadata: jest.fn(),
}));

jest.mock('@metaplex-foundation/umi', () => ({
  Option: jest.fn(),
  publicKey: jest.fn(),
  some: jest.fn(),
}));

jest.mock('@metaplex-foundation/umi-bundle-defaults', () => ({
  createUmi: jest.fn().mockReturnValue({
    use: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('@metaplex-foundation/umi-signer-wallet-adapters', () => ({
  walletAdapterIdentity: jest.fn(),
}));

jest.mock('@metaplex-foundation/umi-uploader-nft-storage', () => ({
  nftStorageUploader: jest.fn(),
}));

const mockCandyMachineData = {
  items: [],
  itemsRedeemed: 0,
  data: {
    itemsAvailable: 3,
  },
  mintAuthority: 'dummyPublicKey',
};

const mockCandyGuardPastData = {
  guards: {
    solPayment: {
      __option: 'Some',
      value: 0.1,
      destination: 'dummyDestination',
    },
    startDate: {
      __option: 'Some',
      value: {
        date: (Date.now() / 1000 - 60 * 60 * 24).toString(),
      },
    },
  },
};

const mockCandyGuardFutureData = {
  guards: {
    solPayment: {
      __option: 'Some',
      value: 0.1,
      destination: 'dummyDestination',
    },
    startDate: {
      __option: 'Some',
      value: {
        date: (Date.now() / 1000 + 60 * 60 * 24).toString(),
      },
    },
  },
};

describe('CandyMachine', () => {
  describe('when drop date is in the future', () => {
    /** fetchCandyMachine関数の戻り値を設定します */
    (fetchCandyMachine as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ...mockCandyMachineData,
      }),
    );
    /** safeFetchCandyGuard関数の戻り値を設定して、ドロップ日を現在時刻の1日後に設定します */
    (safeFetchCandyGuard as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ...mockCandyGuardFutureData,
      }),
    );
    it('renders CountdownTimer', async () => {
      await act(async () => {
        render(<CandyMachine walletAddress={'mockAddress'} />);
      });

      const textElement = screen.getByText(/Candy Drop Starting In/);
      expect(textElement).toBeInTheDocument();
      const buttonElement = screen.queryByRole('button', {
        name: /Mint NFT/i,
      });
      expect(buttonElement).not.toBeInTheDocument();
    });
  });

  describe('when the drop date is set in the past', () => {
    /** safeFetchCandyGuard関数の戻り値を設定して、ドロップ日を現在時刻の1日前に設定します */
    (safeFetchCandyGuard as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ...mockCandyGuardPastData,
      }),
    );

    it('should render a mint button', async () => {
      /** fetchCandyMachine関数の戻り値を設定します */
      (fetchCandyMachine as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ...mockCandyMachineData,
        }),
      );

      await act(async () => {
        render(<CandyMachine walletAddress={'mockAddress'} />);
      });

      const buttonElement = screen.getByRole('button', {
        name: /Mint NFT/i,
      });
      expect(buttonElement).toBeInTheDocument();
    });

    it('should render "Sold Out"', async () => {
      /** fetchCandyMachine関数の戻り値を設定して、NFTが全てミントされた状態を作ります */
      (fetchCandyMachine as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ...mockCandyMachineData,
          itemsRedeemed: 3,
        }),
      );

      await act(async () => {
        render(<CandyMachine walletAddress={'mockAddress'} />);
      });

      const textElement = screen.getByText(/Sold Out/i);
      expect(textElement).toBeInTheDocument();
      const buttonElement = screen.queryByRole('button', {
        name: /Mint NFT/i,
      });
      expect(buttonElement).not.toBeInTheDocument();
    });
  });
});
