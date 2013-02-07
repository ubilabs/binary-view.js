
if (typeof require == "function"){
  BinaryView = require("./binary-view.js");
}

function createView() {
  var buffer = new ArrayBuffer(100);
  return new BinaryView(buffer);
}

function compare(label, type, input, assert){
  var view = createView(),
    output, same;

  view.set(type, 0, input);
  output = view.get(type, 0);
  same = output == input;

  console.log(label, assert === same, type);
}

function all(callback){
  for (var type in BinaryView.TYPES){
    info = BinaryView.TYPES[type];
    callback(type, info);
  }
}

all(function(type, info){
  if (!info.min) { return; }
  compare("MIN:  ", type, info.min, true);
  compare("MAX:  ", type, info.max, true);
  compare("MIN-1:", type, info.min-1, false);
  compare("MAX+1:", type, info.max+1, false);
});

var view = createView();

view.setUint16(12345);
view.setUint8(123);
view.pointer = 0;
console.log(view.getUint16() == 12345);
console.log(view.getUint8() == 123);