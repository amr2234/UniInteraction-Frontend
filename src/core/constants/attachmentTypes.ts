/**
 * Attachment Type Constants
 * These correspond to the AttachmentTypeId values in the backend
 */

export const ATTACHMENT_TYPES = {
  REQUEST: 1,           // Attachments uploaded with request form by users
  RESOLUTION: 2,        // Attachments added by employees in request resolution/response
  PROFILE_PICTURE: 3,   // User profile pictures
} as const;

export type AttachmentTypeId = typeof ATTACHMENT_TYPES[keyof typeof ATTACHMENT_TYPES];

/**
 * Get the name of an attachment type by its ID
 */
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
