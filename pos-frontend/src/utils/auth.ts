import axios from "axios";

export async function refreshToken() {
  try {
    const currentRefreshToken = localStorage.getItem("refreshToken");

    const Response = await axios.post(
      "https://fe-api-training.ssit.company/api/auth/refresh",
      {
        refreshToken: currentRefreshToken,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const responseData = Response.data;
    const { accessToken, refreshToken } = responseData.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("login_timestamp", Date.now().toString());
  } catch (err) {
    console.log(`Invalid credentials: ${err}`);
  }
}
