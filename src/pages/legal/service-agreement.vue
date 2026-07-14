<script setup lang="ts">
import LegalDocument from '../../components/legal-document.vue'
import { SERVICE_AGREEMENT } from '../../config/legal'
</script>

<template><LegalDocument :document="SERVICE_AGREEMENT" /></template>
