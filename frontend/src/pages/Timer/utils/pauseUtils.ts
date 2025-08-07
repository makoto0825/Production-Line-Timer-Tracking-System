export interface PauseRecord {
  startTime: string;
  endTime?: string;
}

export interface SessionData {
  startTime: string;
  pauseRecords: PauseRecord[];
  loginId: string;
  buildData: {
    buildNumber: string;
    numberOfParts: number;
    timePerPart: number;
  };
  status: string;
  totalPausedTime: number;
  defects: number;
}

// createPauseRecord
export const createPauseRecord = (): PauseRecord => {
  return {
    startTime: new Date().toISOString(),
    endTime: undefined,
  };
};

// updatePauseRecord
export const updatePauseRecord = (
  pauseRecords: PauseRecord[]
): PauseRecord[] => {
  console.log('updatePauseRecord - input:', pauseRecords);

  const result = pauseRecords.map((record, index) => {
    console.log(
      `Record ${index}:`,
      record,
      'endTime exists:',
      !!record.endTime
    );

    if (index === pauseRecords.length - 1 && !record.endTime) {
      const updatedRecord = {
        ...record,
        endTime: new Date().toISOString(),
      };
      console.log(`Updating record ${index}:`, updatedRecord);
      return updatedRecord;
    }
    return record;
  });

  return result;
};

// calculateTotalPausedTime
export const calculateTotalPausedTime = (
  pauseRecords: PauseRecord[]
): number => {
  if (!pauseRecords || !Array.isArray(pauseRecords)) return 0;

  return pauseRecords.reduce((total, pause) => {
    const endTime = pause.endTime ? new Date(pause.endTime) : new Date();
    const duration =
      (endTime.getTime() - new Date(pause.startTime).getTime()) / 1000; // 秒単位
    return total + duration;
  }, 0);
};

// updateSessionToPaused
export const updateSessionToPaused = (
  sessionData: SessionData
): SessionData => {
  const pauseRecord = createPauseRecord();
  const pauseRecords = sessionData.pauseRecords || [];

  const updatedPauseRecords = [...pauseRecords, pauseRecord];
  const totalPausedTime = calculateTotalPausedTime(updatedPauseRecords);

  const result = {
    ...sessionData,
    pauseRecords: updatedPauseRecords,
    totalPausedTime,
    status: 'paused',
  };

  return result;
};

// updateSessionToActive
export const updateSessionToActive = (
  sessionData: SessionData
): SessionData => {
  const pauseRecords = sessionData.pauseRecords || [];

  const updatedPauseRecords = updatePauseRecord(pauseRecords);
  const totalPausedTime = calculateTotalPausedTime(updatedPauseRecords);

  return {
    ...sessionData,
    pauseRecords: updatedPauseRecords,
    totalPausedTime,
    status: 'active',
  };
};
