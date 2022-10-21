const api = process.env.VUE_APP_API_URL_BASE
export default {
  DOCUMENT_TYPES: () => `${api}/api/document-types`,
}
