var undefined,
  POW8  = Math.pow(2, 8),   // 256
  POW16 = Math.pow(2, 16),  // 65536
  POW32 = Math.pow(2, 32);  // 4294967296

var BinaryView = function(options){

  options = options || {};

  if (options.schema){
    this.setSchema(options.schema);
  }

  if (options.mapping){
    this.setMapping(options.mapping);
  }

  if (options.data){
    this.setData(options.data);
  }
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

BinaryView.prototype.setSchema = function(schema){

  var length = 1;

  this.schema = schema;

  this.schema.forEach(function(type){
    length += BinaryView.TYPES[type].bytes;
  });

  this.setBuffer(new ArrayBuffer(length));
};

BinaryView.prototype.setMapping = function(mapping){
  this.mapping = mapping;
};

BinaryView.prototype.setBuffer = function(buffer){
  this.buffer = buffer;
  this.dataView = new DataView(this.buffer);
};

BinaryView.prototype.setData = function(values){
  var offset = 0;

  this.schema.forEach(function(type, index){
    this.dataView["set" + type](offset, values[index]);
    offset += BinaryView.TYPES[type].bytes;
  }.bind(this));
};

BinaryView.prototype.getData = function(){
  var result = this.mapping ? {} : [],
    offset = 0;

  this.schema.forEach(function(type, index){
    var value = this.dataView["get" + type](offset);
    if (this.mapping) {
      result[this.mapping[index]] = value;
    } else {
      result.push(value);
    }
    offset += BinaryView.TYPES[type].bytes;
  }.bind(this));

  return result;
};

BinaryView.prototype.toString = function(){
  return String.fromCharCode.apply(null, new Uint16Array(this.buffer));
};

BinaryView.prototype.fromString = function(string){
  var length = string.length,
    buffer = new ArrayBuffer(string.length * 2),
    view = new Uint16Array(buffer);

  for (var i=0; i < length; i++) {
    view[i] = string.charCodeAt(i);
  }
  this.buffer = buffer;
  this.dataView = new DataView(this.buffer);
};


if (typeof module !== "undefined"){
  module.exports = BinaryView;
}
