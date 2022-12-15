<script setup lang="ts">
import { computed, isReactive, isRef, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/BarChart.vue";
import fetchMockData from "@/scripts/fetchMockData";
import { useFormStore } from "@/store/form.store";

const chartSelectionItems = [
  {
    name: "bar-chart",
    label: "Bar Chart",
  },
  {
    name: "line-chart",
    label: "Line Chart",
  },
];
const chartType = ref("bar-chart");
const chartComponent = computed(() => {
  return chartType.value === "bar-chart" ? BarChart : LineChart;
});
const chartDataGetter = computed(() => {
  return chartType.value === "bar-chart"
    ? () => fetchMockData("BAR")
    : () => fetchMockData("LINE");
});
const loading = ref(true);
const chartOptions = {
  reponsive: true,
  maintainAspectRatio: false,
};

const queryFormHidden = ref(false);
const panel = ref("");

const store = useFormStore();

const { modelSelectionItems, policySelectionItems } = store;
const { currentModel, currentPolicy } = storeToRefs(store);
const {
  modelParametersProps,
  policyParametersProps,
  optionsParametersProps,
  onUpdate,
} = store;
// policyParametersProps,
// optionsParametersProps,
// onUpdate,

onMounted(() => {
  console.log("APP MOUNTED");

  store.showRaw();

  console.log("INITIALIZED STORE");
});
const showSelections = [
  {
    title: "Selected Model",
    subtitle: currentModel.label,
  },
  {
    title: "Selected Policy",
    subtitle: currentPolicy.label,
  },
];

const modModel = ref(2);
</script>

<template>
  <v-app>
    <v-main>
      <v-row>
        <v-col cols="8">
          <v-container>
            <div>
              <Suspense @pending="loading = true" @resolve="loading = false">
                <component
                  :is="chartComponent"
                  :chartDataGetter="chartDataGetter"
                  :chartOptions="chartOptions"
                />
                <template #fallback>
                  <div>Loading...</div>
                </template>
              </Suspense>
            </div>
            <v-select
              v-model="chartType"
              :items="chartSelectionItems"
              item-title="label"
              item-value="name"
            >
            </v-select>
          </v-container>
        </v-col>
        <v-col cols="4">
          <div class="form-container">
            <v-form>
              <v-expansion-panels v-model="panel">
                <v-expansion-panel value="model">
                  <v-expansion-panel-title>MODEL</v-expansion-panel-title>
                  <v-select
                    v-model="currentModel"
                    :items="modelSelectionItems"
                    item-title="label"
                    item-value="name"
                  >
                  </v-select>
                  <v-expansion-panel-text>
                    <pre lang="json">{{ modelParametersProps }}</pre>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="policy">
                  <v-expansion-panel-title>POLICY</v-expansion-panel-title>
                  <v-select
                    v-model="currentPolicy"
                    :items="policySelectionItems"
                    item-title="label"
                    item-value="name"
                  ></v-select>
                  <v-expansion-panel-text>
                    <pre lang="json">{{ policyParametersProps }}</pre>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="options">
                  <v-expansion-panel-title>OPTIONS</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <pre lang="json">{{ optionsParametersProps }}</pre>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-form>
          </div>
          <div>
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="5">
                <p>
                  <label>Selected Model: </label
                  ><span class="text-primary"> {{ currentModel }}</span>
                </p>
                <p>
                  <span>Selected Policy: {{ currentPolicy }}</span>
                </p>
              </v-col>
            </v-row>
            <v-form>
              <v-slider
                density="compact"
                hide-details
                label="Modify model"
                min="0"
                max="20"
                rounded
                v-model="modModel"
                thumb-label="always"
              >
              </v-slider>
              <v-btn @click="onUpdate('model')">Submit</v-btn>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
