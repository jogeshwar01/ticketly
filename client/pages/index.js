import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async context => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;

// cannot use useRequest as it can only be used in a react component
// getInitialProps is the static method called by next js after it determines which page to show
// used when we want to fetch data from next js during server side rendering  - executed on server

// request from component - always on browser - directly /api/users - no extra effort
// request from getInitialProps - can be client/server - need to figure out env so we use correct domain
// on server when 1)hard refresh 2)click link from diff domain  3)type url into address bar
// on client when 1)move from one page to another while in the app
// can confirm this by doing console.log