import baseConfig from '../../config';
import stagingConfig from '../../config/index-staging';

let config = baseConfig;

// eslint-disable-next-line
console.log(`NODE_ENV is '${process.env.NODE_ENV}'`)

if (process.env.NODE_ENV === 'staging') {
  config = stagingConfig;
}

const { serverHost, serverPort, clientHost, clientPort, socketHost, socketPort } = config;

export const HOST = serverHost;
export const PORT = serverPort;
export const CLIENTHOST = clientHost;
export const CLIENTPORT = clientPort;
export const SOCKETHOST = socketHost;
export const SOCKETPORT = socketPort;
export const ROOT_ID = 'root';
