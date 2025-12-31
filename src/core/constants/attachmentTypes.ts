
export const ATTACHMENT_TYPES = {
  REQUEST: 1,           
  RESOLUTION: 2,        
  PROFILE_PICTURE: 3,   
} as const;
export type AttachmentTypeId = typeof ATTACHMENT_TYPES[keyof typeof ATTACHMENT_TYPES];

export const getAttachmentTypeName = (typeId: number): string => {
  switch (typeId) {
    case ATTACHMENT_TYPES.REQUEST:
      return 'Request Form Attachment';
    case ATTACHMENT_TYPES.RESOLUTION:
      return 'Resolution Response Attachment';
    case ATTACHMENT_TYPES.PROFILE_PICTURE:
      return 'Profile Picture';
    default:
      return 'Unknown';
  }
};
