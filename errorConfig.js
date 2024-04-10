const errorConfig = {
    development: {
      port: process.env.SERVER_PORT,
      showErrors: true
    },
    production: {
      port: process.env.SERVER_PORT,
      showErrors: false
    }
  };
  
  export default errorConfig;
  