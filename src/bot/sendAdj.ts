import { IAdj, IExample, Imsg, IType, MessageArr } from '../types';
import OpenAI from 'openai';
import { TEXT } from '../const';
import { sendWithDelay } from './sendWithDellay';

export const sendAdj = async (type: IType, msg: Imsg, openai: OpenAI) => {
  const {
    text,
    chat: { id },
  } = msg;

  const { query, lang } = type;

  try {
    const completion =
      lang === 'de'
        ? await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            temperature: 0.4,
            messages: [
              {
                role: 'system',
                content: TEXT.CONTEXT,
              },
              {
                role: 'system',
                content: TEXT.QUERY_ADJ,
              },
              {
                role: 'user',
                content: `${query}`,
              },
            ],
          })
        : await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            temperature: 0.4,
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
                content: TEXT.QUERY_ADJ,
              },
              {
                role: 'user',
                content: `${query}`,
              },
            ],
          });

    const antwortGPT = completion.choices[0].message.content as string;
    const antwort: IAdj = JSON.parse(antwortGPT);

    console.log(completion.choices[0].message.content);

    await Promise.all([
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(directMSG(antwort)),
        delay: 0,
      }),
      await sendWithDelay({
        chat_id: id,
        text: JSON.stringify(reverseMSG(antwort)),
        delay: 60,
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

const directMSG = (antwort: IAdj): MessageArr => {
  const {
    adjective,
    translation,
    comparative,
    superlative,
    examples,
    collocations,
    synonyms,
    antonyms,
    usage_types,
    personal_examples,
  } = antwort;

  return {
    message: [
      `${formatText(adjective)}  ${formatText(translation)}
 ${formatText(comparative)}
 ${formatText(superlative)}`,
      ...examples.map(
        (ex) => `${formatText(ex.str)}
||${formatText(ex.transl)}||`
      ),
      `*Collocations:* ${arrText(collocations)}`,
      `*Synonyms:* ${arrText(synonyms)}`,
      `*Antonyms:* ${arrText(antonyms)}`,

      ((usage_types) => {
        return `*Usage types* 
${usage_types.map((ut, ind) => `${ind + 1} *${formatText(ut.type)}* ${formatText(ut.example)}`).join('\n')}`;
      })(usage_types),

      ...personal_examples.map(
        (ex) => `${formatText(ex.str)}
||${formatText(ex.transl)}||`
      ),
    ],
  };
};

const reverseMSG = (antwort: IAdj): MessageArr => {
  const {
    adjective,
    translation,
    comparative,
    superlative,
    examples,
    collocations,
    synonyms,
    antonyms,
    usage_types,
    personal_examples,
  } = antwort;

  return {
    message: [
      `${formatText(adjective)}  ${formatText(translation)}
 ${formatText(comparative)}
 ${formatText(superlative)}`,
      ...examples.map(
        (ex) => `||${formatText(ex.str)}||
${formatText(ex.transl)}`
      ),
      `*Collocations:* ${arrText(collocations)}`,
      `*Synonyms:* ${arrText(synonyms)}`,
      `*Antonyms:* ${arrText(antonyms)}`,

      ((usage_types) => {
        return `*Usage types* 
${usage_types.map((ut, ind) => `${ind + 1} *${formatText(ut.type)}* ${formatText(ut.example)}`).join('\n')}`;
      })(usage_types),

      ...personal_examples.map(
        (ex) => `||${formatText(ex.str)}||
${formatText(ex.transl)}`
      ),
    ],
  };
};
