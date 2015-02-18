# Tiny OpenTok Server

Just a little node server for getting things done.

## Running

Define the required environment variables in a file named `.env` at the root of the project. Then
start the server process with `npm start` at the command line.

A public URL is generated using a tunnelled connection to the local server. This can be useful for
interacting with devices not on your wifi network (local NAT). The URL is logged to stdout (console).

Required environment variables:
  *  `OPENTOK_KEY`: An OpenTok API Key
  *  `OPENTOK_SECRET`: The API Secret for the given key

Optional environment variables:
  *  `PORT`: The port on which the server will listen (default: 5000)
  *  `TUNNEL_SUBDOMAIN`: Preferred subdomain for the public URL tunnelled to the local server.
  alphanumeric string of length (4,20) (default: randomly assigned)

## HTTP API

### Get client connection data

Get the information required for a client to connect to a session. The server stores one of each
kind of a session and serves it up each time a session with the same properties is requested. A new
token is provided in each response.

```
GET /
```

#### Parameters

All parameters are optional and specified using the querystring (`?key=val&key2=val2`) format.

| Name      | Type      | Description                                                     |
|-----------|-----------|-----------------------------------------------------------------|
| mediaMode | string    | The media mode of the session ('relayed' or 'routed').          |
| location  | string    | The location hint of the session (IPv4 address).                |


#### Response

```
{"sessionId":"...","apiKey":"...","token":"..."}
```

