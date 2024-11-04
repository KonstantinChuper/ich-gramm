export const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    if (payload.exp) {
      // exp в JWT хранится в секундах
      return payload.exp * 1000 < Date.now();
    }
    return false;
  } catch {
    return true; // если не удалось декодировать, считаем токен невалидным
  }
};
