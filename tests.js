
if (typeof require == "function"){
  BinaryView = require("./binary-view.js");
}

function log(label, a, b){
  console.log("" + (a == b), label);
}

function compare(label, type, input, assert){
  var view = new BinaryView(10),
    output, same;

  view.set(type, 0, input);
  output = view.get(type, 0);
  same = output == input;

  log(type + ": " + label, assert, same);
}

function all(callback){
  for (var type in BinaryView.TYPES){
    info = BinaryView.TYPES[type];
    callback(type, info);
  }
}

all(function(type, info){
  if (!info.min) { return; }
  compare("MIN", type, info.min, true);
  compare("MAX", type, info.max, true);
  compare("MIN-1", type, info.min-1, false);
  compare("MAX+1", type, info.max+1, false);
});

var view = new BinaryView(10);

view.setUint16(12345);
view.setUint8(123);
view.pointer = 0;
log("Read first entry.", view.getUint16(), 12345);
log("Read next entry.", view.getUint8(), 123);


view = new BinaryView(["Uint8", "Uint32", "Int16", "Float64"]);
log("Auto byte length.", view.byteLength, 15);
log("Auto length", view.length, 4);

view.set(12);
view.set(1234567);
view.set(-1234);
view.set(0.12345);

view.index = 0;

view.get()
view.get();
view.get();
log("Read using auto index", view.get(), 0.12345);