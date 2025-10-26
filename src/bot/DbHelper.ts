import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { NAMES } from '../const';
import { IQuits, IStats } from '../types';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const dbName = NAMES.DBname;

export const saveWort = async (arr: string[] = [], id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const wordList = Array.isArray(user.wordList) ? user.wordList : [];

    const newWordList = [...wordList, ...arr];

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        wordList: newWordList,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const clearWordList = async (id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        wordList: ['list'],
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const getWordList = async (id: number) => {
  const command = new GetCommand({
    TableName: dbName,
    Key: {
      userId: id,
    },
  });

  try {
    const list = await docClient.send(command);

    const user = list.Item;
    if (!user) throw Error('No users');
    const wordList = user.wordList as string[];

    if (!wordList) await saveWort(['list'], id);

    const WL = [...new Set(wordList)];
    console.log(WL);

    return WL || ['empty'];
  } catch (e) {
    console.log(e);
  }
};

export const getMistakeList = async (id: number) => {
  const command = new GetCommand({
    TableName: dbName,
    Key: {
      userId: id,
    },
  });

  try {
    const list = await docClient.send(command);

    const user = list.Item;
    if (!user) throw Error('No users');
    const mistakeList = user.mistakeList as string[];

    if (!mistakeList) await saveMistake('list', id);

    const ML = [...new Set(mistakeList)];
    console.log(ML);

    return ML || ['empty'];
  } catch (e) {
    console.log(e);
  }
};

export const saveMistake = async (str: string, id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const mistakeList = Array.isArray(user.mistakeList) ? user.mistakeList : [];

    const newMistakeList = [...mistakeList, str];

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        mistakeList: newMistakeList,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const clearMistakeList = async (id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const newMistakeList = ['list'];

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        mistakeList: newMistakeList,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const getExpressionList = async (id: number) => {
  const command = new GetCommand({
    TableName: dbName,
    Key: {
      userId: id,
    },
  });

  try {
    const list = await docClient.send(command);

    const user = list.Item;
    if (!user) throw Error('No users');
    const expressionList = user.expressionList as string[];

    if (!expressionList) await saveExpression('list', id);

    const ML = [...new Set(expressionList)];
    console.log(ML);

    return ML || ['empty'];
  } catch (e) {
    console.log(e);
  }
};

export const saveExpression = async (str: string, id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const expressionList = Array.isArray(user.expressionList)
      ? user.expressionList
      : [];

    const newExpressionList = [...expressionList, str];

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        expressionList: newExpressionList,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const clearExpressionList = async (id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const newMistakeList = ['list'];

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        expressionList: newMistakeList,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const getStats = async (id: number) => {
  const command = new GetCommand({
    TableName: dbName,
    Key: {
      userId: id,
    },
  });

  const emptyStats = {
    level: 0,
    allAntwort: 0,
    nTrueAntwort: 0,
    score: 0,
  };

  try {
    const list = await docClient.send(command);

    const user = list.Item;
    if (!user) throw Error('No users');

    const stats = user.stats as IStats;
    if (!stats) await saveStats(emptyStats, id);

    console.log(stats);

    return stats;
  } catch (e) {
    console.log(e);
    return emptyStats;
  }
};

export const saveStats = async (stats: IStats, id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        stats,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const clearStats = async (id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const stats: IStats = {
      level: 0,
      allAntwort: 0,
      nTrueAntwort: 0,
      score: 0,
    };

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        stats,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const getQuits = async (id: number) => {
  const command = new GetCommand({
    TableName: dbName,
    Key: {
      userId: id,
    },
  });

  const emptyQuits: IQuits = {
    phrase: '',
    translate: '',
    variant1: '',
    variant2: '',
    variant3: '',
    variant4: '',
    trueAntwort: 0,
  };

  try {
    const list = await docClient.send(command);

    const user = list.Item;
    if (!user) throw Error('No users');

    const quits = user.quits as IQuits;
    if (!quits) await saveQuits(emptyQuits, id);

    console.log(quits);

    return quits || emptyQuits;
  } catch (e) {
    console.log(e);
    return emptyQuits;
  }
};

export const saveQuits = async (quits: IQuits, id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        quits,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};

export const clearQuits = async (id: number) => {
  try {
    const command = new GetCommand({
      TableName: dbName,
      Key: {
        userId: id,
      },
    });

    const userResp = await docClient.send(command);
    const user = userResp.Item;
    if (!user) throw Error('No users');

    const quits: IQuits = {
      phrase: '',
      translate: '',
      variant1: '',
      variant2: '',
      variant3: '',
      variant4: '',
      trueAntwort: 0,
    };

    const addCommand = new PutCommand({
      TableName: dbName,
      Item: {
        ...user,
        quits,
      },
    });
    await docClient.send(addCommand);
  } catch (e) {
    console.log(e);
  }
};
