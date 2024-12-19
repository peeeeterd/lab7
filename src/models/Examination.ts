export class Examination {
    sex: string;
    totalCholesterol: number;
    LDL: number;
    HDL: number;
    triglyceride: number;

    constructor(sex: string, totalCholesterol: number, LDL: number, HDL: number, triglyceride: number){
        this.sex = sex;
        this.totalCholesterol = totalCholesterol;
        this.LDL = LDL;
        this.HDL = HDL;
        this.triglyceride = triglyceride;
    }
}