import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;



// cannot use useRequest in getInitialProps as it can only be used in a react component
// getInitialProps is the static method called by next js after it determines which page to show
// used when we want to fetch data from next js during server side rendering  - executed on server

// request from component - always on browser - directly /api/users - no extra effort
// request from getInitialProps - can be client/server - need to figure out env so we use correct domain
// on server when 1)hard refresh 2)click link from diff domain  3)type url into address bar
// on client when 1)move from one page to another while in the app
// can confirm this by doing console.log