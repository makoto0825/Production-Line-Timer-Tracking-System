// Calculate remaining time
export const calculateTimeLeft = (
  numberOfParts: number,
  timePerPart: number,
  startTime: string,
  totalPausedTime: number
): number => {
  // totalTargetDuration = numberOfParts × timePerPart (in minutes)
  const totalTargetDuration = numberOfParts * timePerPart * 60; // Convert to seconds

  // now - startTime (in seconds)
  const now = new Date();
  const start = new Date(startTime);
  const elapsedTime = (now.getTime() - start.getTime()) / 1000;

  // totalActiveTime = elapsedTime - totalPausedTime
  const totalActiveTime = elapsedTime - totalPausedTime;

  // timeLeft = totalTargetDuration - totalActiveTime
  const timeLeft = totalTargetDuration - totalActiveTime;

  return timeLeft; // in seconds
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
