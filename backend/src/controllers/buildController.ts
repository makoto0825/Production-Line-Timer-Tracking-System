import { Request, Response } from 'express';
import { Build } from '../models/Build';

// Build Number validation controller
export const validateBuildNumber = async (req: Request, res: Response) => {
  try {
    const { buildNumber } = req.params;

    console.log('🔍 Validating build number:', buildNumber);

    // Find build by buildNumber
    const build = await Build.findOne({ buildNumber });

    if (!build) {
      console.log('❌ Build number not found:', buildNumber);
      return res.status(404).json({
        success: false,
        message: 'Build number not found',
        buildNumber: buildNumber,
      });
    }

    console.log('✅ Build number validated:', buildNumber);
    return res.status(200).json({
      success: true,
      message: 'Build number exists',
      data: build,
    });
  } catch (error) {
    console.error('❌ Error validating build number:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
