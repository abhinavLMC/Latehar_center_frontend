export const VITAL_THRESHOLDS = {
  random_blood_sugar: {
    min: 60,
    max: 700,
    warning_min: 70,
    warning_max: 600,
    units: 'mg/dL'
  },
  alchol_test: {
    min: 0,
    max: 150,
    warning_min: 35,
    warning_max: 140,
    units: 'mg/dL'
  },
  bmi: {
    min: 10,
    max: 40,
    warning_min: 18.5,
    warning_max: 24.9,
    units: 'kg/m²'
  },
  blood_pressure: {
    systolic: {
      min: 60,
      max: 280,
      warning_min: 90,
      warning_max: 140,
      units: 'mmHg'
    },
    diastolic: {
      min: 30,
      max: 180,
      warning_min: 60,
      warning_max: 90,
      units: 'mmHg'
    }
  },
  temperature: {
    min: 94,
    max: 104,
    warning_min: 97,
    warning_max: 99,
    units: '°F'
  },
  pulse: {
    min: 40,
    max: 150,
    warning_min: 60,
    warning_max: 100,
    units: 'bpm'
  },
  spo2: {
    min: 85,
    max: 100,
    warning_min: 95,
    warning_max: 100,
    units: '%'
  },
  haemoglobin: {
    min: 6,
    max: 20,
    warning_min: 12,
    warning_max: 18,
    units: 'g/dL'
  },
  pulmonary_function_test: {
    min: 150,
    max: 600,
    warning_min: 200,
    warning_max: 500,
    units: 'L/min'
  },
  hiv: {
    type: 'categorical',
    default: 'Negative',
    options: ['Negative', 'Positive'],
    units: ''
  },
  eye_test: {
    type: 'vision',
    options: ['6/6', '6/9', '6/12', '6/18', '6/24', '6/36', '6/60'],
    units: ''
  }
}; 