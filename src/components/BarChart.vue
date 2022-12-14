<script setup lang="ts">
import { ref, computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import type { ChartData } from "../data/types";

export interface Props {
  chartDataGetter: () => Promise<ChartData>;
}

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps<Props>();

const _chartData = await props.chartDataGetter();
const chartData = ref(_chartData);
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
const chartStyles = computed(() => ({
  height: "350px",
  position: "relative",
}));
</script>

<template>
  <div>
    <Bar :options="chartOptions" :data="chartData" :style="chartStyles"> </Bar>
  </div>
</template>
