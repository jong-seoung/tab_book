import { API_BASE_URL } from "../env.js";

export function redirectToPayment(token) {
  // POST 방식으로 토큰을 서버에 전달
  fetch(`${API_BASE_URL}/api/redirect-to-payment`, {
    method: "POST", // 변경된 부분
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => response.json())
    .then((data) => {
      window.open(data.redirectUrl, "_blank");
    })
    .catch((error) => {
      console.error("에러 발생:", error);
    });
}

export function cancelPayment(token) {
  // POST 방식으로 토큰을 서버에 전달
  fetch(`${API_BASE_URL}/api/cancel-subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("에러 발생:", error);
    });
}
