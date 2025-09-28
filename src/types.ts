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
  chat_id: string;
  text: string;
};

export type IMessageDelay = {
  chat_id: string;
  text: string;
	delay: number;
};