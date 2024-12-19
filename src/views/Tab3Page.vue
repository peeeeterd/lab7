<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Nowy wskaźnik ryzyka CVD</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Nowy wskaźnik ryzyka CVD</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-item class="result-item">
        <ion-label>
          Trójglicerydy / HDL: {{ calTriglycerideByHDL }}
          <ion-text color="medium" class="small-text">
            {{ round(triglycerideByHDL) }}
          </ion-text>
        </ion-label>
      </ion-item>
      <ion-item class="result-item">
        <ion-label>
          Cholesterol resztkowy: {{ calResidualCholesterol }}
          <ion-text color="medium" class="small-text">
            {{ round(residualCholesterol) }}
          </ion-text>
        </ion-label>
      </ion-item>
      <ion-button class="button" expand="block" @click="$router.push('/tabs/tab2')">Powrót do starego wskaźnika CVD</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, computed  } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonText } from '@ionic/vue';
import { ExaminationResults } from '@/store/ExaminationResults';
import { RefSymbol } from '@vue/reactivity';
const decimalPrecision = 100;

const dataStore = ExaminationResults();
const receivedData = ref(dataStore.sharedData); // Używamy ref, aby zapewnić reaktywność
const unit = ref(dataStore.sharedData.unit);

const totalCholesterol = ref<number>(0);
const LDL = ref<number>(0);
const HDL = ref<number>(0);
const triglyceride = ref<number>(0);


const minLimitTriglycerideByHDL = 1;
const maxLimitTriglycerideByHDL = 2;
const minResidualCholesterol = 18;
const maxResidualCholesterol = 25;

const triglycerideByHDL = ref<number>(0);
const residualCholesterol = ref<number>(0);

watch(() => dataStore.sharedData, (newData) => {
  receivedData.value = newData;
  unit.value = newData.unit;
});

function calUnits(){
  if(unit.value == "mmol/l"){
    totalCholesterol.value = receivedData.value.totalCholesterol * 38.64;
    LDL.value = receivedData.value.LDL *  38.64;
    HDL.value = receivedData.value.HDL *  38.64;
    triglyceride.value = receivedData.value.triglyceride *  88.62;
  }else{ // mg/dl
    totalCholesterol.value = receivedData.value.totalCholesterol;
    LDL.value = receivedData.value.LDL;
    HDL.value = receivedData.value.HDL;
    triglyceride.value = receivedData.value.triglyceride;
  }
}

const calTriglycerideByHDL = computed(() => {
  calUnits();

  triglycerideByHDL.value = triglyceride.value / HDL.value;
  if(triglycerideByHDL.value < minLimitTriglycerideByHDL){
    return `Bardzo dobrze`;
  }else if(triglycerideByHDL.value > maxLimitTriglycerideByHDL){
    return `Niedobrze`;
  }else{
    return `Dobrze`;
  }
});

const calResidualCholesterol = computed(() => {
  calUnits();

  residualCholesterol.value = totalCholesterol.value - LDL.value - HDL.value;
  if(residualCholesterol.value < minResidualCholesterol){
    return `Bardzo dobrze`;
  }else if(residualCholesterol.value > maxResidualCholesterol){
    return `Niedobrze`;
  }else{
    return `Dobrze`;
  }
});

function round(value: number): number {
  return Math.round(value * decimalPrecision) / decimalPrecision;
}

</script>
<style>
.label {
  white-space: pre-line;
}
.small-text {
  display: block; /* Przenosi tekst do nowej linii */
  color: gray; /* Szary kolor */
  margin-top: 4px; /* Odstęp od głównego tekstu */
}
.result-item{
  padding: 3%;
  padding-right: 7%;
}
.button{
  padding-left: 5%;
  padding-right: 5%;
}
</style>