import { IExample, Imsg, IType, IVerb, MessageArr } from '../types';
import OpenAI from 'openai';
import { TEXT } from '../const';
import { sendWithDelay } from './sendWithDellay';

export const sendVerb = async (type: IType, msg: Imsg, openai: OpenAI) => {
  const {
    text,
    chat: { id },
  } = msg;

  const { query, lang } = type;

  console.log(query);

  try {
    const completion =
      lang === 'de'
        ? await openai.chat.completions.create({
            model: '',
            temperature: 0.4,
            messages: [
              {
                role: 'system',
                content: TEXT.CONTEXT,
              },
              {
                role: 'system',
                content: TEXT.QUERY_VERB,
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
                content: TEXT.QUERY_VERB,
              },
              {
                role: 'user',
                content: `${query}`,
              },
            ],
          });

    const antwortGPT = completion.choices[0].message.content as string;
    const antwort: IVerb = JSON.parse(antwortGPT);

    console.log(antwort);

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

const directMSG = (antwort: IVerb): MessageArr => {
  const {
    verb,
    translation,
    forms,
    examples,
    prepositions,
    collocations,
    synonyms,
    antonyms,
    personal_examples,
  } = antwort;

  return {
    message: [
      `${formatText(verb)}  ${formatText(translation)}`,
      `*Infinitiv:* ${formatText(forms.Infinitiv)}
*Er:* ${formatText(forms.Präsens_3s)}
*Präteritum:* ${formatText(forms.Präteritum)}
*Partizip II:* ${formatText(forms.Partizip_II)}`,
      ...examples.map(
        (ex) => `${formatText(ex.str)}
||${formatText(ex.transl)}||`
      ),
      `*Prepositions:* ${arrText(prepositions)}

*Collocations:* ${arrText(collocations)}

*Synonyms:* ${arrText(synonyms)}

*Antonyms:* ${arrText(antonyms)}`,
      ...personal_examples.map(
        (ex) => `${formatText(ex.str)}
||${formatText(ex.transl)}||`
      ),
    ],
  };
};
const reverseMSG = (antwort: IVerb): MessageArr => {
  const {
    verb,
    translation,
    forms,
    examples,
    prepositions,
    collocations,
    synonyms,
    antonyms,
    personal_examples,
  } = antwort;
  return {
    message: [
      `${formatText(verb)}  ${formatText(translation)}`,
      `*Infinitiv:* ${formatText(forms.Infinitiv)}
*Er:* ${formatText(forms.Präsens_3s)}
*Präteritum:* ${formatText(forms.Präteritum)}
*Partizip II:* ${formatText(forms.Partizip_II)}`,
      ...examples.map(
        (ex) => `||${formatText(ex.str)}||
${formatText(ex.transl)}`
      ),
      `*Prepositions:* ${arrText(prepositions)}

*Collocations:* ${arrText(collocations)}

*Synonyms:* ${arrText(synonyms)}

*Antonyms:* ${arrText(antonyms)}`,
      ...personal_examples.map(
        (ex) => `||${formatText(ex.str)}||
${formatText(ex.transl)}`
      ),
    ],
  };
};
