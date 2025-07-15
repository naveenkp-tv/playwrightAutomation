import { UILabel } from './enums.js';
import { FieldType, SalesforceComponentType } from '../types/fields.js';

export const sfFieldTypeMap = [
  {
    label: UILabel.LAST_NAME,
    fieldType: FieldType.Input,
    componentType: SalesforceComponentType.Visualforce, // Standard login page
    recordType: '',
  },
  {
    label: UILabel.EMAIL,
    fieldType: FieldType.Input,
    componentType: SalesforceComponentType.Visualforce, // Standard login page
    recordType: '',
  },
  {
    label: UILabel.COMPANY,
    fieldType: FieldType.Input,
    componentType: SalesforceComponentType.Visualforce, // Standard login page
    recordType: '',
  },
];
