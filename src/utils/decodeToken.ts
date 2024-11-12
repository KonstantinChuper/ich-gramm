interface DecodedToken {
  user_id: string;
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);

    if (!decoded.user_id) {
      console.error("Token does not contain user_id");
      return null;
    }

    return decoded as DecodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
