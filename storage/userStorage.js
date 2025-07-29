import { API_BASE_URL } from '../config.js';

export function checkUserSubscription() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["isProUser", "expireDate"], (data) => {
      const isProUser = data.isProUser || false;
      const expireDate = data.expireDate || null;

      if (isProUser && expireDate) {
        const today = new Date().toISOString().split('T')[0];
        if (today <= expireDate) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
}

/* 사용자 구독 정보 & 상태 동기화 */
export async function syncSubscriptionStatus() {
  try {
    const email = await getUserEmail();

    const response = await fetch(`${API_BASE_URL}/status?email=${email}`);
    if (!response.ok) {
      throw new Error('서버 요청 실패');
    }
    const data = await response.json();

    console.log("구독 상태 동기화:", data);
    const expireDate = data.expireDate;
    const isActive = data.isActive;
    const today = new Date().toISOString().split('T')[0];

     if (!data.email === "email is not found") {
      chrome.storage.sync.set({
        isProUser: false,
        isActive: isActive,
        expireDate: null
      }, () => {
      });
      return;
    }
    if (today <= expireDate) {
      chrome.storage.sync.set({
        isProUser: true,
        isActive: isActive,
        expireDate: expireDate
      }, () => {
      });
    } else {
      chrome.storage.sync.set({
        isProUser: false,
        isActive: isActive,
        expireDate: expireDate
      }, () => {
      });
    }

  } catch (error) {
    console.error('구독 상태 동기화 실패:', error);
  }
}

export function getUserVersion(callback) {
  chrome.storage.sync.get("isProUser", (data) => {

    const isPro = data.isProUser || false;

    return callback(isPro);
  });
}

export function getUsertoken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError || !token) {
        reject('Google OAuth 인증 오류');
        return;
      }
      resolve(token);
    });
  });
}

export function getUserEmail() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {

      if (chrome.runtime.lastError || !token) {
        reject('Google OAuth 인증 오류');
        return;
      }

      fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      })
      .then(response => response.json())
      .then(data => {
        const email = data.email;
        resolve(email); 
      })
      .catch(error => {
        reject('이메일 가져오기 오류: ' + error);
      });
    });
  });
}