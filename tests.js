
if (typeof require == "function"){
  BinaryView = require("./binary-view.js");
}

function log(label, a, b){
  console.log("" + (a == b), label);
}

view = new BinaryView();
view.setSchema(["Uint8", "Uint32", "Int16", "Float64"]);
view.setData([128, 1234567, -1234, 0.12345]);

data = view.getData();

log("Uint8", data[0], 123);
log("Uint32", data[1], 1234567);
log("Int16", data[2], -1234);
log("Float64", data[3], 0.12345);
