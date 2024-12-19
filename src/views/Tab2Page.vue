<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Stary wskaźnik ryzyka CVD</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Stary wskaźnik ryzyka CVD</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- Wyświetlenie przesłanych danych -->
      <ion-item class="result-item">
        <ion-label class="label">
          Cholesterol całkowity {{ calTotalCholesterol }}
          <ion-text color="medium" class="small-text">
            {{ receivedData.totalCholesterol }}{{ ` ` + unit }}
          </ion-text>
        </ion-label>
      </ion-item>
      <ion-item class="result-item">
        <ion-label class="label">
          LDL {{ calLDL }}
          <ion-text color="medium" class="small-text">
            {{ receivedData.LDL }}{{ ` ` + unit }}
          </ion-text>
        </ion-label>
      </ion-item>
      <ion-item class="result-item" v-if="receivedData.sex == 'man'">
        <ion-label class="label">
          HDL {{ calHDLMan }}
          <ion-text color="medium" class="small-text">
            {{ receivedData.HDL }}{{ ` ` + unit }}
          </ion-text>
        </ion-label>
      </ion-item>
      <ion-item class="result-item" v-if="receivedData.sex == 'woman'">
        <ion-label class="label">
          HDL {{ calHDLWoman }}
          <ion-text color="medium" class="small-text">
            {{ receivedData.HDL }}{{ ` ` + unit }}
          </ion-text>
        </ion-label>
      </ion-item>
      <ion-item class="result-item">
        <ion-label class="label">
          Trójglicerydy {{ calTriglyceride }}
          <ion-text color="medium" class="small-text">
            {{ receivedData.triglyceride }}{{ ` ` + unit }}
          </ion-text>
        </ion-label>
      </ion-item>
      <ion-button class="button" expand="block" @click="$router.push('/tabs/tab1')">Powrót do formularza</ion-button>
      <ion-button class="button" expand="block" @click="showNewerIndicators">Nowy wskaźnik CVD</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, watch, computed  } from 'vue';
import { ExaminationResults } from '@/store/ExaminationResults';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSelectOption, IonSelect, IonText } from '@ionic/vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const decimalPrecision = 100;

const dataStore = ExaminationResults();
const receivedData = ref(dataStore.sharedData); // Używamy ref, aby zapewnić reaktywność
const unit = ref(dataStore.sharedData.unit);

const LimitTotalCholesterol = ref<number>(0);
const LimitLDL = ref<number>(0);
const LimitHDLMan = ref<number>(0);
const LimitHDLWoman = ref<number>(0);
const LimitTriglyceride = ref<number>(0);

calUnits();

function calUnits(){
  if(unit.value == "mg/dl"){
    LimitTotalCholesterol.value = 190;
    LimitLDL.value = 115;
    LimitHDLMan.value = 40;
    LimitHDLWoman.value = 45;
    LimitTriglyceride.value = 150;
  }else if(unit.value == "mmol/l"){
    LimitTotalCholesterol.value = round(190 / 38.64);
    LimitLDL.value = round(115 / 38.64);
    LimitHDLMan.value = round(40 / 38.64);
    LimitHDLWoman.value = round(45 / 38.64);
    LimitTriglyceride.value = round(150 / 88.62); 
  }else{}
}

function round(value: number): number {
  return Math.round(value * decimalPrecision) / decimalPrecision;
}

  // Używamy watch, aby reagować na zmiany w sharedData
watch(() => dataStore.sharedData, (newData) => {
  receivedData.value = newData;
  unit.value = newData.unit;
  calUnits();
});

const calTotalCholesterol = computed(() =>
  receivedData.value.totalCholesterol < LimitTotalCholesterol.value
    ? `w normie (< ${LimitTotalCholesterol.value} ${unit.value})`
    : `zbyt wysoki.\nNorma przekroczona o ${round(receivedData.value.totalCholesterol - LimitTotalCholesterol.value)} ${unit.value}`
);
const calLDL = computed(() =>
  receivedData.value.LDL < LimitLDL.value
    ? `w normie (< ${LimitLDL.value} ${unit.value})`
    : `zbyt wysoki.\nNorma przekroczona o ${round(receivedData.value.LDL - LimitLDL.value)} ${unit.value}`
);
const calHDLMan = computed(() =>
receivedData.value.HDL > LimitHDLMan.value
    ? `w normie (> ${LimitHDLMan.value} ${unit.value})`
    : `zbyt niski.\nNiedobór o ${round(Math.abs(LimitHDLMan.value - receivedData.value.HDL))} ${unit.value}`
);
const calHDLWoman = computed(() =>
receivedData.value.HDL > LimitHDLWoman.value
    ? `w normie (> ${LimitHDLWoman.value} ${unit.value})`
    : `zbyt niski.\nNiedobór o ${round(Math.abs(LimitHDLWoman.value - receivedData.value.HDL))} ${unit.value}`
);
const calTriglyceride = computed(() =>
  receivedData.value.triglyceride < LimitTriglyceride.value
    ? `w normie (< ${LimitTriglyceride.value} ${unit.value})`
    : `zbyt wysoki.\nNorma przekroczona o ${round(receivedData.value.triglyceride - LimitTriglyceride.value)} ${unit.value}`
);

const showNewerIndicators = () => {
  router.push('/tabs/tab3')
}
</script>

<style>
.label {
  white-space: pre-line;
  margin-top: 2%;
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