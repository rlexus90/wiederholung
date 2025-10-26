export interface Imsg {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    language_code: string;
  };
  chat: {
    id: number;
    first_name: string;
    username: string;
    type: string;
  };
  date: number;
  text: string;
  voice?: {
    duration: number;
    mime_type: string;
    file_id: string;
    file_unique_id: string;
    file_size: number;
  };
  photo?: IPhoto[];
}

export interface IPhoto {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  width: number;
  height: number;
}

export interface IAntwort {
  chatId: number;
  text: string;
  additionalMSG?: {
    chatId: number;
    text: string;
  };
}

export type User = {
  userId: number;
  Name: string;
  lang: string;
  WS: string[];
};

export enum LANGUAGES {
  de = 'de',
  uk = 'uk',
  ru = 'ru',
}

export type IWort = {
  id: string;
  wort: string;
};

export type IMessage = {
  chat_id: number;
  text: string;
};

export type IMessageDelay = {
  chat_id: number;
  text: string;
  delay: number;
};
export type MessageArr = {
  message: string[];
};

export type IType = {
  lang: 'ukr' | 'de';
  type: 'verb' | 'nomen' | 'adjektive' | 'andere';
  query: string;
};

export type IGptAntwortVerb = {
  str: string;
  example1: { str: string; transl: string };
  example2: { str: string; transl: string };
  example3: { str: string; transl: string };
  example4: { str: string; transl: string };
  Präteritum: {
    example: string;
    translate: string;
  };
  Perfekt: {
    example: string;
    translate: string;
  };
  PartizipII: {
    example: string;
    translate: string;
  };
  KonjunktivII: {
    example: string;
    translate: string;
  };
};

export type IVerb = {
  verb: string;
  translation: string;
  forms: {
    Infinitiv: string;
    Präsens_3s: string;
    Präteritum: string;
    Partizip_II: string;
  };
  examples: IExample[];

  prepositions: IExample[];
  collocations: IExample[];

  synonyms: IExample[];
  antonyms: IExample[];
  personal_examples: IExample[];
};

export type IExample = {
  str: string;
  transl: string;
};

export type INomen = {
  nomen: string;
  translation: string;
  plural: string;
  examples: IExample[];
  collocations: IExample[];
  synonyms: IExample[];
  antonyms: IExample[];
  word_family: IExample[];
  personal_examples: IExample[];
};
export type IUsage = {
  type: string;
  example: string;
};

export type IAdj = {
  adjective: string;
  translation: string;
  comparative: string;
  superlative: string;
  examples: IExample[];
  collocations: IExample[];
  synonyms: IExample[];
  antonyms: IExample[];
  usage_types: IUsage[];
  personal_examples: IExample[];
};

export type IDbSave = {
  id: number;
  WordArray: string[];
};

export type IDerDieDas = {
  word: string;
  translation: string;
  part_of_speech: string;
  example: string;
  example_translation: string;
};

export type IDerDieDasAntwort = {
  words: IDerDieDas[];
};

export type IMistakeExample = {
  de: string;
  ua: string;
};

export type IMistake = {
  error_name: string;
  level: string;
  category: string;
  wrong_example: string;
  correct_example: string;
  explanation_ua: string;
  examples: IMistakeExample[];
  tips: string[];
};

export type IExpression = {
  expression: string;
  meaning_de: string;
  meaning_ua: string;
  tip: string;
  examples: {
    sentence: string;
    translation: string;
  }[];
};

export type IStats = {
  level: number;
  allAntwort: number;
  nTrueAntwort: number;
  score: number;
};

export type IQuits = {
  phrase: string;
  translate: string;
  variant1: string;
  variant2: string;
  variant3: string;
  variant4: string;
  trueAntwort: number;
};

export const languageLevel = new Map<number, string>([
  [0, 'A1'],
  [1, 'A2'],
  [2, 'B1'],
  [3, 'B2'],
  [4, 'C1'],
  [5, 'C2'],
]);

export type ICallback = {
  from: {
    id: number;
  };
  data: number;
};
