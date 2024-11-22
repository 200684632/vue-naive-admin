import { request } from '@/utils'

export default {
  getDicts: params => request.get('/dict/tree', { params }),
  delete: id => request.delete(`/dict/${id}`),
  update: data => request.patch(`/dict/${data.id}`, data),
  save: data => request.post('/dict', data),
}
