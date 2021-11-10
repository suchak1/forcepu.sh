import faker from 'faker';
import { sendJson } from '../../helpers/mockHelpers';

const dataTypes = ['email', 'attachment', 'cse', 'sdk'];
const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const exercises = ['Bench', 'Overhead', 'Curl', 'Upright', 'Squat', 'Deadlift', 'Standing', 'Sitting', 'Row', 'Extension', 'Pullover', 'Crunch']

function getEnum (list: string[]) {
  return list[Math.floor(Math.random() * list.length)]
}

function generateGymRecord () {
  return {
    recordId: faker.datatype.number(),
    dataId: faker.datatype.uuid(),
    dataType: getEnum(dataTypes),
    dataContext: faker.company.catchPhrase(),
    dataOwner: faker.internet.email(),
    id: getEnum(ids),
    exercise: getEnum(exercises),
    volume: faker.datatype.number(),
    weight: faker.datatype.number(),
    reps: faker.datatype.number(),
    date: new Date(),
  };
}

const GYM_RECORD_RESULT = 25;

export default {
  'GET /api/gym': {
    data: [...Array(GYM_RECORD_RESULT)].map(() => generateGymRecord()),
    total: GYM_RECORD_RESULT,
  },
  'GET /api/gym/:id/stream': {
    data: [
      {
        id: Math.random() * 1000,
        date: '2021-01-01T08:00:00Z-0700',
        action: {
          type: 'reject'
        },
        user: 'alice@example.com',
        policy: {
          id: '12345',
          name: 'filename.txt',
          type: 'drive'
        }
      },
      {
        id: Math.random() * 1000,
        date: '2021-01-01T08:00:00Z-0700',
        action: {
          type: 'revoke',
          subject: 'alice@example.com'
        },
        user: 'bob@example.com',
        policy: {
          id: '12345',
          name: 'filename.txt',
          type: 'drive'
        }
      },
      {
        id: Math.random() * 1000,
        date: '2021-01-01T08:00:00Z-0700',
        action: {
          type: 'access',
        },
        user: 'alice@example.com',
        policy: {
          id: '12345',
          name: 'filename.txt',
          type: 'drive'
        }
      },
      {
        id: Math.random() * 1000,
        date: '2021-01-01T08:00:00Z-0700',
        action: {
          type: 'grant',
          subject: 'alice@example.com'
        },
        user: 'bob@example.com',
        policy: {
          id: '12345',
          name: 'filename.txt',
          type: 'drive'
        }
      },
      {
        id: Math.random() * 1000,
        date: '2021-01-01T08:00:00Z-0700',
        action: {
          type: 'create',
        },
        user: 'bob@example.com',
        policy: {
          id: '12345',
          name: 'filename.txt',
          type: 'drive'
        }
      },
    ]
  }
}