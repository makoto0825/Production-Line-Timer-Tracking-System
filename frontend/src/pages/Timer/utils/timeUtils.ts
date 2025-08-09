// Calculate remaining time using server-provided current time
export const calculateTimeLeftWithServerTime = (
  numberOfParts: number,
  timePerPart: number,
  startTime: string,
  totalPausedTime: number,
  serverNow: Date
): number => {
  const totalTargetDuration = numberOfParts * timePerPart * 60; // seconds
  const start = new Date(startTime);
  const elapsedTime = (serverNow.getTime() - start.getTime()) / 1000;
  const totalActiveTime = elapsedTime - totalPausedTime;
  const timeLeft = totalTargetDuration - totalActiveTime;
  return timeLeft;
};

// Format time function (hh:mm:ss format)
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(Math.abs(seconds) / 3600);
  const minutes = Math.floor((Math.abs(seconds) % 3600) / 60);
  const secs = Math.floor(Math.abs(seconds) % 60);

  const sign = seconds < 0 ? '-' : '';
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
