<script setup lang="ts">
import { computed, isReactive, isRef, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import BarChart from "./components/BarChart.vue";
import LineChart from "./components/BarChart.vue";
import fetchMockData from "./scripts/fetchMockData";
import { useFormStore, type Category } from "./store/form.store";

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

const {
  names,
  labelOf,
  currentModel,
  currentPolicy,
  modelParametersProps,
  policyParametersProps,
  optionsParametersProps,
  onUpdate,
  initializeFormStore,
  showRaw,
  onSelect,
} = useFormStore();

const selectedModel = ref(names.models[0]);
const selectedPolicy = ref(names.policies[0]);

onMounted(() => {
  initializeFormStore();
  showRaw();
  console.log(
    "Reactivity in App.vue:\n",
    "currentModel -- reactive: ",
    isReactive(currentModel),
    ", ref: ",
    isRef(currentModel),
    "\n"
  );
});
</script>

<template>
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
  <select v-model="chartType" class="form-control">
    <option value="bar-chart">Bar Chart</option>
    <option value="line-chart">Line Chart</option>
  </select>
  <div>
    <select
      v-model="selectedModel"
      @change="currentModel = selectedModel"
      class="form-control"
    >
      <option v-for="(name, idx) in names.models" :key="name" :value="name">
        {{ labelOf("models", name) }}
      </option>
    </select>
  </div>
  <div>
    <pre>{{ modelParametersProps }}</pre>
  </div>
  <div>
    <select
      v-model="selectedPolicy"
      @change="currentPolicy = selectedPolicy"
      class="form-control"
    >
      <option v-for="(name, idx) in names.policies" :key="name" :value="name">
        {{ labelOf("policies", name) }}
      </option>
    </select>
    <div>
      <pre>{{ policyParametersProps }}</pre>
    </div>
  </div>
</template>
