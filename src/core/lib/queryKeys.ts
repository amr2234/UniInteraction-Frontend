



export const queryKeys = {

  auth: {
    user: ['auth', 'user'] as const,
  },


  requests: {
    all: ['requests'] as const,
    list: (filters?: Record<string, any>) => ['requests', 'list', filters] as const,
    detail: (id: number | string) => ['requests', 'detail', id] as const,
    attachments: (id: number | string) => ['requests', 'attachments', id] as const,
    countsByStatus: ['requests', 'counts-by-status'] as const,
  },


  notifications: {
    all: ['notifications'] as const,
    user: (userId: number) => ['notifications', 'user', userId] as const,
  },


  lookups: {
    requestTypes: ['lookups', 'request-types'] as const,
    requestStatuses: ['lookups', 'request-statuses'] as const,
    mainCategories: ['lookups', 'main-categories'] as const,
    subCategories: (mainCategoryId?: number) => ['lookups', 'sub-categories', mainCategoryId] as const,
    services: (subCategoryId?: number) => ['lookups', 'services', subCategoryId] as const,
    leadership: ['lookups', 'leadership'] as const,
  },


  faqs: {
    all: ['faqs'] as const,
    list: ['faqs', 'list'] as const,
    detail: (id: number) => ['faqs', 'detail', id] as const,
  },


  leadership: {
    all: ['leadership'] as const,
    list: ['leadership', 'list'] as const,
    detail: (id: number) => ['leadership', 'detail', id] as const,
  },


  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, any>) => ['users', 'list', filters] as const,
    detail: (id: number) => ['users', 'detail', id] as const,
  },


  categories: {
    main: {
      all: ['categories', 'main'] as const,
      list: ['categories', 'main', 'list'] as const,
      detail: (id: number) => ['categories', 'main', 'detail', id] as const,
    },
    sub: {
      all: ['categories', 'sub'] as const,
      list: ['categories', 'sub', 'list'] as const,
      detail: (id: number) => ['categories', 'sub', 'detail', id] as const,
    },
    services: {
      all: ['categories', 'services'] as const,
      list: ['categories', 'services', 'list'] as const,
      detail: (id: number) => ['categories', 'services', 'detail', id] as const,
    },
  },


  departments: {
    all: ['departments'] as const,
    list: (filters?: Record<string, any>) => ['departments', 'list', filters] as const,
    detail: (id: number) => ['departments', 'detail', id] as const,
  },
} as const;
