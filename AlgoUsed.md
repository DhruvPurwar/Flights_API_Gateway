1. Bcrypt used for encrupting passwords.
2. USing JWT instead of passport.js

### JWT (Json Web Tokens)

1. User sends the creds to the server. It checks whether user exits or password is correct. If found guilty, it sends error.
2. If it is correct, then it populates JWT and sends to client. Client must store that JWT.
3. Whenever client hits any API, it will send JWT in request headers and the server will verify it.
