import 'bootstrap/dist/css/bootstrap.css';

export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

// this is the way to include global css in next js
// the file name must be _app.js