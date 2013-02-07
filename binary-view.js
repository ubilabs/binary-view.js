var undefined,
  POW8  = Math.pow(2, 8),   // 256
  POW16 = Math.pow(2, 16),  // 65536
  POW32 = Math.pow(2, 32);  // 4294967296

var BinaryView = function(options){

  options = options || {};

  if (options.schema){
    this.setSchema(schema);
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

  this.buffer = new ArrayBuffer(length);
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
  var result = [],
    offset = 0;

  this.schema.forEach(function(type, index){
    var value = this.dataView["get" + type](offset);
    result.push(value);
    offset += BinaryView.TYPES[type].bytes;
  }.bind(this));

  return result;
};


if (typeof module !== "undefined"){
  module.exports = BinaryView;
}
