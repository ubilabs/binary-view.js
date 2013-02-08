
if (typeof require == "function"){
  BinaryView = require("./binary-view.js");
}

function test(label, a, b){
  console.log("" + (a == b), label);
}

input = [123, 1234567, -1234, 0.12345];

view1 = new BinaryView();
view1.setSchema(["Uint8", "Uint32", "Int16", "Float64"]);
view1.setData(input);

data = view1.getData();

test("Uint8", data[0], 123);
test("Uint32", data[1], 1234567);
test("Int16", data[2], -1234);
test("Float64", data[3], 0.12345);

string = view1.toString();
test("toString", string, "{혒ﮇ㼮骿偫|");

view1.fromString("{혒ﮇ㼮骿偫|");
test("fromString", view1.getData() + "", input + "");

view2 = new BinaryView({
  schema: ["Uint8", "Uint32", "Int16", "Float64"],
  mapping: ["a", "b", "c", "d"],
  data: [1, 2, 3, 4]
});

data = view2.getData();
test("Mapping", data.b, 2);

view2.setArrayBuffer(view1.arrayBuffer);
data = view2.getData();

test("Reassign buffer.", data.b, 1234567);

if (typeof require == "function"){

  binary = view2.getBuffer();
  view2.setBuffer(binary);
  data = view2.getData();

  test("convert", data.d, 0.12345);

  base64 = binary.toString("base64");
  test("base64", base64, "ewAS1of7Lj+/mmtQsPJ8AA==");

  fs = require("fs");
  fs.writeFileSync("out.bin", binary);
  file = fs.readFileSync("out.bin");
  binary = new Buffer(file);
  test("Save read file", base64, binary.toString("base64"));
}