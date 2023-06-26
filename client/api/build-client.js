import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server! 
    
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
      //to make ingress know the host we are referring to ie ticketly.dev here
      //this will have host as well as our cookie in headers
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};

// we are on the server! - so it would be localhost of container rather than our machine
// so we can use the url to access the service name - https//auth-srv/api/users/currentuser - only works if they are in same namespace (which they are in)
// this is not preferred as we need to remember a lot of service names and which route corresponds to which services
// also we need to figure out how to extract cookie as this is not browser and wont take care of it itself

// CROSS NAMESPACE COMMUNICATION - https://NAMEOFSERVICE.NAMESPACE.svc.cluster.local
// to get service name for a namespace - first do 'kubectl get namespace'
// then 'kubectl get services -n ingress-nginx'
// requests should be made to http://ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser - as its a different namespace
// as syntax very hard - can create ExternalName type service to map the hard name to easy one