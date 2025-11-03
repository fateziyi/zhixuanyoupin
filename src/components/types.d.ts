declare module '@/components' {
  const component: any
  export default component
}

declare module 'virtual:svg-icons-register' {
  const content: any
  export default content
}

declare module '@/App.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}