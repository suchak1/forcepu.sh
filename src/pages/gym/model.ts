import { GymService } from './service';

const service = new GymService();

export class GymListState {
  list = []
  total = null
  page = null
}

export default {
  namespace: 'gym',

  state: new GymListState(),

  reducers: {
    save(state, { payload: { data: list, total, page }}) {
      return { ...state, list, total, page }
    }
  },

  effects: {
    *fetch({ payload: { page = '1' } }, { call, put }) {
      const { data, total } = yield call(service.fetch, { page })
      yield put({
        type: 'save',
        payload: {
          data,
          total: parseInt(total, 10),
          page: parseInt(page, 10),
        },
      })
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/gym') {
          dispatch({ type: 'fetch', payload: query });
          // dispatch({ type: 'fetchStream', payload: query });
        }
      });
    },
  },
};