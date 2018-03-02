import {combineReducers} from "redux"

import queryData from "./queryDataReducer";
import appReducer from "./appReducer";
import wf from "./wfReducers";
import bd from "./bdReducer";
import dde from './ddeReducers';
import alerts from './alertReducers';
import dialog from './dialogReducers';
import reports from './reportsReducers';

export default combineReducers({
  queryData,
  app: appReducer,
  wf,
  bd,
  dde,
  alerts,
  dialog,
  reports
})