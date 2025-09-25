import { setUserActive } from "../useState.js";
import { API_BASE_URL } from "../env.js";

export function loadUserData() {
  chrome.storage.sync.get(["userInfo"], (data) => {
    setUserActive(true);

    // 결제 기능 구현 전에는 항상 활성화 상태로 변경
    // const expireTime = new Date(data.userInfo.expireDate).getTime();

    // if (expireTime > Date.now()) {
    //   setUserActive(true);
    //   return;
    // } else {
    //   syncSubscriptionStatus();
    //   return;
    // }
  });
}

/* 사용자 구독 정보 & 상태 동기화 */
export async function syncSubscriptionStatus() {
  try {
    const email = await getUserEmail();

    const response = await fetch(`${API_BASE_URL}/status?email=${email}`);
    if (!response.ok) {
      throw new Error("서버 요청 실패");
    }

    const data = await response.json();

    const expireDate = data.expireDate;
    const expireTime = new Date(expireDate).getTime();
    const isActive = data.isActive;
    const storageData = {};

    storageData.isActive = isActive;
    if (data.email === "email is not found") {
      storageData.expireDate = null;
      setUserActive(false);
    } else {
      storageData.expireDate = expireDate;
      setUserActive(expireTime > Date.now());
    }

    chrome.storage.sync.set({ userInfo: storageData }, () => {});
  } catch (error) {
    setUserActive(false);
    console.error("구독 상태 동기화 실패:", error);
  }
}

export function getUserEmail() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError || !token) {
        reject("Google OAuth 인증 오류");
        return;
      }

      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const email = data.email;
          resolve(email);
        })
        .catch((error) => {
          reject("이메일 가져오기 오류: " + error);
        });
    });
  });
}
