import * as m from '../models';
import * as actionTypes from '../actionTypes';
import * as firebaseClient from '../firebase';
import { IGetAppState } from '../reducer';

export const startListeningToSessions = (user) => (dispatch: Redux.Dispatch) => {
  const ref = firebaseClient.listenToSessions(user.uid, (event: string, taskId: m.TaskId, sessionByDateOrSessionId) => {
    switch (event) {
    case 'child_added':
      dispatch(sessionAdded(taskId, sessionByDateOrSessionId));
      return;

    case 'child_changed':
      dispatch(sessionChanged(taskId, sessionByDateOrSessionId));
      return;

    default:
      throw new Error('unknown event emitted by listenToTasks');
    }
  });

  dispatch({
    type: actionTypes.LISTEN_TO_SESSIONS,
    ref,
  } as firebaseClient.IListenToRefAction);
}

const sessionAdded = (taskId, sessionsByDate) => ({
  type: actionTypes.SESSION_ADDED,
  sessionsByDate,
  taskId,
});

const sessionChanged = (taskId, sessionsByDate) => ({
  type: actionTypes.SESSION_CHANGED,
  sessionsByDate,
  taskId,
});

export const stopListeningToSessions = () => (dispatch: Redux.Dispatch, getState: IGetAppState) => {
  const sessionsRef = getState().sessions;
  if (sessionsRef) {
    firebaseClient.stopListeningToSessions(sessionsRef);
    dispatch({ type: actionTypes.STOP_LISTENING_TO_SESSIONS });
  }
}
