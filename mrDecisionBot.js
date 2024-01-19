const Hangul = require("hangul-js");
const { V, E, Analyzer } = require("eomi-js");

const positive = ["ㅏ", "ㅑ", "ㅗ", "ㅛ", "ㅘ"];
const verbs = [];
const ends = [
  new E("(아/어)"),
  new E("ㄹ까", "을까"),
  new E("냐"),
];

const explicitCommands = [
  { command: /^(?:김결정|결정아|김결쩡|깅결정|김결전|김경절|심결정|김굘정|김경정|김경전|김결잔|긴결정|긴결전|긴경정|긴경절)!+\s?/, behavior: "customPick" },
];

const fallbackTexts = [
  "귀찮으니깐 말 좀 그만 걸어",
  "그만해라",
  "오빠 바쁘다",
  "하아..",
  "---- 먹금 —--",
  "질척거리는 건 집착이거든?",
  "다시 돌아왔다고 너무 반가워하지 마라",
  "오빠는 1분내로 답해준다. 재촉하지 마라",
  "쯧쯧. 여태 못 정했냐?",
  "나는 결정을 도와주는 거지 네 말상대를 해 주는 게 아니야",
  "구질구질하게 왜 이래?",
  "나한테 왜 자꾸 이래?",
];

const keywordList = [
  { // 해 말아
    keyword: /(\S+)\s?(?:말아|말어)(?:\?|\S*$)/, behavior: "pickOne", parameter: [
      "(아/어)", "지 마",
      "(아/어)", "지 마",
      "자", "지 말자",
      "(아/어)라", "지 말어",
    ]
  },
  { // 할까 말까
    keyword: /(\S+까)\s?말까(?:\?|\S*$)/, behavior: "pickOne", parameter: [
      "(아/어)", "지 마",
      "(아/어)", "지 마",
      "자", "지 말자",
      "(아/어)라", "지 말어",
    ]
  },
  { // 하나 마냐
    keyword: /(\S+냐)\s?마냐(?:\?|\S*$)/, behavior: "pickOne", parameter: [
      "(아/어)", "지 마",
      "(아/어)", "지 마",
      "자", "지 말자",
      "(아/어)라", "지 말어",
    ]
  },
  { // 할까 안 할까
    keyword: /(\S+까)\s안\s?(\S+까)(?:\?|\S*$)/, behavior: "pickOne", parameter: [
      "(아/어)", "진 않음",
      "(아/어)", "진 않음",
      ("ㄴ다", "는다"), "지 않을듯",
      ("ㄹ듯", "을듯"), "지 않을 거 같다",
    ]
  },
  { // 하냐 안 하냐
    keyword: /(\S+냐)\s안\s?(\S+냐)(?:\?|\S*$)/, behavior: "pickOne", parameter: [
      "(아/어)", "진 않음",
      "(아/어)", "진 않음",
      ("ㄴ다", "는다"), "지 않을듯",
      ("ㄹ듯", "을듯"), "지 않을 거 같다",
    ]
  },

  { keyword: /콜\?/, behavior: "pickOne", parameter: ["콜", "노콜", "콜", "ㄴㄴ", "완전콜", "별로.."] },

  {
    keyword: /(?:어때|어떄|어떠심|어떰|어떻냐|어떻슴|어뗘|워뗘)(?:\?|\S*$)/,
    behavior: "pickOne",
    parameter: ["굳", "별론데", "괜찮네", "ㄴㄴ", "좋으다", "그닥.."],
  },

  { keyword: /결정\?/, behavior: "pickOne", parameter: ["결정", "안결정", "결ㅋ정ㅋ", "ㄴㄴ", "ㅇㅋ", "난 반댈세"] },

  { keyword: /괜춘\?/, behavior: "pickOne", parameter: ["괜춘", "안괜춘", "콜", "ㄴㄴ", "완전괜춘", "낫괜춘"] },
  { keyword: /괜춘한가(?:\?|\S*$)/, behavior: "pickOne", parameter: ["괜춘", "안괜춘", "콜", "ㄴㄴ", "완전괜춘", "낫괜춘"] },
  { keyword: /갠춘\?/, behavior: "pickOne", parameter: ["갠춘", "안갠춘", "콜", "ㄴㄴ", "완전갠춘", "낫갠춘"] },
  { keyword: /갠춘한가(?:\?|\S*$)/, behavior: "pickOne", parameter: ["갠춘", "안갠춘", "콜", "ㄴㄴ", "완전갠춘", "낫갠춘"] },

  { keyword: /괜찮아\?/, behavior: "pickOne", parameter: ["괜찮아", "별로야", "콜", "ㄴㄴ", "괜찮!", "안괜찮"] },
  { keyword: /괜찮나(?:\?|\S*$)/, behavior: "pickOne", parameter: ["괜찮아", "별로야", "콜", "ㄴㄴ", "괜찮!", "안괜찮"] },
  { keyword: /괜찮냐(?:\?|\S*$)/, behavior: "pickOne", parameter: ["괜찮아", "별로야", "콜", "ㄴㄴ", "괜찮!", "안괜찮"] },
  { keyword: /괜찮음\?/, behavior: "pickOne", parameter: ["괜찮아", "별로야", "콜", "ㄴㄴ", "괜찮!", "안괜찮"] },
  { keyword: /괜찮겠어\?/, behavior: "pickOne", parameter: ["괜찮아", "별로야", "콜", "ㄴㄴ", "괜찮!", "안괜찮"] },
  { keyword: /괜찮을까(?:\?|\S*$)/, behavior: "pickOne", parameter: ["괜찮아", "별로야", "콜", "ㄴㄴ", "괜찮!", "안괜찮"] },

  { keyword: /(?:김결정|결정아|결정이|김결쩡|깅결정|김결전|김경절|심결정|김굘정|김경정|김경전|김결잔|긴결정|긴결전|긴경정|긴경절)/, behavior: "fallback" },
];

// 아직 안 옮김
const keywordList2 = [
  { keyword: /(\S+)냐[^냐]*마냐/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)까[^까]*말까/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?돼[^돼]*말아야\s?돼/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?하나[^나]*말아야\s?하나/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?하냐[^냐]*말아야\s?하냐/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?할까[^까]*말아야\s?할까/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?되나[^나]*말아야\s?되나/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?되냐[^냐]*말아야\s?되냐/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?될까[^까]*말아야\s?될까/, behavior: "pickOne", parameter: ["$", "말어", "$자", "말자", "$라", "$지 마", "$", "$지 마"] },
  { keyword: /(\S+)야\s?돼\?/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?해\?/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?됨\?/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?함\?/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?되나(?:\?|\S*$)/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?하나(?:\?|\S*$)/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?되냐(?:\?|\S*$)/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?하냐(?:\?|\S*$)/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?될까(?:\?|\S*$)/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야\s?할까(?:\?|\S*$)/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)야겠지\?/, behavior: "pickOne", parameter: ["$야지", "$지 마", "$야 돼", "안 $도 돼", "$야 돼", "$지 말든지"] },
  { keyword: /(\S+)도\s?돼\?/, behavior: "pickOne", parameter: ["돼", "안 돼", "$도 돼", "$면 안 되지", "$든지", "ㄴㄴ"] },
  { keyword: /(\S+)도\s?됨\?/, behavior: "pickOne", parameter: ["돼", "안 돼", "$도 돼", "$면 안 되지", "$든지", "ㄴㄴ"] },
  { keyword: /(\S+)도\s?되나(?:\?|\S*$)/, behavior: "pickOne", parameter: ["돼", "안 돼", "$도 돼", "$면 안 되지", "$든지", "ㄴㄴ"] },
  { keyword: /(\S+)도\s?되냐(?:\?|\S*$)/, behavior: "pickOne", parameter: ["돼", "안 돼", "$도 돼", "$면 안 되지", "$든지", "ㄴㄴ"] },
  { keyword: /(\S+)도\s?될까(?:\?|\S*$)/, behavior: "pickOne", parameter: ["돼", "안 돼", "$도 돼", "$면 안 되지", "$든지", "ㄴㄴ"] },
];

const verb = function (a, b) {
  verbs.push(new V(a, b));
}

const behaviors = {
  pickOne: function (matchResult, list) {
    let tmpResult = {};
    let response = list[Math.floor(Math.random() * list.length)];
    tmpResult.q = matchResult.input;
    if (matchResult[1]) {
      let term = matchResult[1].slice(0, -2);
      let check = (char) => matchResult[1].endsWith(char);
      switch (true) {
        case ["가냐", "가", "갈까"].some(check): verb(term + "가다", term + "가"); break;
        case ["같냐", "같아", "같을까"].some(check): verb(term + "같다", term + "같아"); break;
        case ["나냐", "나", "날까"].some(check): verb(term + "나다", term + "나"); break;
        case ["라냐", "라", "랄까"].some(check): verb(term + "라다", term + "라"); break;
        case ["마냐", "말아", "말까"].some(check): verb(term + "말다", term + "말아"); break;
        case ["사냐", "사", "살까"].some(check): verb(term + "사다", term + "사"); break;
        case ["싸냐", "싸", "쌀까"].some(check): verb(term + "싸다", term + "싸"); break;
        case ["자냐", "자", "잘까"].some(check): verb(term + "자다", term + "자"); break;
        case ["차냐", "차", "찰까"].some(check): verb(term + "차다", term + "차"); break;
        case ["타냐", "타", "탈까"].some(check): verb(term + "타다", term + "타"); break;
        case ["파냐", "팔아", "팔까"].some(check): verb(term + "팔다", term + "팔아"); break;
        case ["하냐", "해", "할까"].some(check): verb(term + "하다", term + "해"); break;
        case ["거냐", "걸어", "걸까"].some(check): verb(term + "걸다", term + "걸어"); break;
        case ["서냐", "서", "설까"].some(check): verb(term + "서다", term + "서"); break;
        case ["두냐", "둬", "둘까"].some(check): verb(term + "두다", term + "둬"); break;
        case ["수냐", "숴", "술까"].some(check): verb(term + "수다", term + "숴"); break;
        case ["우냐", "워", "울까"].some(check): verb(term + "우다", term + "워"); break;
        case ["죽냐", "죽어", "죽을까"].some(check): verb(term + "죽다", term + "죽어"); break;
        case ["퀴냐", "퀴어", "퀼까"].some(check): verb(term + "퀴다", term + "퀴어"); break;
        case ["그냐", "가", "거", "글까"].some(check): verb(term + "그다", term + (positive.includes(Hangul.d(term).pop()) ? "가" : "거")); break;
        case ["르냐", "라", "러", "를까"].some(check): verb(term + "르다", (Hangul.endsWithConsonant(term) ? term : Hangul.a(term + "ㄹ")) + (positive.includes(Hangul.d(term).pop()) ? "라" : "러")); break;
        case ["기냐", "겨", "길까"].some(check): verb(term + "기다", term + "겨"); break;
        case ["리냐", "려", "릴까"].some(check): verb(term + "리다", term + "려"); break;
        case ["이냐", "여", "일까"].some(check): verb(term + "이다", term + "여"); break;
        case ["지냐", "져", "질까"].some(check): verb(term + "지다", term + "져"); break;
        case ["히냐", "혀", "힐까"].some(check): verb(term + "히다", term + "혀"); break;

        case ["으냐", "아", "어", "을까"].some(check): verb(term + "으다", term + (positive.includes(Hangul.d(term).pop()) ? "아" : "어")); break;
        default: break;
      }
      response = new Analyzer(verbs, ends).analyze(matchResult[1])[0][0]._(list[Math.floor(Math.random() * list.length)]);
    }
    tmpResult.a = response;
    return tmpResult;
  },

  customPick: function (matchResult) {
    let tmpResult = {};
    tmpResult.q = matchResult.input;
    let optionText = matchResult.input.slice(matchResult[0].length + matchResult.index).trim();
    let options = optionText.split(",");
    if (options.length <= 1) {
      options = optionText.split(" ");
    }
    if (options.length <= 1) {
      // return fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim();
      tmpResult.a = fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim();
      return tmpResult;
    }
    // return options[Math.floor(Math.random() * options.length)].trim();
    tmpResult.a = options[Math.floor(Math.random() * options.length)].trim();
    return tmpResult;
  },

  fallback: function (matchResult) {
    let tmpResult = {};
    tmpResult.q = matchResult.input;
    // return fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim();
    tmpResult.a = fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)].trim();
    return tmpResult;
  },
};

const checkKeywordAndGetResponse = function (text) {
  let retData = null;
  if (text === undefined) return null;

  // Check explicit commands first
  for (let i = 0; i < explicitCommands.length; i++) {
    let match = text.trim().match(new RegExp(explicitCommands[i].command));
    if (match === null) {
      continue;
    } else {
      retData = behaviors[explicitCommands[i].behavior](match, explicitCommands[i].parameter);
      return retData;
    }
  }

  // Check keywords
  for (let i = 0; i < keywordList.length; i++) {
    let match = text.trim().match(new RegExp(keywordList[i].keyword));
    if (match === null) {
      continue;
    } else {
      retData = behaviors[keywordList[i].behavior](match, keywordList[i].parameter);
      return retData;
    }
  }
  return null;
};

const mrDecisionBot = {
  process: function (update) {
    if (update.message === null) return null;
    let message = update.message.text;
    return checkKeywordAndGetResponse(message);
  },
  discord: function (content) {
    if (content === null) return null;
    return checkKeywordAndGetResponse(content);
  },
  helpMessage:
    "돌아온 김결정이다.\n말이 많진 않지만 결정적인 순간에 한마디 하는 성격이다.\n귀찮으니깐 웬만하면 말 걸지 마라.\n꼭 내가 결정해야겠는 일이 있으면 \"김결정! 부먹 찍먹 중립\" 이런 식으로 물어보도록.\n잘 부탁한다.",
  aboutText: "https://twitter.com/MrDecision_bot",
};

module.exports = mrDecisionBot;
