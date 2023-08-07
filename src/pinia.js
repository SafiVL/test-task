import { defineStore } from 'pinia'

export const useProjectModule = defineStore('project', {
  state: () => ({
    formData: {
      fields: [],
      projectName: '',
      projectCode: '',
      projectHouse: '',
      projectHousing: '',
      projectIndex: '',
    },
  }),
  actions: {
  },
})
