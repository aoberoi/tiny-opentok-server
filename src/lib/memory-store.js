import _ from 'lodash';

function createStore() {
  let backingStore = {};

  function all(cb) {
    setImmediate(() => cb(_.cloneDeep(backingStore)));
  }

  function clear(cb) {
    backingStore = {};
    setImmediate(cb);
  }

  function destroy(id, cb) {
    delete backingStore[id];
    setImmediate(cb);
  }

  function get(id, cb) {
    let done;

    if (_.has(backingStore, id)) {
      done = () => cb(null, backingStore[id]);
    } else {
      done = () => cb(new Error('not found'));
    }

    setImmediate(done);
  }

  function length(cb) {
    setImmediate(() => cb(_.size(backingStore)));
  }

  function set(id, data, cb) {
    backingStore[id] = data;
    setImmediate(cb);
  }

  return {
    all,
    clear,
    destroy,
    get,
    length,
    set,
  };
}

export default createStore;
