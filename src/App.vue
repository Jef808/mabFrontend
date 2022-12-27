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
import useIconExpanded from "@/scripts/useIconExpanded";
import { rollup } from "@/scripts/formatSeries";

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

const { submitQuery, setWebSocketUrl, wsReset, wsClose } = queryStore;
const { queryHistory, resultHistory, wsStatus, wsUrl } =
  storeToRefs(queryStore);

const wsUrlRef = ref(wsUrl);
const debug = ref(true);
const showWsInfo = ref(true);

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

function onSubmitWsUrl() {
  if (wsUrlRef.value === wsUrl.value) return;
  setWebSocketUrl(wsUrlRef.value);
}

function onResetWs() {
  wsReset();
}

function onCloseWs() {
  wsClose("Explicit Stop");
}

const wsColor = computed(() => {
  const { [`${wsStatus.value}`]: color } = {
    OPEN: "green-lighten-4",
    CONNECTING: "yellow-accent-1",
    CLOSED: "red-darken-2",
  };
  return color;
});
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
                  <pre>{{ rollup(result.series) }}</pre>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4">
          <div class="form-container">
            <v-form @submit.prevent="onSubmitQuery">
              <v-expansion-panels v-model="panel" v-on-click-outside="onCancel">
                <v-expansion-panel value="model" title="MODEL">
                  <!-- <v-expansion-panel-title class="text-grey">
                       MODEL</v-expansion-panel-title
                       > -->
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
                      @change="updateModel"
                      @cancel="onCancel"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="policy" title="POLICY">
                  <!-- <v-expansion-panel-title class="text-grey"
                       >POLICY</v-expansion-panel-title
                       > -->
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
                      @change="updatePolicy"
                      @cancel="onCancel"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel value="options" title="OPTIONS">
                  <v-expansion-panel-text>
                    <ParametersForm
                      :items="optionsParameters"
                      @change="updateOptions"
                      @cancel="onCancel"
                    ></ParametersForm>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-container>
                <v-btn type="submit" color="primary" block>Submit</v-btn>
              </v-container>
            </v-form>
          </div>
          <v-checkbox
            id="toggle-debug"
            v-model="debug"
            label="Debug Info"
          ></v-checkbox>
          <v-container id="websocket-tile">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-title :color="wsColor">
                  <v-row>
                    <v-col cols="6" class="d-flex align-center">
                      <v-list-item-title>WebSocket Info</v-list-item-title>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-center">
                      <v-list-item title="Status" :subtitle="wsStatus">
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-form @submit.prevent="onSubmitWsUrl">
                    <v-text-field label="Url" v-model="wsUrlRef"></v-text-field>
                    <v-row>
                      <v-col cols="12" class="d-flex justify-end space-between">
                        <v-row>
                          <v-spacer></v-spacer>
                          <v-col cols="auto">
                            <v-btn type="button" @click="onResetWs"
                              >Reset</v-btn
                            >
                          </v-col>
                          <v-col cols="auto">
                            <v-btn type="button" @click="onCloseWs">Stop</v-btn>
                          </v-col>
                          <v-col cols="auto">
                            <v-btn type="submit">Save</v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
