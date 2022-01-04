import { FreshLayoutItem } from '../fresh-layout-item'

export const categories: FreshLayoutItem = {
  name: 'categories',
  displayName: '分区',
  component: () => import('./Categories.vue').then(m => m.default),
}
