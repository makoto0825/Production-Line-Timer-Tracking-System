import Swal from 'sweetalert2';
import { timeUpPopupConfig } from '../../../modalUI/swalConfigs';

// Handle time-up popup display and user interaction
export const handleTimeUpPopup = async () => {
  console.log('Showing time-up popup...');

  const result = await Swal.fire(timeUpPopupConfig);
  if (result.isConfirmed) {
    console.log('User clicked Yes - continue work');
    // TODO: Schedule next popup in 10 minutes
    // scheduleNextTimeUpPopup();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    console.log('User clicked No - continue work');
    // TODO: Schedule next popup in 10 minutes
    // scheduleNextTimeUpPopup();
  }
  // Both Yes and No dismiss the popup and continue work
  return result;
};

// Schedule next time-up popup in 10 minutes
export const scheduleNextTimeUpPopup = () => {
  console.log('Scheduling next popup in 10 minutes...');
  // TODO: Implement 10-minute countdown and auto-popup
  // This will be implemented in the next phase
};
