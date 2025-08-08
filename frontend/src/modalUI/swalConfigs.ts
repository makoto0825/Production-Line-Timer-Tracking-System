import type { SweetAlertOptions } from 'sweetalert2';

// Build data interface
interface BuildData {
  buildNumber: string;
  numberOfParts: number;
  timePerPart: number;
  createdAt: string;
  updatedAt: string;
}

// Build info Swal configuration
export const createBuildInfoConfig = (
  loginId: string,
  buildData: BuildData
): SweetAlertOptions => ({
  title: 'Build Information',
  html: `
    <div class="space-y-4 text-left">
      <div class="p-4 bg-gray-50 rounded-lg">
        <h3 class="mb-2 font-semibold text-gray-800">Login Information</h3>
        <p class="text-gray-600"><strong>Login ID:</strong> ${loginId}</p>
        <p class="text-gray-600"><strong>Build Number:</strong> ${
          buildData.buildNumber
        }</p>
      </div>
      
      <div class="p-4 bg-blue-50 rounded-lg">
        <h3 class="mb-2 font-semibold text-blue-800">Production Details</h3>
        <p class="text-blue-600"><strong>Number of Parts:</strong> ${
          buildData.numberOfParts
        }</p>
        <p class="text-blue-600"><strong>Time per Part:</strong> ${
          buildData.timePerPart
        } minutes</p>
      </div>
      
      <div class="p-4 bg-green-50 rounded-lg">
        <h3 class="mb-2 font-semibold text-green-800">Estimated Total Time</h3>
        <p class="text-green-600"><strong>Total:</strong> ${
          buildData.numberOfParts * buildData.timePerPart
        } minutes</p>
      </div>
    </div>
  `,
  icon: 'info',
  showCancelButton: true,
  confirmButtonText: 'Start Production',
  cancelButtonText: 'Back to Login',
  confirmButtonColor: '#ec4899',
  cancelButtonColor: '#6b7280',
  allowOutsideClick: false,
  allowEscapeKey: false,
  customClass: {
    popup: 'rounded-2xl',
    confirmButton:
      'bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
    cancelButton: 'bg-gray-500 hover:bg-gray-600',
  },
});

// Error Swal configurations
export const loginErrorConfig: SweetAlertOptions = {
  icon: 'error',
  title: 'Login Failed',
  text: 'Build number does not exist. Please check and try again.',
  confirmButtonColor: '#ec4899',
  confirmButtonText: 'OK',
};

export const connectionErrorConfig: SweetAlertOptions = {
  icon: 'error',
  title: 'Connection Error',
  text: 'Failed to connect to server. Please check your connection and try again.',
  confirmButtonColor: '#ec4899',
  confirmButtonText: 'OK',
};

// Timer pause Swal configuration
export const timerPauseConfig: SweetAlertOptions = {
  title: 'Timer Paused',
  html: `
    <div class="text-center">
      <p>Work is currently paused. Click Resume to continue.</p>
    </div>
  `,
  icon: 'info',
  showCancelButton: false,
  confirmButtonText: 'Resume',
  confirmButtonColor: '#ec4899',
  allowOutsideClick: false,
  allowEscapeKey: false,
  showCloseButton: false,
  customClass: {
    popup: 'rounded-2xl',
    confirmButton:
      'bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
  },
};

// Time-up popup Swal configuration
export const timeUpPopupConfig: SweetAlertOptions = {
  title: 'Time is up!',
  html: `
    <div class="text-center space-y-4">
      <div class="text-2xl font-bold text-red-600 mb-4">
        <span id="timeUpCountdown">10:00</span>
      </div>
      <p class="text-gray-700">Do you wish to continue?</p>
    </div>
  `,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes',
  cancelButtonText: 'No',
  confirmButtonColor: '#10b981',
  cancelButtonColor: '#ef4444',
  allowOutsideClick: false,
  allowEscapeKey: false,
  showCloseButton: false,
  customClass: {
    popup: 'rounded-2xl',
    confirmButton:
      'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
    cancelButton:
      'bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200',
  },
};
