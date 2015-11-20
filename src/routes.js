import { Router as routerFactory } from 'express';
import config from 'config';
import opentokFactory from 'opentok';
import Promise from 'bluebird';
import createStore from './lib/memory-store.js';
import _ from 'lodash';
import timestamp from 'unix-timestamp';

const api = routerFactory();
const opentok = Promise.promisifyAll(opentokFactory(config.get('opentok.key'), config.get('opentok.secret')));
const sessions = Promise.promisifyAll(createStore());

api.post('/session', (req, res, next) => {
  const params = _.defaults(_.pick(req.body, 'mediaMode', 'location'), { mediaMode: 'routed' });
  opentok.createSessionAsync(params)
    .then(session => {
      return sessions.setAsync(session.sessionId, session).return(session);
    })
    .then(session => {
      res.status(201).json({
        id: session.sessionId,
        mediaMode: session.mediaMode,
        location: session.location || null,
      });
    })
    .catch(error => next(error));
});

api.post('/session/:id/access', (req, res, next) => {
  const id = req.params.id;
  sessions.getAsync(id)
    .then(() => {
      const params = _.pick(req.body, 'role', 'expires_at', 'data');
      const token = opentok.generateToken(id, params);

      res.status(201).json({
        token: token,
        role: params.role || 'publisher',
        expiresAt: params.expiresAt || Math.round(timestamp.now('+1d')),
        data: params.data || '',
      });
    })
    .catch(error => next(error));
});

export default api;
