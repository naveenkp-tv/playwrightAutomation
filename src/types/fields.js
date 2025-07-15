export const FieldType = {
  Input: 'Input',
  Picklist: 'Picklist',
  Textarea: 'Textarea',
  Checkbox: 'Checkbox',
  Date: 'Date',
  Lookup: 'Lookup',
  Button: 'Button',
  Link: 'Link',
};

export const SalesforceComponentType = {
  LWC: 'LWC', // Lightning Web Component
  Aura: 'Aura', // Aura Component
  Visualforce: 'Visualforce',
  Omni: 'Omni', // OmniScript
};

// In a JS file, we can't strongly type this like in TS, but we can use JSDoc.
/** @typedef {string} RecordType */
