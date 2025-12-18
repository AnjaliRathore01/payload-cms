import { CollectionAfterChangeHook } from "payload"

export const notifyOnPublish: CollectionAfterChangeHook = async ({
  doc,
  req,
  previousDoc,
}) => {
  if (!previousDoc?.published && doc.published) {
    await req.payload.create({
      collection: 'notifications',
      data: {
        title: 'Post Published',
        message: `"${doc.title}" has been published`,
        type: 'success',
      },
    })
  }
}
