import { Rule } from "antd/es/form";
import { VITAL_THRESHOLDS } from "@constants/VitalThresholds";

type BaseThresholdType = {
  units: string;
};

type NumericThresholdType = BaseThresholdType & {
  min: number;
  max: number;
  warning_min: number;
  warning_max: number;
};

type CategoricalThresholdType = BaseThresholdType & {
  type: 'categorical';
  options: string[];
  default?: string;
};

type VisionThresholdType = BaseThresholdType & {
  type: 'vision';
  options: string[];
};

type ThresholdType = NumericThresholdType | CategoricalThresholdType | VisionThresholdType;

type VitalThresholdsType = {
  [key: string]: ThresholdType | {
    [subKey: string]: NumericThresholdType;
  };
};

export const useVitalValidation = () => {
  const getVitalValidationRules = (vitalType: string, subType?: string): Rule[] => {
    const getThresholdForType = (): ThresholdType | undefined => {
      const thresholds = VITAL_THRESHOLDS as VitalThresholdsType;
      if (subType && vitalType in thresholds) {
        const vitalThreshold = thresholds[vitalType] as { [key: string]: NumericThresholdType };
        return vitalThreshold[subType];
      }
      return thresholds[vitalType] as ThresholdType;
    };

    const threshold = getThresholdForType();
    
    if (!threshold) {
      return [];
    }

    // Handle categorical and vision types
    if ('type' in threshold) {
      if (threshold.type === 'categorical') {
        return [
          {
            validator: async (_, value) => {
              if (value === undefined || value === null || value === '') {
                return Promise.resolve();
              }

              if (!threshold.options.includes(value)) {
                return Promise.reject(
                  new Error(`Value must be one of: ${threshold.options.join(', ')}`)
                );
              }

              return Promise.resolve();
            }
          }
        ];
      }
      
      if (threshold.type === 'vision') {
        return [
          {
            validator: async (_, value) => {
              if (value === undefined || value === null || value === '') {
                return Promise.resolve();
              }

              if (!threshold.options.includes(value)) {
                return Promise.reject(
                  new Error(`Vision value must be one of: ${threshold.options.join(', ')}`)
                );
              }

              return Promise.resolve();
            }
          }
        ];
      }

      return [];
    }

    // Handle numeric types
    return [
      {
        validator: async (_, value) => {
          if (value === undefined || value === null || value === '') {
            return Promise.resolve();
          }

          const numValue = parseFloat(value);
          
          if (isNaN(numValue)) {
            return Promise.reject(new Error('Please enter a valid number'));
          }

          if (numValue < threshold.min || numValue > threshold.max) {
            return Promise.reject(
              new Error(`Value must be between ${threshold.min} and ${threshold.max} ${threshold.units}`)
            );
          }

          if (numValue < threshold.warning_min || numValue > threshold.warning_max) {
            // This will show a warning but not prevent form submission
            return Promise.resolve();
          }

          return Promise.resolve();
        }
      }
    ];
  };

  return { getVitalValidationRules };
}; 