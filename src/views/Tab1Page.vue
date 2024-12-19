<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Kalkulator ryzyka CVD</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Kalkulator ryzyka CVD</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Formularz -->
      <ion-item class="form-item">
        <ion-label position="floating">Płeć</ion-label>
        <ion-select class="form-item-input" v-model="sex">
          <ion-select-option value="man">Mężczyzna</ion-select-option>
          <ion-select-option value="woman">Kobieta</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item class="form-item">
        <ion-label position="floating">Cholesterol całkowity ({{ unit }})</ion-label>
        <ion-input class="form-item-input" type="number" min="1" max="500" v-model="totalCholesterol" @input="validateNumber('cholWhole')"></ion-input>
      </ion-item>
      <ion-item class="form-item">
        <ion-label position="floating">LDL ({{ unit }})</ion-label>
        <ion-input class="form-item-input" type="number" min="1" max="500" v-model="ldl" @input="validateNumber('ldl')"></ion-input>
      </ion-item>
      <ion-item class="form-item">
        <ion-label position="floating">HDL ({{ unit }})</ion-label>        
        <ion-input class="form-item-input" t ype="number" min="1" max="500" v-model="hdl" @input="validateNumber('hdl')"></ion-input>
      </ion-item>
      <ion-item class="form-item">
        <ion-label position="floating">Triglicerydy ({{ unit }})</ion-label>
        <ion-input class="form-item-input" type="number" min="1" max="500" v-model="triglyceride" @input="validateNumber('triglyceride')"></ion-input>
      </ion-item>
      <ion-button class="button" expand="block" @click="clear">Wyczyść</ion-button>
      <ion-button class="button" expand="block" @click="changeUnit">Zmień jednostkę</ion-button>
      <ion-button class="button" expand="block" @click="submitForm">Wyniki</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSelectOption, IonSelect } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ExaminationResults } from '@/store/ExaminationResults';

const dataStore = ExaminationResults();

const unit = ref('mg/dl');

const sex = ref<string>();
const totalCholesterol = ref<number>();
const ldl = ref<number>();
const hdl = ref<number>();
const triglyceride = ref<number>();

const router = useRouter();

const validateNumber = (field: string) => {
  if (field === 'cholWhole') totalCholesterol.value = Math.max(0, Number(totalCholesterol.value));
  if (field === 'ldl') ldl.value = Math.max(0, Number(ldl.value));
  if (field === 'hdl') hdl.value = Math.max(0, Number(hdl.value));
  if (field === 'triglyceride') triglyceride.value = Math.max(0, Number(triglyceride.value));
};

const changeUnit = () => {
  unit.value == "mg/dl" ? unit.value = "mmol/l" : unit.value = "mg/dl";
  totalCholesterol.value = 0;
  ldl.value = 0;
  hdl.value = 0;
  triglyceride.value = 0;
};

const clear = () => {
  totalCholesterol.value = 0;
  ldl.value = 0;
  hdl.value = 0;
  triglyceride.value = 0;
};

const submitForm = () => {
  if(sex.value == null) return;
  if(totalCholesterol.value == null || totalCholesterol.value == 0) return;
  if(ldl.value == null || ldl.value == 0) return;
  if(hdl.value == null || hdl.value == 0) return;
  if(triglyceride.value == null || triglyceride.value == 0) return;

  dataStore.setData({
    sex: sex.value,
    totalCholesterol: Number(totalCholesterol.value),
    LDL: Number(ldl.value),
    HDL: Number(hdl.value),
    triglyceride: Number(triglyceride.value),
    unit: unit.value
  });

  router.push(`/tabs/tab2/`);
};
</script>
<style>
.form-item{
  padding: 3%;
  padding-right: 7%;
}
.button{
  padding-left: 5%;
  padding-right: 5%;
}
.form-item-input{
  margin-top: 2%;
}
</style>