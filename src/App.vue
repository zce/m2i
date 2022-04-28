<template>
  <textarea class="block md:w-2/3 m-2 px-4 py-3 border-gray-200 rounded text-base font-mono whitespace-nowrap md:resize-x focus:ring-indigo-500 focus:border-indigo-500" rows="20" v-model="markdown" placeholder="Markdown" spellcheck="false"></textarea>
  <section class="flex flex-col flex-1 m-2">
    <label for="template" class="sr-only">Template</label>
    <textarea id="template" class="block mb-3 px-3 py-2 border-gray-200 rounded text-sm font-mono whitespace-nowrap focus:ring-indigo-500 focus:border-indigo-500" rows="10" v-model="template" placeholder="Custom html template" spellcheck="false"></textarea>
    <div class="flex pb-3">
      <div class="flex-1 relative rounded">
        <label for="width" class="sr-only">Width</label>
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span class="text-gray-400">↔︎</span></div>
        <input type="number" id="width" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 pr-16 border-gray-300 rounded" v-model="width" placeholder="Output width">
        <div class="absolute inset-y-0 right-0 flex items-center">
          <label for="scale" class="sr-only">Scale</label>
          <select id="scale" class="focus:ring-indigo-500 focus:border-indigo-500 pl-2 pr-7 border-transparent bg-transparent text-gray-500 rounded" v-model="scale">
            <option value="1">@1x</option>
            <option value="2">@2x</option>
            <option value="3">@3x</option>
          </select>
        </div>
      </div>
      <button :disabled="generating || !markdown" @click="generate" class="flex items-center ml-2 py-2 px-4 border border-transparent font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg v-if="generating" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generate
      </button>
    </div>
    <div ref="output" class="flex-1 w-full overflow-auto"></div>
    <iframe ref="viewer" class="absolute" :srcdoc="html" frameborder="0" :width="width" height="0"></iframe>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import html2canvas from 'html2canvas'

const markdown = ref(`# m2i

> A markdown to image services.

## Online Demo

- https://m2i.zce.me

## Built With

- [Vite](https://github.com/vitejs/vite) - Next generation frontend tooling
- [Vue.js 3](https://github.com/vuejs/vue-next) - a progressive, incrementally-adoptable JavaScript framework for building UI on the web
- [html2canvas](https://github.com/niklasvh/html2canvas) - Screenshots with JavaScript
- [marked](https://github.com/markedjs/marked) - A markdown parser and compiler.

## Related

- [zce/m2i](https://github.com/zce/m2i) - A minimalist CLI markdown to image converter.

## License

[MIT](LICENSE) &copy; [zce](https://zce.me)
`)
const width = ref(600)
const scale = ref(2)
const template = ref(`<link rel="stylesheet" href="https://s.zce.me/assets/markdown.css">
{{markdown}}`)

const html = computed(() => template.value.replace('{{markdown}}', marked(markdown.value).trim()))

const viewer = ref(null)
const output = ref(null)

const generating = ref(false)

const generate = async () => {
  const element = viewer.value?.contentDocument?.documentElement
  if (!element) return
  generating.value = true
  const canvas = await html2canvas(element, {
    allowTaint: true,
    width: width.value,
    scale: scale.value,
    backgroundColor: null
  })
  canvas.style.height = 'auto'
  canvas.style.width = '100%'
  output.value.innerHTML = ''
  output.value.appendChild(canvas)
  generating.value = false
}
</script>
