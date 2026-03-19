<script setup>
import DefaultTheme from 'vitepress/theme'
import { ref } from 'vue'

const { Layout } = DefaultTheme
const dismissed = ref(false)
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <div v-if="!dismissed" class="zach-footer-logo">
        <button class="zach-footer-dismiss" @click.stop.prevent="dismissed = true" aria-label="Dismiss">&times;</button>
        <a href="https://zach.dev" target="_blank" rel="noopener noreferrer">
          <img src="https://zach.dev/images/statue.png" alt="zach.dev" class="zach-footer-statue" />
          <span class="zach-footer-text">Built by zach.dev</span>
        </a>
      </div>
    </template>
  </Layout>
</template>
