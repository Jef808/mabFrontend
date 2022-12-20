<script setup lang="ts">
import { computed, isReactive, isRef, reactive, ref, onMounted } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { storeToRefs } from "pinia";
import BarChart from "@/components/BarChart.vue";
import LineChart from "@/components/BarChart.vue";
import fetchMockData from "@/scripts/fetchMockData";
import { useFormStore } from "@/store/form.store";
import { useQueryStore } from "@/store/query.store";
import QueryTextView from "@/components/QueryTextView.vue";
import ParametersForm from "@/components/ParametersForm.vue";

const store = useFormStore();
const queryStore = useQueryStore();

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

const { submitQuery } = queryStore;
const { queryHistory, resultHistory } = storeToRefs(queryStore);

onMounted(() => {});

const debug = ref(true);

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

const chartOptions = {
  reponsive: true,
  maintainAspectRatio: false,
};

const loading = ref(false);
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

function updateModel(values: number[]) {
  onUpdate("model", values);
  panel.value = "policy";
}
function updatePolicy(values: number[]) {
  onUpdate("policy", values);
  panel.value = "options";
}
function updateOptions(values: number[]) {
  onUpdate("options", values);
  panel.value = "";
}

function onCancel() {
  panel.value = "";
}

function onSubmitQuery() {
  loading.value = true;
  submitQuery();
  loading.value = false;
}
</script>

<template>
  <v-app>
    <v-main>
      <v-row>
        <v-col cols="8">
          <v-row>
            <v-col cols="auto">
              <v-container>
                <v-select
                  v-model="chartType"
                  :items="chartSelectionItems"
                  item-title="label"
                  item-value="name"
                >
                </v-select>
                <div>
                  <Suspense
                    @pending="loading = true"
                    @resolve="loading = false"
                  >
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
              </v-container>
            </v-col>
          </v-row>
          <v-row v-if="debug">
            <v-col cols="6">
              <h2>Query History</h2>
              {{ queryHistory.length }} queries
              <v-list>
                <v-list-item v-for="(query, idx) in queryHistory" :key="idx">
                  <QueryTextView :query="query"></QueryTextView>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="6">
              <h2>Result History</h2>
              {{ resultHistory.length }} results
              <v-list>
                <v-list-item v-for="(result, idx) in resultHistory" :key="idx">
                  <QueryTextView :query="result"></QueryTextView>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <div class="form-container">
            <v-form @submit.prevent="onSubmitQuery">
              <v-expansion-panels v-model="panel" v-on-click-outside="onCancel">
                <v-expansion-panel value="model">
                  <v-expansion-panel-title class="text-grey">
                    >MODEL</v-expansion-panel-title
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
                      @update="updateModel"
                      @cancel="onCancel"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="policy">
                  <v-expansion-panel-title class="text-grey"
                    >POLICY</v-expansion-panel-title
                  >
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
                      @update="updatePolicy"
                      @cancel="onCancel"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="options">
                  <v-expansion-panel-title class="text-grey"
                    >OPTIONS</v-expansion-panel-title
                  >
                  <v-expansion-panel-text>
                    <ParametersForm
                      :items="optionsParameters"
                      @update="updateOptions"
                      @cancel="onCancel"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-btn type="submit" color="success">Submit</v-btn>
            </v-form>
          </div>
          <v-checkbox
            id="toggle-debug"
            v-model="debug"
            label="Debug Info"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
