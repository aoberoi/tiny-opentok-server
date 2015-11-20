# Tiny OpenTok Server

Just a little node server for getting things done.

## Running

First, install the dependencies: `npm install`.

Next, configure the application. The configuration can be set either using environment variables
(see: `config/custom-environment-variables.json`) or placing a configuration file inside the
`config` directory (see: `config/local.json.sample`).

Finally, run the application: `npm start`.

## HTTP API

This server presents the following collection of routes as its HTTP API.

For routes that have the HTTP method POST, the parameters can be passed either using a
JSON-formatted (`Content-Type: application/json`) or a urlencoded
(`Content-Type: application/x-www-form-urlencoded`) string within the request body.

All responses are JSON-formatted strings.

### Create a session

Create an OpenTok session. The server stores the sessions which were created since starting in
memory. These sessions are the only sessions that can be used for any other functionality from the
server.

```
POST /session
```

#### Parameters

| Name       | Type    | Default | Required | Description |
|------------|---------|---------|----------|-------------|
| mediaMode  | string  | `'routed'` | false | The media mode of the session ('relayed' or 'routed'). |
| location   | string  | `null` | false | The location hint of the session (IPv4 address). |

#### Response

```
{
  "id":"...",        // string
  "mediaMode":"...", // "routed" | "relayed"
  "location":"..."   // string | null
}
```

### Retrieve session credentials

Create a set of session credentials that can be used by an OpenTok client to connect to a session.
Each client should retrieve a unique set of credentials for itself.

```
POST /session/:id/access
```

#### Parameters

| Name       | Type    | Default | Required | Description |
|------------|---------|---------|----------|-------------|
| role       | string  | `'publisher'`| false | The role for the OpenTok token ('publisher', 'subscriber', 'moderator'). |
| expiresAt | number (integer)  | in 24 hours | false | The unix timestamp in seconds after which the OpenTok token cannot be used to connect to the session. |
| data       | string  | `''` | false | A JSON-formatted string that will be encoded into the OpenTok token data. Additional data may also be encoded along with the provided data. |

#### Response

```
{
  "token":"...",     // string
  "role":"...",      // "publisher" | "subscriber" | "moderator"
  "expiresAt":1234,  // number (integer)
  "data":"..."       // string
}
```
