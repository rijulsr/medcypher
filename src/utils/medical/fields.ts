export type MedicalFieldType =
  | 'numerical'
  | 'measurement'
  | 'labelled_text'
  | 'unlabelled_text';

export interface MedicalField {
  name: string;
  type: MedicalFieldType;
}

export const MEDICAL_FIELDS: MedicalField[] = [
  // Numerical (27)
  {name: 'Number of Members in the Household', type: 'numerical'},
  {name: 'Erythema Intensity Score', type: 'numerical'},
  {name: 'Edema Intensity Score', type: 'numerical'},
  {name: 'Excoriations Intensity Score', type: 'numerical'},
  {name: 'Oozing Intensity Score', type: 'numerical'},
  {name: 'Dryness Intensity Score', type: 'numerical'},
  {name: 'Lichenification Intensity Score', type: 'numerical'},
  {name: 'Total Intensity Score (Total B)', type: 'numerical'},
  {
    name: 'Itchiness - Subjective Symptoms graded on visual analog scale',
    type: 'numerical',
  },
  {
    name: 'Sleeplessness - Subjective Symptoms graded on visual analog scale',
    type: 'numerical',
  },
  {
    name: 'Total C - Subjective Symptoms graded on visual analog scale',
    type: 'numerical',
  },
  {name: 'Final SCORAD', type: 'numerical'},
  {name: 'Hb Investigations', type: 'numerical'},
  {name: 'Na Investigations', type: 'numerical'},
  {name: 'ASL Investigations', type: 'numerical'},
  {name: 'TLC Investigations', type: 'numerical'},
  {name: 'DLC Investigations', type: 'numerical'},
  {name: 'ESR Investigations', type: 'numerical'},
  {name: 'Platelet Investigations', type: 'numerical'},
  {name: 'K Investigations', type: 'numerical'},
  {name: 'Urea Investigations', type: 'numerical'},
  {name: 'Creatinine Investigations', type: 'numerical'},
  {name: 'ALT Investigations', type: 'numerical'},
  {name: 'FBS Investigations', type: 'numerical'},
  {name: 'Serum billirubin Investigations', type: 'numerical'},
  {name: 'Serum Proteins Investigations', type: 'numerical'},
  {name: 'Serum IgE', type: 'numerical'},

  // Measurements (4)
  {name: 'Birth Weight', type: 'measurement'},
  {name: 'Weight Examination', type: 'measurement'},
  {name: 'Height Examination', type: 'measurement'},
  {name: 'Extent of body surface area involved', type: 'measurement'},

  // Labelled Text (54)
  {name: 'Duration', type: 'labelled_text'},
  {name: 'Site of Onset', type: 'labelled_text'},
  {name: 'Mode of Spread', type: 'labelled_text'},
  {name: 'Symptoms', type: 'labelled_text'},
  {name: 'Treatment History', type: 'labelled_text'},
  {name: 'Personal History', type: 'labelled_text'},
  {name: 'Birth (Preterm/Postterm)', type: 'labelled_text'},
  {name: 'Mile Stones', type: 'labelled_text'},
  {name: 'Socio Economic Status', type: 'labelled_text'},
  {name: 'Vaccination', type: 'labelled_text'},
  {name: 'Family History', type: 'labelled_text'},
  {name: 'Family Tree', type: 'labelled_text'},
  {name: 'Past History', type: 'labelled_text'},
  {
    name: 'Similar ailments/ significant disease/tuberculosis',
    type: 'labelled_text',
  },
  {name: 'Pulse Examination', type: 'labelled_text'},
  {name: 'BP Examination', type: 'labelled_text'},
  {name: 'Pallor Examination', type: 'labelled_text'},
  {name: 'Cyanosis Examination', type: 'labelled_text'},
  {name: 'Jaundice Examination', type: 'labelled_text'},
  {name: 'Lymph Nodes Examination', type: 'labelled_text'},
  {name: 'Chest Systemic Examination', type: 'labelled_text'},
  {name: 'CVS Systemic Examination', type: 'labelled_text'},
  {name: 'Abdomen Systemic Examination', type: 'labelled_text'},
  {name: 'CNS Systemic Examination', type: 'labelled_text'},
  {name: 'Musculoskeletal Systemic Examination', type: 'labelled_text'},
  {name: 'Face Cutaneous Examination', type: 'labelled_text'},
  {name: 'Extremities Cutaneous Examination', type: 'labelled_text'},
  {name: 'Palms Cutaneous Examination', type: 'labelled_text'},
  {name: 'Flexures Cutaneous Examination', type: 'labelled_text'},
  {
    name: 'Predominant Site/s Involved Cutaneous Examination',
    type: 'labelled_text',
  },
  {name: 'Hairs Cutaneous Examination', type: 'labelled_text'},
  {name: 'Muccous Membrane Cutaneous Examination', type: 'labelled_text'},
  {name: 'Oral Cutaneous Examination', type: 'labelled_text'},
  {name: 'Genital Cutaneous Examination', type: 'labelled_text'},
  {name: 'Scalp Cutaneous Examination', type: 'labelled_text'},
  {name: 'Trunk Cutaneous Examination', type: 'labelled_text'},
  {name: 'Soles Cutaneous Examination', type: 'labelled_text'},
  {name: 'Nails Cutaneous Examination', type: 'labelled_text'},
  {name: 'Nail Folds Cutaneous Examination', type: 'labelled_text'},
  {name: 'Nasal Cutaneous Examination', type: 'labelled_text'},
  {name: 'Peri anal Cutaneous Examination', type: 'labelled_text'},
  {name: 'Provisional Diagnosis', type: 'labelled_text'},
  {name: 'Ana Investigations', type: 'labelled_text'},
  {name: 'G6PD Investigations', type: 'labelled_text'},
  {name: 'Chest X-ray Investigations', type: 'labelled_text'},
  {name: 'Urine RE/ME', type: 'labelled_text'},
  {name: 'ECG Investigations', type: 'labelled_text'},
  {name: 'Echo Cardiographhy Investigations', type: 'labelled_text'},
  {name: 'Biopsy Histopathology', type: 'labelled_text'},
  {name: 'Immunofluorescence', type: 'labelled_text'},
  {name: 'Ultrasound', type: 'labelled_text'},
  {name: 'MRI', type: 'labelled_text'},
  {name: 'Other Investigations', type: 'labelled_text'},
  {name: 'Final Diagnosis', type: 'labelled_text'},

  // Unlabelled Text (5)
  {name: 'Treatment & Followup', type: 'unlabelled_text'},
  {name: 'Followup 2', type: 'unlabelled_text'},
  {name: 'Followup 3', type: 'unlabelled_text'},
  {name: 'Followup 4', type: 'unlabelled_text'},
  {name: 'Followup 5', type: 'unlabelled_text'},
];

export const FIELDS_BY_TYPE: Record<MedicalFieldType, MedicalField[]> = {
  numerical: MEDICAL_FIELDS.filter(f => f.type === 'numerical'),
  measurement: MEDICAL_FIELDS.filter(f => f.type === 'measurement'),
  labelled_text: MEDICAL_FIELDS.filter(f => f.type === 'labelled_text'),
  unlabelled_text: MEDICAL_FIELDS.filter(f => f.type === 'unlabelled_text'),
};
