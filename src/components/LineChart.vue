<script setup lang="ts">
import { ref, computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import type { ChartData } from "../data/types";

export interface Props {
  chartDataGetter: () => Promise<ChartData>;
}

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const props = defineProps<Props>();

const _chartData = await props.chartDataGetter();
const chartData = ref(_chartData);
const chartOptions = {
  reponsive: true,
  maintainAspectRatio: false,
};

const chartStyles = computed(() => ({
  height: "350px",
  position: "relative",
}));
</script>

<template>
  <div>
    <Line :data="chartData" :options="chartOptions" :style="chartStyles" />
  </div>
</template>
