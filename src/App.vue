<script setup lang="ts">
import { computed, isReactive, isRef, reactive, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/BarChart.vue";
import fetchMockData from "@/scripts/fetchMockData";
import { useFormStore } from "@/store/form.store";
import ParametersForm from "@/components/ParametersForm.vue";

const store = useFormStore();

const {
  initialModelName,
  initialPolicyName,
  modelSelectionItems,
  policySelectionItems,
  onUpdate,
  showRaw,
  onSelectModel,
  onSelectPolicy,
} = store;
const { modelParameters, policyParameters, optionsParameters } =
  storeToRefs(store);

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

const panel = ref("");

const selectedModel = ref(initialModelName);
const selectedPolicy = ref(initialPolicyName);

function selectModel(name: string) {
  selectedModel.value = name;
  onSelectModel(name);
}
function selectPolicy(name: string) {
  selectedPolicy.value = name;
  onSelectPolicy(name);
}

// Unique id generated in order to distinguish different forms
const formId = computed(() => {
  let result = {
    model: `model-${selectedModel.value}`,
    policy: `policy-${selectedPolicy.value}`,
  };
  console.log("formId: ", result.model, result.policy);
  return result;
});

function updateModel(e, values: number[]) {
  onUpdate("model", values);
}
function updatePolicy(e, values: number[]) {
  onUpdate("policy", values);
}
function updateOptions(e, values: number[]) {
  onUpdate("options", values);
}
</script>

<template>
  <v-app>
    <v-main>
      <v-row>
        <v-col cols="8">
          <v-container>
            <pre>{{ modelParameters }}</pre>
            <pre>{{ policyParameters }}</pre>
            <!-- <div>
                 <pre>{{ showRaw }}</pre>
                 </div> -->
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
                  <v-expansion-panel-title
                    ><span class="text-grey"
                      >MODEL</span
                    ></v-expansion-panel-title
                  >
                  <v-expansion-panel-text>
                    <v-select
                      :model-value="selectedModel"
                      @update:modelValue="selectModel"
                      :items="modelSelectionItems"
                      item-title="label"
                      item-value="name"
                    >
                    </v-select>
                    <ParametersForm
                      :data-name="selectedModel"
                      :items="modelParameters"
                      @updated="updateModel"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="policy">
                  <v-expansion-panel-title>POLICY</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-select
                      :model-value="selectedPolicy"
                      @update:modelValue="selectPolicy"
                      :items="policySelectionItems"
                      item-title="label"
                      item-value="name"
                    ></v-select>
                    <ParametersForm
                      :data-name="selectedPolicy"
                      :items="policyParameters"
                      @updated="updatePolicy"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="options">
                  <v-expansion-panel-title>OPTIONS</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <ParametersForm
                      :items="optionsParameters"
                      @updated="updateOptions"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-form>
          </div>
          <div>
            <v-btn>Submit</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
