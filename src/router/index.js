// import { createWebHistory, createRouter } from 'vue-router'
// //code tren may thi xai webhistory
// import App from '../App.vue'
// import HomeVue from '../pages/Home.vue'
// import DetailVue from '../pages/Detail.vue'

// const routes = [
//   { path: '/home', component: HomeVue, },
//   { path: '/detail', component: DetailVue },
//   {
//     path: '/name',
//     component: DetailVue,
//   },

// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })
// // de cac file o ngoai co the su dung
// export default router;


import { createWebHistory, createRouter } from 'vue-router';
import pokemonCard from '../pokemonCard.vue';
import pokemonDetail from '../pokemonDetail.vue';
import Home from '../pages/Home.vue'

const routes = [
  {path: '/', component: Home},
  //{ path: '/', component: pokemonCard },
  { path: '/:name/:id', component: pokemonDetail},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;