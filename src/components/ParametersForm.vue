<script lang="ts">
export default {
  name: "NumberForm",
};
</script>

<script setup lang="ts">
import { computed, reactive, ref, toRefs, onMounted, watch } from "vue";
import type { Parameter } from "@/data/types";

export interface Props {
  dataName: string;
  items: {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
  }[];
}

const props = defineProps<Props>();
const getModelValues = () => props.items.map(({ value }) => value);
const modelValues = ref(getModelValues());

const name = computed(() => props.dataName);

watch(name, (newName, oldName) => {
  console.log("Form changed from ", oldName, " to ", newName);
  modelValues.value = getModelValues();
});
</script>

<template>
  <h4>Values:</h4>
  <pre>{{ modelValues }}</pre>
  <h4>props:</h4>
  <pre>{{ JSON.stringify(props, null, 2) }}</pre>
  <v-form>
    <v-list lines="two">
      <v-list-item v-for="(item, idx) in items">
        <v-list-item-title>
          <span>{{ item.label }}: </span>
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-slider
            v-model="modelValues[idx]"
            density="compact"
            hide-details
            :min="item.min"
            :max="item.max"
            :step="item.step"
          >
            <template #append>
              <v-text-field
                v-model="modelValues[idx]"
                hide-details
                single-line
                density="compact"
                type="number"
                style="width: 80px"
              >
              </v-text-field>
            </template>
          </v-slider>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-btn color="success">Save</v-btn>
    <v-btn color="error">Cancel</v-btn>
  </v-form>
</template>
