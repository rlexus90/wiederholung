import { BOT_OPTIONS, languageLevel } from '../const';
import { IAntwort, ICallback, IQuits, IStats } from '../types';
import { getStats, getQuits, saveStats } from './DbHelper';
import { sendMessage } from './sendMessage';
import { formatText } from './sendVerb';

export const pruffAntwort = async (callback: ICallback) => {
  const {
    data,
    from: { id },
  } = callback;

  try {
    console.log('Pruff Antwort');

    const stats: IStats = await getStats(id);
    const quits: IQuits = await getQuits(id);

    console.log(quits.trueAntwort == data);

    const result = quits.trueAntwort == data;

    result
      ? await trueAntwort(stats, quits, id)
      : falseAntwort(stats, quits, id);
  } catch (e) {
    console.log(e);
  }
};

const trueAntwort = async (stats: IStats, quits: IQuits, id: number) => {
  await sendMessage(id, 'Вірно', BOT_OPTIONS);
  await sendMessage(id, formatText(quits.translate), BOT_OPTIONS);

  const allAntwort = stats.allAntwort + 1;
  const nTrueAntwort = stats.nTrueAntwort + 1;
  const score = Math.round((nTrueAntwort * 100) / allAntwort);
  const level = stats.level;

  if (score >= 75 && allAntwort > 5) {
    const newLevel = level + 1 === 5 ? 5 : level + 1;
    const newStats: IStats = {
      level: newLevel,
      allAntwort: 0,
      nTrueAntwort: 0,
      score: 0,
    };
    await saveStats(newStats, id);
    return;
  }
  const newStats: IStats = { score, nTrueAntwort, level, allAntwort };
  await saveStats(newStats, id);
};

const falseAntwort = async (stats: IStats, quits: IQuits, id: number) => {
  await sendMessage(id, 'Не вірно', BOT_OPTIONS);
  await sendMessage(id, formatText(quits.translate), BOT_OPTIONS);

  const allAntwort = stats.allAntwort + 1;
  const nTrueAntwort = stats.nTrueAntwort;
  const score = Math.round((nTrueAntwort * 100) / allAntwort);
  const level = stats.level;

  if (score < 50 && allAntwort > 5) {
    const newLevel = level - 1 === 0 ? 0 : level - 1;
    const newStats: IStats = {
      level: newLevel,
      allAntwort: 0,
      nTrueAntwort: 0,
      score: 0,
    };
    await saveStats(newStats, id);
    return;
  }
  const newStats: IStats = { score, nTrueAntwort, level, allAntwort };
  await saveStats(newStats, id);
};

export const myStats = async (id: number): Promise<IAntwort> => {
  const stats: IStats = await getStats(id);
  const { score, level, allAntwort, nTrueAntwort } = stats;

  const message = `*Поточний рівень:* ${languageLevel.get(+level)}
		 *Рейтинг:* ${score}
		 *Вірні відповіді:* ${nTrueAntwort}
		 *Всього відповідей* ${allAntwort}`;

  return { chatId: id, text: message };
};
