export function parseImage(base64Image: string): string {
  if (!base64Image) return "/default-profile-image.svg";
  return `data:image/png;base64,${base64Image}`;
}

export function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMs = now.getTime() - postDate.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return `${minutes} m`;
  } else if (hours < 24) {
    return `${hours} h`;
  } else if (days < 7) {
    return `${days} d`;
  } else if (weeks < 4) {
    return `${weeks} w`;
  } else if (months < 12) {
    return `${months} m`;
  } else {
    return `${years} y`;
  }
}

export const countTextLetters = (count: number) => {
  return `${count} comment${count === 1 ? "" : "s"}`;
};
