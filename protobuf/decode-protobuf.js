
module.exports = function(RED) {

  function DecodeProtoBufNode(config) {
    RED.nodes.createNode(this,config);
    var node = this;

    // Extract configuration settings

    if(config.protofile.length == 0)
      throw ".proto file is not defined";

    node.protofile = config.protofile;

    if(config.messagetype.length == 0)
      throw "message type is not defined";

    node.messagetype = config.messagetype;

    // Create protocol buffers builder for decode

    var protobuf = require("protobufjs");
    protobuf.load(node.protofile, function(err, root) {
      var msgtype = root.lookupType(node.messagetype);

      node.on('input', function(msg) {
        var message = msgtype.decode(msg.payload);
        msg.payload = message;

        // Pass it along
        node.send(msg);
      });
    });
  }
  RED.nodes.registerType("decode-protobuf",DecodeProtoBufNode);
}
