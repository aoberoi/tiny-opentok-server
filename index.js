var opentok = require('opentok')(process.env.OPENTOK_KEY, process.env.OPENTOK_SECRET),
    http = require('http'),
    url = require('url');

var server = http.createServer(function(req, res) {
  var reqUrl = url.parse(req.url, true);
  switch (reqUrl.pathname) {
    case '/':
      getSession(req, res);
      break;
  }
});

var session;
var getSession = function(req, res) {

  function respondWithSession() {
    var sessionData = {
      apiKey: opentok.apiKey,
      sessionId: session.sessionId,
      token: opentok.generateToken(session.sessionId)
    };

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(sessionData));
  }

  function respondWithError(err) {
    res.writeHead(500);
    res.end();
  }

  if (!session) {
    opentok.createSession(function(err, newSession) {
      if (err) return respondWithError(err);
      session = newSession;
      respondWithSession();
    });
  } else {
    setImmediate(respondWithSession);
  }
};

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('server listening on port ' + port);
});
