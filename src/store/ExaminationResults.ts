import { defineStore } from 'pinia';

export const ExaminationResults = defineStore('data', {
    state: () => ({
      sharedData: { sex: '', totalCholesterol: 0, LDL: 0, HDL: 0, triglyceride: 0, unit: '' }
    }),
    actions: {
      setData(data: { sex: string; totalCholesterol: number, LDL: number, HDL: number, triglyceride: number, unit: string }) {
        this.sharedData = data;
      }
    }
  });