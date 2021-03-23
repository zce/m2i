<template>
  <label for="editor">Markdown</label>
  <textarea name="markdown" id="editor" cols="30" rows="14" v-model.lazy="markdown" placeholder="Markdown"></textarea>
  <details>
    <summary>Advanced settings</summary>
    <div>
      <label for="width">width</label>
      <input type="number" name="width" id="width" v-model="width" placeholder="Viewport width">
      <label for="scale">scale</label>
      <input type="number" name="scale" id="scale" v-model="scale" placeholder="Device scale factor">
      <label for="template">template</label>
      <textarea name="template" id="template" cols="30" rows="6" v-model="template" placeholder="HTML template"></textarea>
      <small><code v-pre>{{markdown}}</code> will be replaced with the converted markdown html.</small>
    </div>
  </details>
  <iframe ref="viewer" :srcdoc="html" frameborder="0" :width="width" height="0"></iframe>
  <button :disabled="loading || !html" @click="generate"><i v-show="loading"></i>Generate</button>
</template>

<script setup>
import { ref, computed } from 'vue'
import marked from 'marked'
import html2canvas from 'html2canvas'

const markdown = ref('')
const width = ref(600)
const scale = ref(2)
const template = ref('<link rel="stylesheet" href="https://cdn.zce.me/markdown.css">{{markdown}}')

const html = computed(() => template.value.replace('{{markdown}}', marked(markdown.value).trim()))

const viewer = ref(null)

const loading = ref(false)

const generate = async () => {
  const element = viewer.value?.contentDocument?.documentElement
  if (!element) return
  loading.value = true
  const canvas = await html2canvas(element, {
    allowTaint: true,
    width: width.value,
    scale: scale.value,
    backgroundColor: null
  })
  viewer.value.after(canvas)
  loading.value = false
}
</script>

<style>
label {
  display: block;
  margin: .5rem 0;
  font-weight: 700;
}

input, textarea {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  padding: .5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: .25rem;
  box-sizing: border-box;
  color: #33404d;
  line-height: inherit;
  font-size: 16px;
  resize: vertical;
  transition: border .3s, background .3s, color .3s, box-shadow .3s;
}

input:focus, textarea:focus {
  box-shadow: 0 0 0 .25rem var(--color-primary-alpha);
  border-color: var(--color-primary);
  outline: 0;
}

details {
  margin: 1rem 0;
  border: 1px solid var(--border-color);
  border-radius: .25rem;
  transition: background .3s ease 0s, box-shadow .3s ease 0s;
}

details[open] {
  background: #fff;
}

details summary {
  padding: .5rem 1rem;
  font-weight: 500;
  user-select: none;
  cursor: pointer;
  outline: 0;
}

details div {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

details small {
  margin: 0;
  font-size: .875rem;
  line-height: 2;
}

details code {
  padding: .125rem .25rem;
  border-radius: .125rem;
  color: var(--body-bg);
  background: var(--body-color);
}

button {
  appearance: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 2rem 0 5rem;
  padding: .5rem .75rem;
  border: 1px solid var(--color-primary);
  border-radius: .25rem;
  background: var(--color-primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  line-height: inherit;
  cursor: pointer;
  user-select: none;
  transition: border .3s, background .3s, color .3s;
}

button:hover:not(:disabled) {
  border-color: var(--color-primary-dark);
  background: var(--color-primary-dark);
}

button:focus:not(:disabled) {
  box-shadow: 0 0 0 .25rem var(--color-primary-alpha);
  border-color: var(--color-primary);
  outline: 0;
}

button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

button i {
  display: inline-block;
  margin-right: .5rem;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  width: .75rem;
  height: .75rem;
  animation: rotate .5s linear infinite;
}

iframe {
  position: absolute;
}

canvas {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto !important;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}
</style>
