require('dotenv').config();

const { expressjwt: jwt } = require("express-jwt");
const jwks = require('jwks-rsa');

// Modulo utilizzato per validare il JWT
// il secret è conservato da Auth0, si accede tramite il .json
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.AUTH0_JWKS
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN,
  algorithms: ['RS256']
});


module.exports = {
    jwtCheck,
}