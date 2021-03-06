const { template } = require('lodash')
const { twiml } = require('twilio')
const prompt = require('../../config/prompt')

const sayOpt = { language: prompt.language, voice: prompt.voice }

module.exports.hangup = () => {
  const response = new twiml.VoiceResponse()
  response.hangup()
  return response.toString()
}

module.exports.opening = (record, digitUrl, openingAudio) => {
  const options = prompt.options.map((o) =>
    `If ${o.label} please press ${o.key}`
  ).join('. ')
  const fullText = `${prompt.greeting}. ${options}.`
  const response = new twiml.VoiceResponse()
  if (openingAudio) response.play({ loop: 1 }, openingAudio)
  response
    .gather({
      finishOnKey: '',
      numDigits: 1,
      timeout: 20,
      action: digitUrl
    })
    .say(template(fullText)(record), sayOpt)

  return response.toString()
}

module.exports.closing = () => {
  const response = new twiml.VoiceResponse()
  response.say(prompt.closing, sayOpt)
  return response.toString()
}
