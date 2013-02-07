var undefined,
  POW8  = Math.pow(2, 8),   // 256
  POW16 = Math.pow(2, 16),  // 65536
  POW32 = Math.pow(2, 32);  // 4294967296

var BinaryView = function(buffer, TODO_SCHEME){
  this.buffer = buffer;
  this.dataView = new DataView(buffer);
  this.length = this.buffer.byteLength;
  this.pointer = 0;
  // this.index = 0;
  this.writePointer = 0;
};

BinaryView.TYPES = {
  "Int8":     { bytes: 1, min: -POW8 /2, max: POW8 /2-1 }, // 128
  "Int16":    { bytes: 2, min: -POW16/2, max: POW16/2-1 }, // 32768
  "Int32":    { bytes: 4, min: -POW32/2, max: POW32/2-1 }, // 2147483648
  "Uint8":    { bytes: 1, min: 0,        max: POW8 -1   }, // 256
  "Uint16":   { bytes: 2, min: 0,        max: POW16-1   }, // 65536
  "Uint32":   { bytes: 4, min: 0,        max: POW32-1   }, // 4294967296
  "Float32":  { bytes: 4 },
  "Float64":  { bytes: 8 }
};

BinaryView.prototype._offset = function(offset, type){
  if (offset === undefined){
    offset = this.pointer;
  } else {
    this.pointer = offset;
  }
  this.pointer += BinaryView.TYPES[type].bytes;
  return offset;
};

BinaryView.prototype.set = function(type, offset, value){
  var method = "set" + type;
  if (value === undefined){
    value = offset;
    offset = undefined;
  }
  offset = this._offset(offset, type);
  this.dataView[method](offset, value);
};

BinaryView.prototype.get = function(type, offset){
  var method = "get" + type;
  offset = this._offset(offset, type);
  return this.dataView[method](offset);
};

for (var type in BinaryView.TYPES){
  (function(type){
    BinaryView.prototype["set" + type] = function(value, offset){
      this.set(type, value, offset);
    };
    BinaryView.prototype["get" + type] = function(offset){
      return this.get(type, offset);
    };
  })(type);
}

if (typeof module !== "undefined"){
  module.exports = BinaryView;
}
