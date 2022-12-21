<script setup lang="ts">
import { computed } from "vue";
import type { DataQuery } from "@/data/types";
export interface Props {
  query: DataQuery;
}
const props = defineProps<Props>();

const toNamedValue = (obj: object) => {
  const NamedValue = Object.entries(obj);
  return { name: NamedModel[0], value: NamedModel[1] };
};

const extractParameters = (queryParams) => {
  return Object.entries(queryParams).map((p) => {
    const [name, value] = p;
    return { name, value };
  });
};

const modelParameters = computed(() => {
  return extractParameters(props.query.modelParameters);
});
const policyParameters = computed(() => {
  return extractParameters(props.query.policyParameters);
});
const optionsParameters = computed(() => {
  return extractParameters(props.query.options);
});
</script>

<template>
  <v-card variant="outlined">
    <v-list>
      <v-list-subheader title="Model"> </v-list-subheader>
      <v-list-item-group>
        <v-card>
          <v-list-item
            v-for="param in modelParameters"
            v-slot="{ isSelected, selectedClass, toggle }"
            :title="param.name"
            :subtitle="param.value"
            :value="param.value"
          >
          </v-list-item>
        </v-card>
      </v-list-item-group>
      <v-list-subheader title="Policy"></v-list-subheader>
      <v-card>
        <v-list-item
          v-for="param in policyParameters"
          v-slot="{ isSelected, selectedClass, toggle }"
          :key="param.name"
          :title="param.name"
          :subtitle="param.value"
          :value="param.value"
        >
        </v-list-item>
      </v-card>
      <v-list-subheader title="Options"></v-list-subheader>
      <v-card>
        <v-list-item
          v-for="param in optionsParameters"
          v-slot="{ isSelected, selectedClass, toggle }"
          :key="param.name"
          :title="param.name"
          :subtitle="param.value"
          :value="param.value"
        >
        </v-list-item>
      </v-card>
    </v-list>
  </v-card>
</template>
