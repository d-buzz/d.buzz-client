import { upload } from '@fleekhq/fleek-storage-js'
import appConfig from 'config'

export const handleUploadImageToFleek = async (
  blob = new Blob(),
  setImageUploadProgress,
) => {
  try {
    const file = new File([blob], blob.name, { type: blob.type, size: blob.size, lastModified: Date.now() })
    const arrayBuffer = await file.arrayBuffer()

    // Upload the file to Fleek (IPFS)
    const result = await upload({
      apiKey: appConfig.FLEEK_API_KEY,
      apiSecret: appConfig.FLEEK_API_SECRET,
      key: `dbuzz-images/dbuzz-image-${Date.now()}.${file.type.split('/')[1]}`,
      data: arrayBuffer,
      onUploadProgress: (progress) => {
        setImageUploadProgress(progress)
      },
    })

    return result.publicUrl
  } catch (error) {
    alert('Error uploading image, please try again!')
    console.error('Error uploading file to IPFS:', error)
  }
}