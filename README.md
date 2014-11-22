# Tiny OpenTok Server

Just a little node server for getting things done.

## Running

Define the required environment variables in a file named `.env` at the root of the project. Then
start the server process with `npm start` at the command line.

Required environment variables:
  *  `OPENTOK_KEY`: An OpenTok API Key
  *  `OPENTOK_SECRET`: The API Secret for the given key

Optional environment variables:
  *  `PORT`: The port on which the server will listen (default: 5000)
