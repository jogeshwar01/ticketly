import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

// these props are passed on from getInitialProps
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
      //client and user - to not repeat it in each component's code
    );
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;

// this is the way to include global css in next js
// the file name must be _app.js

// the arguments provided by getInitialProps are different for a page (normal file) and a Custom app component (file starting with _)
// for a normal page -> context == {req,res}
// for custom app    -> context == {Component, ctx: {req,res}}
// but if our app has a getInitialProps then our page's getInitialProps wont be called automatically
// so we have to manually invoke it here -> we can do Component.getInitialProps

// the currentUser in index.js will come from the _app.js
// we may have not needed getInitialprops here as _app.js does same thing
// but this theory is important when we need props in both app and component
