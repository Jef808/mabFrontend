<script setup lang="ts">
import type { DataQuery } from "@/data/types";
export interface Props {
  query: DataQuery;
}
const props = defineProps<Props>();
</script>

<template>
  <v-card variant="outlined">
    <span
      ><h3>{{ query.model.name }}</h3></span
    >
    <v-list>
      <v-list-item v-for="param in query.model.parameters" :key="param.name">
        <v-list-item-title>{{ param.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ param.value }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <span
      ><h3>{{ query.policy.name }}</h3></span
    >
    <v-list>
      <v-list-item v-for="param in query.policy.parameters" :key="param.name">
        <v-list-item-title>{{ param.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ param.value }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <span><h3>Options:</h3></span>
    <v-list>
      <v-list-item v-for="param in query.options" :key="param.name">
        <v-list-item-title>{{ param.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ param.value }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>
