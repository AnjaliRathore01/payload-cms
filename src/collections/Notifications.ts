import { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'active', 'priority', 'createdAt'],
  },
  access: {
    read: () => true, // Public read access for website display
    create: ({ req }) => !!req.user, // Only authenticated users can create
    update: ({ req }) => !!req.user, // Only authenticated users can update
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Promotion', value: 'promotion' },
        { label: 'News', value: 'news' },
      ],
      defaultValue: 'info',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Show on Website',
      defaultValue: true,
      admin: {
        description: 'Check to display this notification on the website home page',
      },
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      defaultValue: 'normal',
      admin: {
        description: 'Higher priority notifications appear first',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Class',
      admin: {
        description: 'CSS class for icon (e.g., "bell", "info", "star")',
      },
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link URL',
      admin: {
        description: 'Optional link URL for the notification',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiration Date',
      admin: {
        description: 'Optional expiration date for time-sensitive notifications',
      },
    },
  ],
}
