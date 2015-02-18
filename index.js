var opentok = require('opentok')(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET),
    http = require('http'),
    url = require('url'),
    localtunnel = require('localtunnel'),
    _ = require('lodash');

var server = http.createServer(function(req, res) {
  var reqUrl = url.parse(req.url, true);
  console.log('incoming request at path: ' + reqUrl.pathname);
  switch (reqUrl.pathname) {
    case '/':
      getSession(req, res);
      break;
    default:
      notFound(req, res);
  }
});

var sessions = [];

var getSession = function(req, res) {
  var reqUrl = url.parse(req.url, true);

  function respondWithSession(session) {
    var sessionData = {
      apiKey: opentok.apiKey,
      sessionId: session.sessionId,
      token: opentok.generateToken(session.sessionId)
    };

    console.log('getSession responding with session data');
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(sessionData));
  }

  function respondWithError(err) {
    console.error('getSession responding with error');
    res.writeHead(500);
    res.end(err.toString());
  }

  function findSession(sessionProperties) {
    return _.find(sessions, function(session) {
      var matches = true;
      _.each(sessionProperties, function(value, key) {
        if (session[key] !== value) {
          matches = false;
        }
      });
      return matches;
    });
  }

  var desiredProperties = _.pick(reqUrl.query, 'mediaMode', 'location');
  // Checks mediaMode because unlike location when its set to an invalid property it will not throw
  if (  desiredProperties.mediaMode !== undefined &&
       (desiredProperties.mediaMode !== 'routed' || desiredProperties.mediaMode !== 'relayed')) {
    return respondWithError( new Error('Media Mode can only be set to \'routed\' or \'relayed\'. ' +
                                'Cannot use ' + desiredProperties.mediaMode) );
  }

  var matchingSession = findSession(desiredProperties);
  if (matchingSession) {
    console.log('using existing session');
    return respondWithSession(matchingSession);
  } else {
    console.log('no existing session, creating one');
    opentok.createSession(desiredProperties, function(err, newSession) {
      if (err) return respondWithError(err);
      sessions.push(newSession);
      console.log('added to set of sessions', sessions);
      return respondWithSession(newSession);
    });
  }
};

var notFound = function(req, res) {
    console.error('not found');
    res.writeHead(404);
    res.end('not found');
};

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('server listening on port ' + port);
  startTunnel();
});


var startTunnel = function() {
  var opts = {};
  if (process.env.TUNNEL_SUBDOMAIN) {
    opts.subdomain = process.env.TUNNEL_SUBDOMAIN;
  }
  localtunnel(port, opts, function(err, tunnel) {
    if (err) return console.error('an error occurred setting up the localtunnel', err.toString());
    console.log('public URL:', tunnel.url);
  }).on('close', function () {
    console.log('localtunnel closed');
  });
};
