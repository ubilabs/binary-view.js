
if (typeof require == "function"){
  BinaryView = require("./binary-view.js");
}

function test(label, a, b){
  console.log("" + (a == b), label);
}

input = [123, 1234567, -1234, 0.12345];

view = new BinaryView();
view.setSchema(["Uint8", "Uint32", "Int16", "Float64"]);
view.setData(input);

data = view.getData();

test("Uint8", data[0], 123);
test("Uint32", data[1], 1234567);
test("Int16", data[2], -1234);
test("Float64", data[3], 0.12345);

string = view.toString();

test("toString", string, "{혒ﮇ㼮骿偫|");

view.fromString("{혒ﮇ㼮骿偫|");
test("fromString", view.getData() + "", input + "");
