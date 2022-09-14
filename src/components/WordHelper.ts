import answers from '@/components/wordle.json'
import * as allWords from 'word-list-json';

export default class WordHelper {
  static wordDict : any;

  static status = {
    "LENGTH": "Please enter a 5-letter word",
    "NOT-A-WORD": "The word is not recognised",
  };
  

  static getDict() {
    if (this.wordDict) return this.wordDict;

    const storedJson = window.localStorage.getItem("word-dict");
    if ((storedJson != null) && (storedJson != "")) return this.setDict(JSON.parse(storedJson));

    let newDict : any = {};
    for (let word of allWords) {
      if (word.length < 5) continue;
      if (word.length > 5) break;
      newDict[word] = true;
    }
    return this.setDict(newDict);
  }

  static setDict(newDict : any) {
    this.wordDict = newDict;
    try {
      window.localStorage.setItem("word-dict", JSON.stringify(this.wordDict));
    } catch (e) {
      console.error("Cannot cache data into local storage");
    }
    return this.wordDict;
  }

  static wordMatching(userInput : string, correctAnswer : string) : any[] {
    let letterIndex : any = {};
    Array.from(correctAnswer).forEach((char, index) => {
      if (!letterIndex[char]) letterIndex[char] = [];
      letterIndex[char].push(index);
    });
    
    return Array.from(userInput).map((char, userCharIndex) => {
      if (!letterIndex[char]) return "false";
      let correctIndex = letterIndex[char].shift();
      if (!letterIndex.length) letterIndex[char] = undefined;
      if (correctIndex === userCharIndex) return "true";
      return "POS";
    });
  }

  static getTheWord() : string {
    const startDate = new Date(2021, 5, 0, 0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysFromStart = (today.getTime() - startDate.getTime()) / (3600*24*1000);
    return answers[daysFromStart % answers.length]; 
  }

  static check(word : string) {
    if (word.length !== 5) return this.status.LENGTH;
    
    const correctAnswer = this.getTheWord();
    if (word === correctAnswer) return Array.from(word).map(x => "true");
    if (!this.getDict()[word]) return this.status['NOT-A-WORD'];

    return this.wordMatching(word, correctAnswer);
  }
}