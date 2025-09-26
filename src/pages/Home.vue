<script setup>
import {ref} from 'vue';
import {computed} from 'vue';
import { onMounted } from 'vue';
import pokemonCard from './pokemonCard.vue'
import pokemonDetail from './pokemonDetail.vue'
const dataList = ref([]);
const pokemonCount = ref(36);
async function fetchData() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=898"); 
    const { results } = await res.json(); 
    const waitData = results.map(async (el) => {
        const response = await fetch(el.url); 
        return response.json();
        // dataList.value.push(data);
    });
    //đợi để lấy đủ tất cả dữ liệu
    const allData = await Promise.all(waitData);
    dataList.value.push(...allData);
}
const search_text = ref(null);
const searchPokemon = computed(() => {
    if(!search_text.value) return dataList.value;
    else {
        return dataList.value.filter(pokemon => 
            pokemon.name.toLowerCase().includes(search_text.value.toLowerCase())
        );
    }
});

const clickedPokemon = ref(null);
const clickPokemon = (pokemon) => {
    clickedPokemon.value = pokemon;
};
const closeDetail = () => {
    clickedPokemon.value = null;
};

const displayedPokemon = computed(() => {
    return searchPokemon.value.slice(0, pokemonCount.value);
}) 
const loadMore = () => {
    pokemonCount.value *= 2;
}
onMounted(() =>{
    fetchData()
})
</script>
<template>
    <div class = "body"> 
         <div class="header" v-if="!clickedPokemon">
            <h2 class="header-title">POKEMON API</h2>
            <div class="search">
                <input v-model = "search_text" type="text" id="search-input" placeholder="Search some Pokemon..." autocomplete="off">
            </div>
        </div>
        <div v-if="search_text && searchPokemon.length === 0" class="no-result">
            No Pokémon matched with 
            <span style="font-weight: bold">"{{ search_text }}"</span>
        </div>
        <div class = "container" v-if="!clickedPokemon">
            <pokemonCard v-for="item in displayedPokemon" :key="item.id" :data="item" @click="clickPokemon(item)"/>
        </div>
        <pokemonDetail v-if="clickedPokemon" :data="clickedPokemon" @close="closeDetail" />
        <div class="load" v-if="!clickedPokemon && !search_text">
            <button class="load_button" @click="loadMore">Load More</button>
        </div>
    </div> 
    <!-- <main>
    <RouterView />
    </main> -->
</template>
<style scoped>
*{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
.body {
    background-color: #fff;
    margin: 50px auto;
    max-width: 1200px;
}
.header{
    display:flex;
    flex-direction: column;
    align-items: center;
}
.header-title {
    font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 37.5px;
    color: #2C3E50;
    font-weight: 500;
    margin-bottom: 50px;
}
.search {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    width: 500px;
    margin: 0 15px 50px;
}
.search input {
    width: 100%;
    font-size: 16px;
    padding: 20px;
    padding: 20px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 30px;
    background-color: white;
    outline: 1px solid #00000036;
    box-shadow: #64646f33 0 7px 29px;
    font-size: 16px;
    transition: all .2s ease;
    color: #333;
}
.search input:focus {
    outline: 1px solid #000000;
}
.no-result {
  text-align:start;
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}
.container{
    display: flex;
    flex-direction: row;
    justify-content:flex-start;
    flex-wrap: wrap;
}
.load{
    display:flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
    width: 100%;
    text-align: center;
}
.load_button{
    cursor: pointer;
    padding: 20px 25px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #ff4d4f;
    transition: all .25s cubic-bezier(.02,.01,.47,1);
}
.load_button:hover {
    background-color: #ff7875;
}
</style> 