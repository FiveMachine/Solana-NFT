import Image from 'next/image';

import twitterLogo from '@/public/twitter-logo.svg';
import styles from '@/styles/Home.module.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home = () => {

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          <p className={styles.header}>🍭 Candy Drop</p>
          <p className={styles.subText}>NFT drop machine with fair mint</p>
        </div>
        <div className={styles.footerContainer}>
          <Image
            alt="Twitter Logo"
            className={styles.twitterLogo}
            src={twitterLogo}
          />
          <a
            className={styles.footerText}
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </main>
  );
};

export default Home;
