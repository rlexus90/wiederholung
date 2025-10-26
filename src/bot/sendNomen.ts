import { IExample, Imsg, INomen, IType, MessageArr } from '../types';
import OpenAI from 'openai';
import { schedule, TEXT } from '../const';
import { sendWithDelay } from './sendWithDellay';

export const sendNomen = async (type: IType, msg: Imsg, openai: OpenAI) => {
  const {
    text,
    chat: { id },
  } = msg;

  const { query, lang } = type;

  try {
    const completion =
      lang === 'de'
        ? await openai.chat.completions.create({
            model: 'gpt-5-mini',
            // temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: TEXT.CONTEXT,
              },
              {
                role: 'system',
                content: TEXT.QUERY_NOMEN,
              },
              {
                role: 'user',
                content: `${query}`,
              },
            ],
          })
        : await openai.chat.completions.create({
            model: 'gpt-5-mini',
            // temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: TEXT.CONTEXT,
              },
              {
                role: 'system',
                content: TEXT.QUERY_TRANSALE,
              },
              {
                role: 'system',
                content: TEXT.QUERY_NOMEN,
              },
              {
                role: 'user',
                content: `${query}`,
              },
            ],
          });

    const antwortGPT = completion.choices[0].message.content as string;
    const antwort: INomen = JSON.parse(antwortGPT);

    console.log(antwort);

    await Promise.all([
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(directMSG(antwort)),
        delay: schedule.get(1) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(directMSG(antwort)),
        delay: schedule.get(2) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(directMSG(antwort)),
        delay: schedule.get(3) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(directMSG(antwort)),
        delay: schedule.get(4) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(directMSG(antwort)),
        delay: schedule.get(5) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(reverseMSG(antwort)),
        delay: schedule.get(6) || 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(directMSG(antwort)),
        delay: schedule.get(7) || 0,
      }),
    ]);
  } catch (e) {
    console.log(e);
  }
};

const formatText = (text: string) => {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
};

const arrText = (arr: IExample[]) => {
  return `${arr.map((ex) => `${formatText(ex.str)}  ${formatText(ex.transl)}`).join('\n')}`;
};

const directMSG = (antwort: INomen): MessageArr => {
  const {
    nomen,
    translation,
    plural,
    examples,
    collocations,
    synonyms,
    antonyms,
    personal_examples,
    word_family,
  } = antwort;

  return {
    message: [
      `${formatText(nomen)}  ${formatText(translation)}
*Plural:* ${formatText(plural)}`,
      ...examples.map(
        (ex) => `${formatText(ex.str)}
||${formatText(ex.transl)}||`
      ),
      `*Collocations:* ${arrText(collocations)}

*Synonyms:* ${arrText(synonyms)}

*Antonyms:* ${arrText(antonyms)}

*Word forms:* ${arrText(word_family)}`,
      ...personal_examples.map(
        (ex) => `${formatText(ex.str)}
||${formatText(ex.transl)}||`
      ),
    ],
  };
};

const reverseMSG = (antwort: INomen): MessageArr => {
  const {
    nomen,
    translation,
    plural,
    examples,
    collocations,
    synonyms,
    antonyms,
    personal_examples,
    word_family,
  } = antwort;

  return {
    message: [
      `${formatText(nomen)}  ${formatText(translation)}
*Plural:* ${formatText(plural)}`,
      ...examples.map(
        (ex) => `||${formatText(ex.str)}||
${formatText(ex.transl)}`
      ),
      `*Collocations:* ${arrText(collocations)}

*Synonyms:* ${arrText(synonyms)}

*Antonyms:* ${arrText(antonyms)}

*Word forms:* ${arrText(word_family)}`,
      ...personal_examples.map(
        (ex) => `||${formatText(ex.str)}||
${formatText(ex.transl)}`
      ),
    ],
  };
};
