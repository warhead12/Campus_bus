'use strict';

// Node 21+ removed SlowBuffer; jsonwebtoken -> jwa -> buffer-equal-constant-time still references it.
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
