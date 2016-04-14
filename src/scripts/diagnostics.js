// Description
//   hubot scripts for diagnosing dark hubot
//
// Commands:
//   hubot ping - Reply with ...
//   hubot echo <text> - Reply back with <text>
//

module.exports = (robot) => {
  robot.respond(/PING$/i, (msg) => msg.send("PONG"));

  robot.respond(/ECHO (.*)$/i, (msg) => msg.send(msg.match[1]));
}
