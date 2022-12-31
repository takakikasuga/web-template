import { AppProps } from 'next/app';
import '../assets/scss/index.scss';

export const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};
