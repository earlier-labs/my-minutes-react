import * as Promise from 'bluebird';

import config from './config';
import * as m from './models';
import { logException } from './utils/error';
import { sendFetch } from './utils/fetch';

let endpoint: string;
let userPublicKey: string = '';
let userAuth: string = '';

const ERR_NO_PUSH_SERVER_URL = 'Missing push server url';
const ERR_NO_SUBSCRIPTION_ENDPOINT = 'Missing subscription endpoint';

const initialize = (registration) => {
  // Request push notification permission.
  registration.pushManager.getSubscription().then(subscription => {
    if (subscription) {
      return subscription;
    }
    return registration.pushManager.subscribe({ userVisibleOnly: true });
  }).then(subscription => {
    endpoint = subscription.endpoint;

    if (subscription.getKey) {
      const rawKey = subscription.getKey('p256dh');
      userPublicKey = btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)));

      const rawAuthSecret = subscription.getKey('auth');
      userAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret)));
    }
  }).catch(error => logException(error));
};

const schedulePush = (taskId: m.TaskId, payload: m.IPushPayload, delay: number): Promise<Response | void> => {
  if (!endpoint) {
    return Promise.reject(new Error(ERR_NO_SUBSCRIPTION_ENDPOINT));
  }
  if (!config.pushServer.url) {
    return Promise.reject(new Error(ERR_NO_PUSH_SERVER_URL));
  }

  const pushUrl = `${config.pushServer.url}/push`;

  return sendFetch(pushUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userAuth,
      delay,
      endpoint,
      userPublicKey,
      payload: JSON.stringify(payload),
      startedAt: Date.now(),
      taskId,
    })
  });
};

const cancelPush = (taskId: m.TaskId): Promise<Response | void> => {
  if (!config.pushServer.url) {
    return Promise.reject(new Error(ERR_NO_PUSH_SERVER_URL));
  }

  const cancelUrl = `${config.pushServer.url}/cancel`;

  return sendFetch(cancelUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      taskId,
    }),
  });
}

export default {
  initialize,
  schedulePush,
  cancelPush,
}
