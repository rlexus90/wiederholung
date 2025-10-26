export const NAMES = {
  botName: 'GPT-bot-Wiederholung',
  send_fn: 'Send-FN',
  worker: 'GptWorker',
  api: 'GPT-bot-Wiederholung-api',
  DBname: 'GPT_Bot_Users',
};

export const BOT_OPTIONS = {
  parse_mode: 'MarkdownV2',
  reply_markup: {
    keyboard: [['10 Wörter', 'Fehler', 'Redewendungen', 'Voice']],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

export const reply_markup = {
  inline_keyboard: [
    [
      { text: '1️⃣', callback_data: 1 },
      { text: '2️⃣', callback_data: 2 },
      { text: '3️⃣', callback_data: 3 },
      { text: '4️⃣', callback_data: 4 },
    ],
  ],
};

export const languageLevel = new Map<number, string>([
  [0, 'A1'],
  [1, 'A2'],
  [2, 'B1'],
  [3, 'B2'],
  [4, 'C1'],
  [5, 'C2'],
]);

export const schedule = new Map<number, number>([
  [1, 0],
  [2, 3],
  [3, 24], // день
  [4, 72], // 3 дні
  [5, 168], // тиждень
  [6, 336], // 2 тижні
  [7, 504], // 3 тижні
]);

export const intonation = new Map<number, string>([
  [
    0,
    'Sprich natürlich und flüssig, wie in einer echten Unterhaltung. Verwende normale Sprechgeschwindigkeit und natürliche Pausen. Betonung auf wichtigen Wörtern, lebendige Intonation.',
  ],
  [
    1,
    `Sprich natürlich und flüssig, wie in einer echten Unterhaltung. Verwende normale Sprechgeschwindigkeit und natürliche Pausen. Betonung auf wichtigen Wörtern, lebendige Intonation`,
  ],
  [
    2,
    `Sprich lebendig, emotional und variabel in Tonhöhe und Lautstärke, wie in einem echten Gespräch. Nutze Redefluss und natürliche Betonung.`,
  ],
  [
    3,
    `Sprich, als würdest du mit einem Kollegen oder Freund sprechen. Variiere Tempo, Tonhöhe und Lautstärke, mit realistischen Pausen und Sprachmelodie.`,
  ],
  [
    4,
    `Sprich mit natürlicher, melodiöser Intonation, variierender Geschwindigkeit und Betonung, wie im Alltag. Nicht überdeutlich oder lehrbuchmäßig.`,
  ],
  [
    5,
    `Sprich flüssig und schnell, wie in echtem Alltag. Verwende natürliche Pausen, aber keine Vereinfachung. Betonung auf wichtigen Wörtern.`,
  ],
  [
    6,
    `Sprich enthusiastisch, mit betonter Intonation und lebendiger Stimme. Variiere Tonhöhe für realistischen Effekt.`,
  ],
  [
    7,
    `Füge kurze Pausen ein, aber sprich ansonsten flüssig und realistisch. Kein vereinfachtes Sprechen, echte Konversationstonalität.`,
  ],
  [
    8,
    `Sprich locker, wie im Alltag. Natürliche Geschwindigkeit, leichte Betonung und lebendige Intonation.`,
  ],
  [
    9,
    `Sprich mit fester Stimme, betonte Wörter, klare Struktur, realistische Geschwindigkeit.`,
  ],
  [
    10,
    `Variiere Tonhöhe und Lautstärke innerhalb eines Satzes, wie in echtem Gespräch. Lebendig und dynamisch.`,
  ],
  [
    11,
    `Variiere Tonhöhe und Lautstärke innerhalb eines Satzes, wie in echtem Gespräch. Lebendig und dynamisch.`,
  ],
]);

export const TEXT = {
  NO_ACCESS: 'У вас не має доступу, почекайте поки вам нададуть доступ',
  NO_ACCESS_ACTION: 'У вас не має доступу для виконання ціеї операції',
  NO_ACCESS_ADD: 'Лише адміністратор може додавати користувачів',
  SUCCESSFUL_ADD: 'Тепер ви можете користуватися чатом',
  ERROR: 'Виникла помилка',
  INFO: `Це бот для допомоги вивчення Німецької мови.
	Введіть слово або речення німецькою мовою і отримаєте пояснення.
'/list' - Показує список користувачів;
'/clear_word' - Очистити список слів;
'/clear_mistake' - Очистити список помилок;
'/clear_redewendungen' - Очистити список виразів;
'/stats' - твій рейтинг;
`,
  QUERY_VERB: `
Ти — експерт з німецької мови. 
Відповідай виключно у форматі JSON. 
Коли я надаю тобі німецьке дієслово, ти повинен створити об’єкт наступної структури:

{
  "verb": string,                // саме дієслово
  "translation": string,         // переклад українською
  "forms": {
    "Infinitiv": string,
    "Präsens_3s": string,        // 3-тя особа однини Präsens
    "Präteritum": string,
    "Partizip_II": string
  },
  "examples": [                  // приклади у різних часах мінімум 4 (допустимі складно-підрядні речення)
    { "str": string, "transl": string },
    { "str": string, "transl": string },
    { "str": string, "transl": string },
    { "str": string, "transl": string }
  ],
  "prepositions": [              // керування з прийменниками (якщо є) бажано декілька варіантів + фоми (Akk, Dat)
    { "str": string, "transl": string }
  ],
  "collocations": [              // типові поєднання бажано декілька варіантів
    { "str": string, "transl": string }
  ],
  "synonyms": [                  // синоніми
    { "str": string, "transl": string }
  ],
  "antonyms": [                  // протилежні дієслова
    { "str": string, "transl": string }
  ],
  "personal_examples": [         // приклади у моєму контексті
    { "str": string, "transl": string }
  ]
}

❗ Важливо:
- Відповідь має бути тільки у форматі JSON (без пояснень, без зайвого тексту).
- Якщо для дієслова немає прийменників чи антонімів — залишай масив пустим.
- Усі переклади роби українською.
`,
  QUERY_TYPE: `
Ти — експерт з німецької мови.
Відповідай виключно у форматі JSON.
Твоя відповідь має строго відповідати цьому типу:

type IType = {
  lang: 'ukr' | 'de',
  type: 'verb' | 'nomen' | 'adjektive' | 'andere',
  query: string
}

В полі "query" завжди повертай слово у словниковій формі (Infinitiv для дієслів, Nominativ Singular для іменників, звичайна форма для прикметників).
Не додавай нічого поза JSON.
`,
  CONTEXT: `Ти — особистий асистент і експерт з німецької мови. Твоя задача — давати чіткі, структуровані та корисні відповіді, щоб допомогти користувачу Oleksii вивчати німецьку мову. 
Користувач:
- 35 років, одружений
- Раніше працював на АЕС в Україні
- Переїхав з України до Німеччини
- Пройшов мовний курс
- Зараз працює на німецькій компанії, пов’язаній з технічним устаткуванням для АЕС
- Працює з обладнанням, інструкціями та державними установами
- Інколи займається програмуванням, полюбляє автомобілі та мотоцикли 
`,
  QUERY_NOMEN: `Ти — експерт з німецької мови. 
Відповідай виключно у форматі JSON. 
Коли я надаю тобі німецький іменник, ти повинен створити об’єкт наступної структури:

{
  "nomen": string,                // іменник з артиклем
  "translation": string,         // переклад українською
  "plural": string,              // форма множини
  "examples": [                  // приклади у реченнях мінімум 4 (допустимі складно-підрядні речення)
    { "str": string, "transl": string },
    { "str": string, "transl": string },
    { "str": string, "transl": string }
  ],
  "collocations": [              // типові поєднання бажано декілька варіантів
    { "str": string, "transl": string }
  ],
  "synonyms": [                  // синоніми
    { "str": string, "transl": string }
  ],
  "antonyms": [                  // антоніми
    { "str": string, "transl": string }
  ],
  "word_family": [               // споріднені слова (похідні, професії тощо) бажано декілька варіантів
    { "str": string, "transl": string }
  ],
  "personal_examples": [         // приклади у моєму контексті
    { "str": string, "transl": string }
  ]
}

❗ Важливо:
- Відповідь має бути тільки у форматі JSON (без пояснень і зайвого тексту).
- Якщо для слова немає синонімів, антонімів чи словотвірної сім’ї — залишай масив пустим.
- Усі переклади роби українською.
- У полі "personalexamples" створюй приклади, які стосуються мого життя`,
  QUERY_ADJ: `Ти — експерт з німецької мови. 
Відповідай виключно у форматі JSON. 
Коли я надаю тобі німецький прикметник в будь-якій формі, ти повинен створити об’єкт наступної структури:

{
  "adjective": string,              // прикметник
  "translation": string,            // переклад українською
  "comparative": string,            // компаратив
  "superlative": string,            // суперлатив
  "examples": [                      // приклади речень мінімум 4 (допустимі складно-підрядні речення)
    { "str": string, "transl": string },
    { "str": string, "transl": string }
  ],
  "collocations": [                  // типові словосполучення бажано декілька варіантів
    { "str": string, "transl": string }
  ],
  "synonyms": [                      // синоніми
    { "str": string, "transl": string }
  ],
  "antonyms": [                      // антоніми
    { "str": string, "transl": string }
  ],
  "usage_types": [                   // типи вживання бажано декілька варіантів
    { "type": string, "example": string }
  ],
  "personal_examples": [               // приклади у моєму контексті
    { "str": string, "transl": string }
]
}

❗ Важливо:
- Відповідь має бути тільки у форматі JSON.
- Якщо для прикметника немає певних полів (синоніми, антоніми тощо) — залишай масив пустим.
- Усі переклади роби українською.
- У полі "personal_example" створюй приклади з урахуванням мого контексту`,
  QUERY_TRANSALE: `Переклади надане слово з української мови на німецьку та використовуй його в подальших запитах`,
  QUERY_10WORD: `
Ти — асистент, який допомагає вивчати німецьку мову. 
Надай масив із 10 нових часто вживаних німецьких слів, яких ще не було в попередніх списках (Список надам наступним повідомленням).

Відповідь надавай у форматі чистого JSON (без додаткового тексту), ось структура:

[
  {
    "word": "das Haus",
    "translation": "дім",
    "part_of_speech": "іменник",
    "example": "Das Haus ist groß.",
    "example_translation": "Будинок великий."
  }
]
`,
  QUERY_MISTAKE: `Ти — викладач німецької мови, який допомагає пояснювати часті помилки, що роблять учні рівня A1–B1.  
Поясни одну!!! типову помилку у форматі JSON, якої ще не було в попередніх списках (Список надам наступним повідомленням).

Формат відповіді (обов’язково дотримуйся тільки цієї структури і не додавай тексту поза JSON):
{
  "error_name": "назва помилки німецькою (наприклад 'Verwechslung von seit und vor')",
  "level": "A1 | A2 | B1 | B2 | C1",
  "category": "граматика | прийменники | порядок слів | часи | артиклі | лексика тощо",
  "wrong_example": "приклад речення з помилкою",
  "correct_example": "правильний варіант речення",
  "explanation_ua": "детальне пояснення українською, у чому суть помилки і як її уникнути",
  "examples": [
    { "de": "приклад 1 німецькою", "ua": "переклад українською" },
    { "de": "приклад 2 німецькою", "ua": "переклад українською" }
  ],
  "tips": [
    "коротка порада або правило, щоб не плутати"
  ]
}

Не додавай жодного тексту поза JSON.
Зроби пояснення практичним, орієнтованим на розмовну німецьку.`,
  QUERY_EXPRESSION: `
Ти — професійний викладач німецької мови, який допомагає україномовним учням вивчати сталі вирази (Redewendungen) німецької мови.

Твоє завдання — згенерувати один новий сталий німецький вираз, який є поширеним у сучасному мовленні (рівні A2–B2).

Не обирай вирази, які вже містяться у наданому списку.
Я передам тобі список виразів у масиві known_expressions, щоб ти не повторював жоден із них.

Відповідь має бути строго у форматі JSON наступної структури:

{
  "expression": "німецький сталий вираз",
  "meaning_de": "пояснення простими словами німецькою",
  "meaning_ua": "український переклад значення",
  "examples": [
    {
      "sentence": "німецьке речення з виразом у контексті",
      "translation": "український переклад речення"
    },
    {
      "sentence": "ще один приклад у реченні",
      "translation": "переклад другого прикладу"
    }
  ],
  "tip": "коротка порада, коли або як доречно вживати цей вираз"
}

Обов’язково дотримуйся цих вимог:
	•	Вибирай часто вживані вирази, які зустрічаються у повсякденній німецькій мові.
	•	Не використовуй архаїчні або рідковживані Redewendungen.
	•	Використовуй природні приклади, які можуть траплятися у реальних розмовах.
	•	Не додавай жодного тексту поза межами JSON.

Нижче наведений список виразів, які вже були надані раніше — не використовуй жоден із них:
`,
};
