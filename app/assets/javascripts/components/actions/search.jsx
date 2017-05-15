import api from '../api'
import Immutable from 'immutable';

export const SEARCH_CHANGE = 'SEARCH_CHANGE';
export const SEARCH_CLEAR  = 'SEARCH_CLEAR';
export const SEARCH_SHOW   = 'SEARCH_SHOW';

export const SEARCH_FETCH_REQUEST = 'SEARCH_FETCH_REQUEST';
export const SEARCH_FETCH_SUCCESS = 'SEARCH_FETCH_SUCCESS';
export const SEARCH_FETCH_FAIL    = 'SEARCH_FETCH_FAIL';

export const STATUS_SEARCH_TIMELINE_FETCH_REQUEST = 'STATUS_SEARCH_TIMELINE_FETCH_REQUEST';
export const STATUS_SEARCH_TIMELINE_FETCH_SUCCESS = 'STATUS_SEARCH_TIMELINE_FETCH_SUCCESS';
export const STATUS_SEARCH_TIMELINE_FETCH_FAIL    = 'STATUS_SEARCH_TIMELINE_FETCH_FAIL';

export const STATUS_SEARCH_TIMELINE_EXPAND_REQUEST = 'STATUS_SEARCH_TIMELINE_EXPAND_REQUEST';
export const STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS = 'STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS';
export const STATUS_SEARCH_TIMELINE_EXPAND_FAIL    = 'STATUS_SEARCH_TIMELINE_EXPAND_FAIL';

export function changeSearch(value) {
  return {
    type: SEARCH_CHANGE,
    value
  };
};

export function clearSearch() {
  return {
    type: SEARCH_CLEAR
  };
};

export function submitSearch() {
  return (dispatch, getState) => {
    const value = getState().getIn(['search', 'value']);

    if (value.length === 0) {
      return;
    }

    dispatch(fetchSearchRequest());

    api(getState).get('/api/v1/search', {
      params: {
        q: value,
        resolve: true
      }
    }).then(response => {
      dispatch(fetchSearchSuccess(response.data));
    }).catch(error => {
      dispatch(fetchSearchFail(error));
    });
  };
};

export function fetchSearchRequest() {
  return {
    type: SEARCH_FETCH_REQUEST
  };
};

export function fetchSearchSuccess(results) {
  return {
    type: SEARCH_FETCH_SUCCESS,
    results,
    accounts: results.accounts,
    statuses: results.statuses
  };
};

export function fetchSearchFail(error) {
  return {
    type: SEARCH_FETCH_FAIL,
    error
  };
};

export function showSearch() {
  return {
    type: SEARCH_SHOW
  };
};

export function fetchStatusSearchTimeline(keyword, replace = false) {
  return (dispatch, getState) => {
    let skipLoading = false;
    let page = getState().getIn(['timelines', 'status_search_timelines', keyword, 'page']);
    console.log('fetched');
    console.log(`page : ${page}`);
    if(!page){
      page = 1;
    }
    console.log(`page : ${page}`);

    if (!replace) {
      //skipLoading = true;
    }

    dispatch(fetchStatusSearchTimelineRequest(keyword, skipLoading));

    api(getState).get(`/api/v1/search/statuses/${keyword}`, {
      params: {
        limit: 10,
        page: page
      }
    }).then(response => {
      dispatch(fetchStatusSearchTimelineSuccess(keyword, response.data, page, replace, skipLoading));
    }).catch(error => {
      dispatch(fetchStatusSearchTimelineFail(keyword, error, skipLoading));
    });
  };
};

export function expandStatusSearchTimeline(keyword) {
  return (dispatch, getState) => {
    const page = getState().getIn(['timelines', 'status_search_timelines', keyword, 'page']);

    console.log('expanded');

    dispatch(expandStatusSearchTimelineRequest(keyword));

    api(getState).get(`/api/v1/search/statuses/${keyword}`, {
      params: {
        limit: 5,
        page: page
      }
    }).then(response => {
      dispatch(expandStatusSearchTimelineSuccess(keyword, response.data, page));
    }).catch(error => {
      dispatch(expandStatusSearchTimelineFail(keyword, error));
    });
  };
};

export function fetchStatusSearchTimelineRequest(keyword, skipLoading) {
  return {
    type: STATUS_SEARCH_TIMELINE_FETCH_REQUEST,
    keyword,
    skipLoading
  };
};

export function fetchStatusSearchTimelineSuccess(keyword, statuses, page, replace, skipLoading) {
  return {
    type: STATUS_SEARCH_TIMELINE_FETCH_SUCCESS,
    keyword,
    statuses,
    replace,
    skipLoading,
    page,
  };
};

export function fetchStatusSearchTimelineFail(keyword, error, skipLoading) {
  return {
    type: STATUS_SEARCH_TIMELINE_FETCH_FAIL,
    keyword,
    error,
    skipLoading,
    skipAlert: error.response.status === 404
  };
};

export function expandStatusSearchTimelineRequest(keyword) {
  return {
    type: STATUS_SEARCH_TIMELINE_EXPAND_REQUEST,
    keyword
  };
};

export function expandStatusSearchTimelineSuccess(keyword, statuses,  page) {
  return {
    type: STATUS_SEARCH_TIMELINE_EXPAND_SUCCESS,
    keyword,
    statuses,
    page
  };
};

export function expandStatusSearchTimelineFail(keyword, error) {
  return {
    type: STATUS_SEARCH_TIMELINE_EXPAND_FAIL,
    keyword,
    error
  };
};
