const { Yongeon, Eomi } = require("eomi-js");
const { V, E } = require("eomi-js");
const { Analyzer } = require("eomi-js");

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

// 예외만 남기고 Fallback 처리 필요
const verbs = [
  new Yongeon("가다", "가"),
  new Yongeon("갑다", "가워"),
  new Yongeon("걸다", "걸어"),
  new Yongeon("곱다", "고와"),
  new Yongeon("굴다", "굴어"),
  // new Yongeon("그다", "가"),
  new Yongeon("잠그다", "잠가"),
  new Yongeon("잠그다", "잠궈"),
  new Yongeon("긋다", "그어"),
  new Yongeon("기다", "기어"),
  new Yongeon("끊기다", "끊겨"),
  new Yongeon("잠기다", "잠겨"),
  new Yongeon("꾸다", "꿔"),
  new Yongeon("바꾸다", "바꿔"),
  new Yongeon("뀌다", "뀌어"),
  new Yongeon("뀌다", "껴"),
  new Yongeon("바뀌다", "바뀌어"),
  new Yongeon("바뀌다", "바껴"),
  new Yongeon("끊다", "끊어"),
  new Yongeon("끓다", "끓어"),
  new Yongeon("잠기다", "잠겨"),
  new Yongeon("꺾다", "꺾어"),
  new Yongeon("끄다", "꺼"),
  new Yongeon("나다", "나"),
  new Yongeon("덧나다", "덧나"),
  new Yongeon("날다", "날아"),
  new Yongeon("낳다", "낳아"),
  new Yongeon("네모낳다", "네모나"),
  new Yongeon("세모낳다", "세모나"),
  new Yongeon("내다", "내"),
  // new Yongeon("너다", "너"),
  new Yongeon("건너다", "건너"),
  new Yongeon("널다", "널어"),
  new Yongeon("넣다", "넣어"),
  new Yongeon("놀다", "놀아"),
  new Yongeon("누다", "눠"),
  new Yongeon("눕다", "누워"),
  new Yongeon("닫다", "닫아"),
  new Yongeon("닫다", "닫어"),
  new Yongeon("달다", "달아"),
  new Yongeon("달다", "달어"),
  new Yongeon("담다", "담아"),
  new Yongeon("담다", "담어"),
  new Yongeon("닿다", "닿아"),
  new Yongeon("대다", "대"),
  new Yongeon("되다", "돼"),
  new Yongeon("듣다", "들어"),
  new Yongeon("들다", "들어"),
  new Yongeon("건들다", "건드려"),
  new Yongeon("흔들다", "흔들어"),
  // new Yongeon("랗다", "래"),
  new Yongeon("동그랗다", "동그래"),
  // new Yongeon("렇다", "래"),
  new Yongeon("그렇다", "그래"),
  new Yongeon("둥그렇다", "둥그래"),
  // new Yongeon("르다", "라"),
  new Yongeon("고르다", "골라"),
  new Yongeon("고르다", "골러"),
  new Yongeon("구르다", "굴러"),
  new Yongeon("기르다", "길러"),
  new Yongeon("누르다", "눌러"),
  new Yongeon("다르다", "달라"),
  new Yongeon("다르다", "달러"),
  new Yongeon("들르다", "들러"),
  new Yongeon("따르다", "따라"),
  new Yongeon("따르다", "따러"),
  new Yongeon("마르다", "말라"),
  new Yongeon("마르다", "말러"),
  new Yongeon("모르다", "몰라"),
  new Yongeon("모르다", "몰러"),
  new Yongeon("바르다", "발라"),
  new Yongeon("바르다", "발러"),
  new Yongeon("빠르다", "빨라"),
  new Yongeon("빠르다", "빨러"),
  new Yongeon("부르다", "불러"),
  new Yongeon("오르다", "올라"),
  new Yongeon("이르다", "일러"),
  new Yongeon("일르다", "일러"),
  new Yongeon("치르다", "치러"),
  new Yongeon("푸르다", "푸르러"),
  new Yongeon("흐르다", "흘러"),
  // new Yongeon("리다", "려"),
  new Yongeon("들리다", "들려"),
  new Yongeon("때리다", "때려"),
  new Yongeon("벌리다", "벌려"),
  new Yongeon("뿌리다", "뿌려"),
  new Yongeon("살리다", "살려"),
  new Yongeon("흐리다", "흐려"),
  new Yongeon("말다", "마"),
  new Yongeon("말다", "말아"),
  new Yongeon("맑다", "맑아"),
  new Yongeon("맞다", "맞아"),
  new Yongeon("맞다", "맞어"),
  new Yongeon("맣다", "매"),
  new Yongeon("매다", "매"),
  new Yongeon("먹다", "먹어"),
  new Yongeon("메다", "메"),
  new Yongeon("묵다", "묵어"),
  new Yongeon("묶다", "묶어"),
  new Yongeon("물다", "물어"),
  new Yongeon("벌다", "벌어"),
  new Yongeon("베다", "베"),
  new Yongeon("보다", "봐"),
  new Yongeon("붙다", "붙어"),
  new Yongeon("빌다", "빌어"),
  new Yongeon("빨다", "빨아"),
  new Yongeon("빻다", "빻아"),
  new Yongeon("빼다", "빼"),
  new Yongeon("사다", "사"),
  new Yongeon("살다", "살아"),
  new Yongeon("서다", "서"),
  new Yongeon("섞다", "섞어"),
  new Yongeon("세다", "세"),
  new Yongeon("수다", "숴"),
  new Yongeon("쉬다", "쉬어"),
  new Yongeon("쉬다", "셔"),
  new Yongeon("숨쉬다", "숨쉬어"),
  new Yongeon("숨쉬다", "숨셔"),
  new Yongeon("시다", "셔"),
  new Yongeon("싫다", "싫어"),
  new Yongeon("심다", "심어"),
  new Yongeon("싸다", "싸"),
  new Yongeon("쌓다", "쌓아"),
  new Yongeon("쎄다", "쎄"),
  new Yongeon("쏘다", "쏴"),
  new Yongeon("쓰다", "써"),
  new Yongeon("애다", "애"),
  new Yongeon("없다", "없어"),
  new Yongeon("열다", "열어"),
  new Yongeon("오다", "와"),
  new Yongeon("우다", "워"),
  new Yongeon("울다", "울어"),
  new Yongeon("웃다", "웃어"),
  // new Yongeon("으다", "아"),
  new Yongeon("모으다", "모아"),
  // new Yongeon("이다", "여"),
  new Yongeon("끓이다", "끓여"),
  new Yongeon("높이다", "높여"),
  new Yongeon("놓이다", "놓여"),
  new Yongeon("먹이다", "먹여"),
  new Yongeon("모이다", "모여"),
  new Yongeon("벌이다", "벌려"),
  new Yongeon("보이다", "보여"),
  new Yongeon("붙이다", "붙여"),
  new Yongeon("섞이다", "섞여"),
  new Yongeon("숙이다", "숙여"),
  new Yongeon("쌓이다", "쌓여"),
  new Yongeon("쓰이다", "쓰여"),
  new Yongeon("죽이다", "죽여"),
  new Yongeon("기죽이다", "기죽여"),
  new Yongeon("줄이다", "줄여"),
  new Yongeon("읽다", "읽어"),
  new Yongeon("입다", "입어"),
  new Yongeon("있다", "있어"),
  new Yongeon("자다", "잡아"),
  new Yongeon("접다", "접어"),
  new Yongeon("졸다", "졸아"),
  new Yongeon("좋다", "좋아"),
  new Yongeon("주다", "줘"),
  new Yongeon("죽다", "죽어"),
  new Yongeon("기죽다", "기죽어"),
  new Yongeon("지다", "져"),
  new Yongeon("만지다", "만져"),
  new Yongeon("짜다", "짜"),
  new Yongeon("찌다", "쪄"),
  new Yongeon("찍다", "찍어"),
  new Yongeon("차다", "차"),
  new Yongeon("추다", "춰"),
  new Yongeon("치다", "쳐"),
  new Yongeon("캐다", "캐"),
  new Yongeon("켜다", "켜"),
  // new Yongeon("퀴다", "퀴어"),
  new Yongeon("할퀴다", "할퀴어"),
  new Yongeon("할퀴다", "할켜"),
  new Yongeon("키다", "켜"),
  new Yongeon("타다", "타"),
  new Yongeon("팔다", "팔아"),
  new Yongeon("팔다", "팔어"),
  new Yongeon("풀다", "풀어"),
  new Yongeon("펴다", "펴"),
  new Yongeon("피다", "펴"),
  new Yongeon("하다", "해"),
  new Yongeon("핥다", "핥아"),
  // new Yongeon("히다", "혀"),
  new Yongeon("괴롭히다", "괴롭혀"),
];

const ends = [
  new Eomi("(아/어)"),
  new Eomi("ㄹ까", "을까"),
  new Eomi("냐"),
];

const keywordList = [
  { // 해 말아
    keyword: /(\S+)\s?(?:말아|말어)(?:\?|\S*$)/, behavior: "pickOne", parameter: [
      "(아/어)", "지 말어",
      "자", "지 말자",
      "(아/어)라", "지 마",
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

const analyzer = new Analyzer(verbs, ends);

const behaviors = {
  pickOne: function (matchResult, list) {
    let tmpResult = {};
    tmpResult.q = matchResult.input;
    let response = matchResult[1]
      ? analyzer.analyze(matchResult[1])[0][0]._(list[Math.floor(Math.random() * list.length)])
      : list[Math.floor(Math.random() * list.length)];
    tmpResult.a = response;
    // tmpResult.a = (matchResult[1]);
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
    '돌아온 김결정이다.\n말이 많진 않지만 결정적인 순간에 한마디 하는 성격이다.\n귀찮으니깐 웬만하면 말 걸지 마라.\n꼭 내가 결정해야겠는 일이 있으면 "김결정! 부먹 찍먹 중립" 이런 식으로 물어보도록.\n잘 부탁한다.',
  aboutText: "https://twitter.com/MrDecision_bot",
};

module.exports = mrDecisionBot;
