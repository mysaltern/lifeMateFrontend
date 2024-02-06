// pages/_app.tsx

import { Provider } from 'react-redux';
import { AppProps } from 'next/app'; // Import AppProps from 'next/app'
import store from '../../../redux/store'; // Adjust the path accordingly

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
