// Description:
//   もくもく会用
//
// Notes:
//   #basketball 
//
// Commands:
//   参加 - 最新のサークル活動に参加
//   不参加 - 最新のサークル活動に参加しない
//   hubot list - 今のイベントの参加者と日程を確認する
//   hubot update - 管理者用
//

"use strict"

const EventServer        = require("../attend/EventServer.js");
const AttendeeRepository = require("../attend/AttendeeRepository.js");
const AttendChecker      = require("../attend/AttendChecker.js");

const status = (event) => {
    const start  = new Date(event.startAt);
    return `${event.title} on ${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`;
}

module.exports = (robot => {
    const repository    = new AttendeeRepository(robot.brain, "hubot-attend-keys-vg-basketball");
    const eventServer   = new EventServer(repository);
    const checker       = new AttendChecker(["参加"], ["不参加"], "ない");

    robot.hear(/.*/i, res => {
        if (res.message.room !== "basketball") {
            return;
        }
        const event    = eventServer.latestEvent();
        if(event === null) {
            return;
        }

        const tokens = (res.message.tokenized || []).map((t) => t.basic_form)
        const checkResult = checker.check(tokens);

        const userName = res.message.user.name;
        if ( checkResult.ambiguous ) {
            robot.logger.info("参加か不参加か不明なケース")
            robot.logger.info(tokens)
        } else if ( checkResult.isAttend ) {
            const result = eventServer.attend(userName, eventServer.latestEvent());
            result.changed && res.send(`*${userName} joined!* -> ${status(event)}`)
        } else if ( checkResult.notAttend ) {
            const result = eventServer.leave(userName, eventServer.latestEvent());
            result.changed && res.send(`*${userName} leaved!* <- ${status(event)}`);
        }
    })

    robot.respond(/list/i, res => {
        const event     = eventServer.latestEvent();
        if(event !== null) {
            const members = eventServer.attendees(event);
            res.send(`直近のサークル予定 ~~ *${event.title}* ~~\n参加者: ${members.length}人 ( ${members.join(",")} )\n場所: ${event.location}\n備考: ${event.description}`);
        } else {
            res.send("直近の予定は見当たらないかなぁ・・・");
        }
    });

    robot.respond(/update/i, res => {
        eventServer.update();
    });
})
