import { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
    slug: 'orders',
    admin: { useAsTitle: 'id' },
    fields: [
      {
        name: 'user',
        type: 'relationship',
        relationTo: 'users',
      },
      {
        name: 'items',
        type: 'array',
        fields: [
          {
            name: 'product',
            type: 'relationship',
            relationTo: 'products',
            required: true,
          },
          { name: 'quantity', type: 'number', required: true },
          { name: 'price', type: 'number', required: true },
        ],
      },
      { name: 'total', type: 'number' },
      {
        name: 'status',
        type: 'select',
        options: ['pending', 'paid', 'shipped', 'cancelled'],
        defaultValue: 'pending',
      },
    ],
  }
  