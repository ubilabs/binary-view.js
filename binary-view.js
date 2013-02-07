var undefined,
  POW8  = Math.pow(2, 8),   // 256
  POW16 = Math.pow(2, 16),  // 65536
  POW32 = Math.pow(2, 32);  // 4294967296

var BinaryView = function(buffer){

  this.pointer = 0;

  this.assignBuffer(buffer);
  this.dataView = new DataView(this.buffer);
  this.byteLength = this.buffer.byteLength;
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

BinaryView.prototype.assignBuffer = function(buffer){
  switch (buffer.constructor){
    case ArrayBuffer:
      this.buffer = buffer;
      break;

    case Number:
      this.buffer = new ArrayBuffer(buffer);
      break;

    case Array:
      this.createBufferFromArray(buffer);
      break;

    default:
      throw new Error(buffer.constructor.name + " is not supported.");
  }
};

BinaryView.prototype.createBufferFromArray = function(scheme){

  var byteLength = 0;

  scheme.forEach(function(type){
    byteLength += BinaryView.TYPES[type].bytes;
  });

  this.scheme = scheme;
  this.length = scheme.length;
  this.index = 0;

  this.buffer = new ArrayBuffer(byteLength);
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
  if (value === undefined){
    value = offset;
    offset = undefined;
  }

  if (value === undefined && this.scheme){
    value = type;
    type = this.scheme[this.index];
    this.index++;
  }

  offset = this._offset(offset, type);
  this.dataView["set" + type](offset, value);
};

BinaryView.prototype.getOffsetForIndex = function(index){
  var offset = 0,
    type, i;
  
  for (i = 0; i < index; i++){
    type = this.scheme[i];
    offset += BinaryView.TYPES[type].bytes;
  }

  return offset;
};

BinaryView.prototype.get = function(type, offset){

  if (type === undefined && this.scheme){
    type = this.scheme[this.index];
    offset = this.getOffsetForIndex(this.index);
    this.index++;
  }

  offset = this._offset(offset, type);
  return this.dataView["get" + type](offset);
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
