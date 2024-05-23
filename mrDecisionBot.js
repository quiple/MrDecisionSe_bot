import { E, Analyzer } from 'eomi-js'
import verbsKor from './verbsKor.js'

const explicitCommands = [
  {
    command: /^(?:김결정|결정아|김결쩡|깅결정|김결전|김경절|심결정|김굘정|김경정|김경전|김결잔|긴결정|긴결전|긴경정|긴경절)!+\s?/,
    behavior: 'customPick',
  },
]

const fallbackTexts = [
  '귀찮으니깐 말 좀 그만 걸어',
  '그만해라',
  '오빠 바쁘다',
  '하아..',
  '---- 먹금 —--',
  '질척거리는 건 집착이거든?',
  '다시 돌아왔다고 너무 반가워하지 마라',
  '오빠는 1분내로 답해준다. 재촉하지 마라',
  '쯧쯧. 여태 못 정했냐?',
  '나는 결정을 도와주는 거지 네 말상대를 해 주는 게 아니야',
  '구질구질하게 왜 이래?',
  '나한테 왜 자꾸 이래?',
]

const keywordList = [
  { // 해 말아/말어
    keyword: /(\S+)\s?(?:말아|말어)(?:\S*\??$)/,
    behavior: 'pickOne',
    parameter: ['(아/어)', '지 마', '(아/어)라 좀', '지 말지', '자', '지 말자', '(아/어)라', '지 말어', ('려고?', '으려고?'), '(아/어)야겠냐?'],
  },
  { // 할까 (말까)
    keyword: /(?<!야\s?)([^\s될뭘일]+까)(?:\S*\??$|\s?말까\S*\??$)/,
    behavior: 'pickOne',
    parameter: ['(아/어)', '지 마', '(아/어)라 좀', '지 말지', '자', '지 말자', '(아/어)라', '지 말어', ('려고?', '으려고?'), '(아/어)야겠냐?'],
  },
  { // 인가/일까
    keyword: /([^\s뭐]+(?:인가|일까))(?:\S*\??$)/,
    behavior: 'boolean',
    parameter: [`임`, ' 아님', ' 맞음', ' 아니야', ' 맞는듯', ' 아닌듯', ' 맞을걸?', ' 아닐걸?'],
  },
  { // 해야/해도 되나/될까/할까
    keyword: /(\S+(?:도|야))\s?(?:되나|될까|할까)(?:\S*\??$)/,
    behavior: 'pickOne',
    parameter: ['(아/어)야지', ('면 안되지', '으면 안되지'), '(아/어)야 됨', ('면 안됨', '으면 안됨'), '(아/어)라', '지 마', '(아/어)도 될듯', ('면 안될듯', '으면 안될듯'), '(아/어)도 될거 같음?', '(아/어)도 되겠냐?'],
  },
  { // 하냐 (마냐)
    keyword: /(\S+냐)(?:\S*\??$|\s?마냐\S*\??$)/,
    behavior: 'pickOne',
    parameter: ['(아/어)', '기 싫어', ('ㄴ다', '는다'), '는건 좀..', '자', '지 말자', '(아/어)라', '고 싶진 않음', ('라고?', '으라고?'), '겠냐?'],
  },
  { // 했을까
    keyword: /(\S*[갔깠났닸땄랐맜밨빴샀쌌았잤짰찼탔팠갰깼냈댔땠랬맸뱄뺐샜쌨앴쟀쨌챘캤탰팼했얐얬헀겄껐넜떴렀멌벘뻤섰썼었젔쩠첬컸텄펐겠넸뎄뗐렜멨벴셌엤켔헸겼꼈녔뎠뗬렸몄볐뼜셨였졌쪘쳤켰텼폈혔곘옜괐꽜놨뫘봤쐈왔쫬홨괬꽸뇄됐뙜뢨뫴뵀쇘쐤왰좼쬈됬뵜쇴쑀욌붔궜꿨눴뒀뤘뭤붰쉈쒔웠줬쭸췄퉜궸뀄뒸뜄윘뀼읬깄낐딨맀밌빘싰씼있짔칬킸핐힜]을까)(?:\S*\??$)/,
    behavior: 'pickOne',
    parameter: ['(아/어)ㅆ어', '진 않았음', '(아/어)ㅆ음', '진 않았겠지', '(아/어)ㅆ다', '진 않았을듯', '(아/어)ㅆ을듯', '지 않았을거 같다', '(아/어)ㅆ을거 같음?', '(아/어)ㅆ겠냐?'],
  },
  { // 하냐 안 하냐
    keyword: /(\S+냐)\s안\s?\S+냐(?:\S*\??$)/,
    behavior: 'pickOne',
    parameter: ['(아/어)', '기 싫어', ('ㄴ다', '는다'), '는건 좀..', '자', '지 말자', '(아/어)라', '고 싶진 않음', ('라고?', '으라고?'), '겠냐?'],
  },

  { keyword: /콜\?/, behavior: 'pickOne', parameter: ['콜', '노콜', '콜', 'ㄴㄴ', '완전콜', '별로..'] },

  {
    keyword: /(?:어때|어떄|어떰|어뗘|워뗘|어떤가|어떤지(?:어떠|어떡|어떨|어떻)\S+)(?:\S*\??$)/,
    behavior: 'pickOne',
    parameter: ['굳', '별론데', '괜찮네', 'ㄴㄴ', '좋으다', '그닥..'],
  },

  { keyword: /결정\?/, behavior: 'pickOne', parameter: ['결정', '안결정', '결ㅋ정ㅋ', 'ㄴㄴ', 'ㅇㅋ', '난 반댈세'] },

  { keyword: /괜춘\?/, behavior: 'pickOne', parameter: ['괜춘', '안괜춘', '콜', 'ㄴㄴ', '완전괜춘', '낫괜춘'] },
  { keyword: /괜춘한가(?:\S*\??$)/, behavior: 'pickOne', parameter: ['괜춘', '안괜춘', '콜', 'ㄴㄴ', '완전괜춘', '낫괜춘'] },
  { keyword: /갠춘\?/, behavior: 'pickOne', parameter: ['갠춘', '안갠춘', '콜', 'ㄴㄴ', '완전갠춘', '낫갠춘'] },
  { keyword: /갠춘한가(?:\S*\??$)/, behavior: 'pickOne', parameter: ['갠춘', '안갠춘', '콜', 'ㄴㄴ', '완전갠춘', '낫갠춘'] },

  { keyword: /괜찮아\?/, behavior: 'pickOne', parameter: ['괜찮아', '별로야', '콜', 'ㄴㄴ', '괜찮!', '안괜찮'] },
  { keyword: /괜찮나(?:\S*\??$)/, behavior: 'pickOne', parameter: ['괜찮아', '별로야', '콜', 'ㄴㄴ', '괜찮!', '안괜찮'] },
  { keyword: /괜찮냐(?:\S*\??$)/, behavior: 'pickOne', parameter: ['괜찮아', '별로야', '콜', 'ㄴㄴ', '괜찮!', '안괜찮'] },
  { keyword: /괜찮음\?/, behavior: 'pickOne', parameter: ['괜찮아', '별로야', '콜', 'ㄴㄴ', '괜찮!', '안괜찮'] },
  { keyword: /괜찮겠어\?/, behavior: 'pickOne', parameter: ['괜찮아', '별로야', '콜', 'ㄴㄴ', '괜찮!', '안괜찮'] },
  { keyword: /괜찮을까(?:\S*\??$)/, behavior: 'pickOne', parameter: ['괜찮아', '별로야', '콜', 'ㄴㄴ', '괜찮!', '안괜찮'] },

  {
    keyword: /김결정|결정아|결정이|김결쩡|깅결정|김결전|김경절|심결정|김굘정|김경정|김경전|김결잔|긴결정|긴결전|긴경정|긴경절/,
    behavior: 'fallback',
  },
]

const ends = [
  new E('(아/어)'),
  new E('(아/어)도'),
  new E('(아/어)도돼'),
  new E('(아/어)도될까'),
  new E('(아/어)도됐을까'),
  new E('(아/어)ㅆ어도'),
  new E('(아/어)ㅆ어도되나'),
  new E('(아/어)ㅆ어도될까'),
  new E('(아/어)ㅆ어도돼'),
  new E('(아/어)ㅆ어도됐나'),
  new E('(아/어)ㅆ어도됐을까'),
  new E('(아/어)야'),
  new E('(아/어)야돼'),
  new E('(아/어)야될까'),
  new E('(아/어)야됐을까'),
  new E('(아/어)ㅆ어야'),
  new E('(아/어)ㅆ어야되나'),
  new E('(아/어)ㅆ어야될까'),
  new E('(아/어)ㅆ어야돼'),
  new E('(아/어)ㅆ어야됐나'),
  new E('(아/어)ㅆ어야됐을까'),
  new E('ㄹ까', '을까'),
  new E('(아/어)ㅆ을까'),
  new E('(아/어)ㅆ었을까'),
  new E('냐'),
  new E('(아/어)ㅆ냐'),
  new E('(아/어)ㅆ었냐'),
]

const a = new Analyzer(verbsKor, ends)

const behaviors = {
  boolean: function (m, list) {
    let temp = {}
    let res = list[Math.floor(Math.random() * list.length)]
    temp.q = m.input
    if (m[1]) res = m[1].slice(0, -2) + res
    temp.a = res
    return temp
  },

  pickOne: function (m, list) {
    let temp = {}
    let res = list[Math.floor(Math.random() * list.length)]
    temp.q = m.input
    if (m[1]) {
      if (a.analyze(m[1].slice(-5))[0]) {
        res = m[1].slice(0, -5) + a.analyze(m[1].slice(-5))[0][0]._(res)
      } else if (a.analyze(m[1].slice(-4))[0]) {
        res = m[1].slice(0, -4) + a.analyze(m[1].slice(-4))[0][0]._(res)
      } else if (a.analyze(m[1].slice(-3))[0]) {
        res = m[1].slice(0, -3) + a.analyze(m[1].slice(-3))[0][0]._(res)
      } else if (a.analyze(m[1].slice(-2))[0]) {
        res = m[1].slice(0, -2) + a.analyze(m[1].slice(-2))[0][0]._(res)
      } else if (a.analyze(m[1].slice(-1))[0]) {
        res = m[1].slice(0, -1) + a.analyze(m[1].slice(-1))[0][0]._(res)
      } else {
        res = ''
      }
    }
    temp.a = res
    return temp
  },

  customPick: function (matchResult) {
    let tmpResult = {}
    tmpResult.q = matchResult.input
    let optionText = matchResult.input.slice(matchResult[0].length + matchResult.index).trim()
    let options = optionText.split(',')
    if (options.length <= 1) {
      options = optionText.split(' ')
    }
    if (options.length <= 1) {
      // return fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim();
      tmpResult.a = fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim()
      return tmpResult
    }
    // return options[Math.floor(Math.random() * options.length)].trim();
    tmpResult.a = options[Math.floor(Math.random() * options.length)].trim()
    return tmpResult
  },

  fallback: function (matchResult) {
    let tmpResult = {}
    tmpResult.q = matchResult.input
    // return fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim();
    tmpResult.a = fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim()
    return tmpResult
  },
}

const checkKeywordAndGetResponse = function (text) {
  let retData = null
  if (text === undefined) return null

  // Check explicit commands first
  for (let i = 0; i < explicitCommands.length; i++) {
    let match = text.trim().match(new RegExp(explicitCommands[i].command))
    if (match === null) {
      continue
    } else {
      retData = behaviors[explicitCommands[i].behavior](match, explicitCommands[i].parameter)
      return retData
    }
  }

  // Check keywords
  for (let i = 0; i < keywordList.length; i++) {
    let match = text.trim().match(new RegExp(keywordList[i].keyword))
    if (match === null) {
      continue
    } else {
      retData = behaviors[keywordList[i].behavior](match, keywordList[i].parameter)
      return retData
    }
  }
  return null
}

export const mrDecisionBot = {
  process: function (update) {
    if (update.message === null) return null
    let message = update.message.text
    return checkKeywordAndGetResponse(message)
  },
  discord: function (content) {
    if (content === null) return null
    return checkKeywordAndGetResponse(content)
  },
  helpMessage:
    '다시 돌아온 김결정이다.\n말이 많진 않지만 결정적인 순간에 한마디 하는 성격이다.\n귀찮으니깐 웬만하면 말 걸지 마라.\n꼭 내가 결정해야겠는 일이 있으면 "김결정! 부먹 찍먹 중립" 이런 식으로 물어보도록.\n잘 부탁한다.',
  aboutText: 'https://twitter.com/MrDecision_bot',
}
