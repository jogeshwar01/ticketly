module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
// next js might be prone to issues in detecting file changes sometimes
// so we are adding this config file in order to make sure that the changes are detected
// while creating this file for the first time - do 'kubectl get pods'
// then manually delete the client one if present using - kubectl delete pod <pod-name>