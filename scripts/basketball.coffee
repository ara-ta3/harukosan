# Description:
#   バスケサークル用API
#
# Commands:
#   hubot 抽選結果  - 抽選結果を確認できるようになる予定
#   hubot 予約 - 今予約ができそうな日を教えてくれるようになる予定
#   hubot ドキュメント - ドキュメントを確認する
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#
#   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

module.exports = (robot) ->

  robot.hear /バスケがしたいです/, (res) ->
    res.send "今すぐ大会に予約よ http://hoopone.jp/"

  robot.respond /抽選結果/, (res) ->
    res.send "まだ結果取得はできないの"

  robot.respond /予約/, (res) ->
    res.send "まだ予約確認はできないの"

