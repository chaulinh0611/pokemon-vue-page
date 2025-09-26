<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const pokemon = ref(null);
const quote = ref(null);
const evolutionPokemon = ref([]);

async function fetchPokemon() {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route.params.name}`);
    pokemon.value = await res.json();

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${route.params.name}`);
    quote.value = await speciesRes.json(); 

     // Lấy chuỗi tiến hóa
     const evolutionRes = await fetch(quote.value.evolution_chain.url);
    const evolutionData = await evolutionRes.json();

    // Xử lý chuỗi tiến hóa
    await fetchEvolutionPokemon(evolutionData.chain);
}
async function fetchEvolutionPokemon(chain){
    evolutionPokemon.value = [];
    async function checkEvolution(evolution){
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`);
        const data =await res.json();
        evolutionPokemon.value.push(data);
        for(const nextEvolution of evolution.evolves_to){
            await checkEvolution(nextEvolution);
        }
    }
    await checkEvolution(chain);
}
const flavorText = computed(() => {
    const flavor = quote.value.flavor_text_entries.find(entry => entry.language.name === "en");
    return flavor.flavor_text.replace(/\n|\f/g, ' ').replaceAll("▲", "▲");
});

// const  savedData = JSON.parse
const statName = {
    "hp": "HP",
    "attack": "ATK",
    "defense": "DEF",
    "special-attack": "SPA",
    "special-defense": "SPD",
    "speed": "SPD"
};
function extractEvolutionChain(chain) {
    evolutionPokemon.value = [];

    function traverseEvolution(stage) {
        if (!stage) return; // Kiểm tra nếu không còn tiến hóa nữa
        evolutionPokemon.value.push(stage.species.name);

        // Nếu có tiến hóa tiếp theo, lặp qua tất cả các nhánh
        stage.evolves_to.forEach(nextStage => {
            traverseEvolution(nextStage);
        });
    }
    //đệ quy để lấy hết các evolution
    traverseEvolution(chain);
}
onMounted(fetchPokemon);
</script>

<template>
    <div class = "body">
        <div class="pokemonDetail" v-if="pokemon" >
            <button @click="router.push('/')"> < Back</button>
            <div class = "pokemonDetail-content">
            <img :src="pokemon.sprites.front_default" :alt="pokemon.name" /> 
            <div class="types-box">
                <p class="type" v-for="(item, index) in pokemon.types" :key="index" :class="item.type.name">
                    {{ item.type.name }}
                </p>
            </div>
            <h2>{{ pokemon.name }}</h2>
            <p class="quote">{{ flavorText }}</p>
            <div class="detail-wrap">
                <div class="detail">
                    <h3>Height</h3> 
                    <span>{{ pokemon.height }}</span>
                </div>
                <div class="detail">
                    <h3>Weight</h3> 
                    <span>{{ pokemon.weight }}</span>
                </div>
            </div>
            <div class="abilities">
                <h3>Abilities</h3>
                <div class="abilities-content">
                    <p class="ability" v-for="(item, index) in pokemon.abilities" :key="index" >
                        {{ item.ability.name }}
                    </p>
                </div>
            </div>
            <div class="stats">
                <h3>Stats</h3>
                <div class="stats-content">
                    <div class="stat" v-for="(item, index) in pokemon.stats" :key="index">
                        <p class="stat-name" :class="item.stat.name">{{ statName[item.stat.name] || item.stat.name }}</p>
                        <p class="stat-base">{{ item.base_stat}}</p>
                    </div>
                </div>
            </div>
            <div class="evolution">
                <h3>Evolution</h3>
                <div class="evolution-content">
                        <div v-for="(item, index) in evolutionPokemon" :key="index" class="evolution-pokemon">
                            <div v-if="index !== 0" class="evolution-divider"> > </div>
                            <h4>{{ item.name }}</h4>
                            <img :src="item.sprites.front_default" :alt="item.name">
                        </div>
                    </div>
            </div>
        </div>
        </div>
        <div v-else class="getting-data">
            <p>Getting data from PokéDex...</p>
        </div>
    </div>
</template>
<style scoped>
.body{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.pokemonDetail{
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.pokemonDetail button{
  display: block;
  position: fixed;
  top: 5%;
  color: #000000;
  left: 5%;
  border-radius: 30px;
  padding: 5px 10px;
  box-shadow: #63636333 4px 8px;
  border-color: #fff;
  background-color: #fff;
  /* z-index: 999; */
}
.pokemonDetail-content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  width: 100%;
  padding-top: 50px;
}
.pokemonDetail-content img{
  width: 200px;
  height: 200px;
  margin: auto;
  background-size: cover;
}
.pokemonDetail-content h2{
  white-space: nowrap;
  font-weight: 700;
  text-align: center;
  text-transform: capitalize;
  margin: 0;
  line-height: 36px;
}
.quote{
    text-align: center;
    font-size: 15px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin-bottom: 10px;
}
.detail-wrap{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 5px;
}
.detail{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.detail h3{
    margin: 0;
    font-weight: 600;
    font-size: 17.55px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    text-align: center;
    margin-bottom: 5px;
}
.detail span{
    width: 100px;
    margin: 5px;
    padding: 2px;
    border-radius: 30px;
    background-color: #f6f8fc;
    text-align: center;
    text-transform: capitalize;
}
.abilities, .stats, .evolution{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}
.abilities-content, .stats-content{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.abilities h3, .stats h3, .evolution h3{
    margin: 0;
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 17.55px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.ability{
    width: 100px;
    margin: 5px;
    padding: 2px;
    border-radius: 30px;
    background-color: #f6f8fc;
    text-align: center;
    text-transform: capitalize;
    font-size: 15px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.stat{
    margin: 5px;
    padding: 5px;
    background-color: #f6f8fc;
    text-align: center;
    border-radius: 30px;
    box-shadow: #63636333 0 2px 8px;
}
.stat-name{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    font-size: 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    margin: 0;
}
.stat-name.hp{
    background-color:#df2140;
}
.stat-name.attack{
    background-color: #ff994d;
}
.stat-name.defense{
    background-color: #eecd3d;
}
.stat-name.special-attack{
    background-color: #85ddff;
}
.stat-name.special-defense{
    background-color: #96da83;
}
.stat-name.speed{
    background-color: #fb94a8;
}
.stat-base{
    margin: 0;
    font-size: 15px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color:#2c3e50
}
.types-box{
    display:flex;
    flex-direction: row;
    justify-content: center;
}
.type{
    padding: 3px 4px;
    border-radius: 5px;
    margin: 0 3px 5px;
    font-size: 13px;
    font-weight: 600;
    font-size: 13px;
    color:black;
    line-height: 1.5;
    font-family: Inter,system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;;
    text-transform: capitalize;
    box-shadow: #0000000d 0 6px 24px, #00000014 0 0 0 1px;
}
.type.grass{
    background:#78cd54;
}
.type.poison {
    background-color: #a33ea1;
}
.type.fire {
    background-color: #ff421c;
}
.type.flying{
    background-color: #a98ff3;
}
.type.water{
    background-color: #6390f0;
}
.type.bug{
    background-color: #a6b91a;
}
.type.normal{
    background-color: #a8a77a;
}
.type.electric{
    background-color: #f7d02c;
}
.type.ground{
    background-color: #e2bf65;
}
.type.fairy{
    background-color: #d685ad;
}
.type.psychic{
    background-color: #f95587;
}
.type.water{
    background-color: #6390f0;
}
.type.rock{
    background-color: #b6a136;
}
.type.dark{
    background-color: #705746;
}
.type.dragon{
    background-color: #6f35fc;
}
.type.ghost{
    background-color: #735797;
}
.type.flying{
    background-color: #a98ff3;
}
.type.bug{
    background-color: #a6b91a;
}
.type.fighting{
    background-color: #c22e28;
}
.type.ice{
    background-color: #96d9d6;
}
.type.steel{
    background-color: #b7b7ce;
}
.evolution-content, .evolution-pokemon{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
.evolution-pokemon h4{
    white-space: nowrap;
    font-weight: 600;
    text-align: center;
    text-transform: capitalize;
}
.evolution-pokemon img{
    width: 96px;
    height: 96px;
}
.evolution-divider{
    align-items: center;
    font-weight: 700;
    margin-right: 10px;
}

.getting-data {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  font-size: 40px;
  font-weight: 400;
}
</style>