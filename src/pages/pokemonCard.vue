<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps(['data']);
</script>

<template>
    <RouterLink :to="`/${props.data.name}/${props.data.id}`" class="card-box">
        <p class="pokemon-number">#{{ props.data.id }}</p>
        <img :src="props.data.sprites.front_default" :alt="props.data.name">
        <p class="pokemon-name">{{ props.data.name }}</p>
        <div class="types-box">
            <p class="type" v-for="(item, index) in props.data.types" :key="index" :class="item.type.name">
                {{ item.type.name }}
            </p>
        </div>
    </RouterLink>
</template>

<style scoped>
.card-box{
    width: calc(16.66% - 10px);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 5px;
    margin: 0 5px;
    margin-bottom: 10px;
    border-radius: 15px;
    box-shadow: #0000001a 0 4px 12px;
    transition: all .25s ease-out;
    text-decoration: none;
}
.pokemon-number{
    margin: 0;
    line-height: 24px;
    font-size: 15px;
    color: #2C3E50;
    font-family: Inter,system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.card-box img{
    width: 100%;
}
.pokemon-name{
    font-family: Inter,system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 17.55px;
    line-height: 28.08px;
    color: black;
    font-weight: 700;
    text-transform:capitalize;
    text-decoration: none;
    margin: 0;
}
.types-box{
    display:flex;
    flex-direction: row;
    justify-content: center;
}
.type{
    padding: 3px 4px;
    border-radius: 5px;
    margin: 0 3px;
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
</style>