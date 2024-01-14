<template>
  <div class="justify-center max-w-md mt-10">
    <h1 class="text-3xl font-extrabold leading-10 tracking-tigh">
      Challenge completed!
    </h1>
    <div class="mt-8">
      <section>
        <h2 class="text-2xl font-bold leading-6">Exercise 1</h2>

        <div class="mt-5">
          <router-link class="animate-pulse px-4 pb-1 my-5 block w-64 mx-auto font-black text-xl border text-white rounded-full bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" to="/currency-quest">
            Currency Quest
          </router-link>
          <p>
            I used <a class="italic font-bold underline" href="https://countries.trevorblades.com/" target="_blank" rel="noopener noreferrer">trevorblades graphQl country API </a> to get the data for the currency quest. 
            I used an addition REST to get currency name information <a href="https://restcountries.com/#endpoints-currency" target="_blank" rel="noopener noreferrer">REST COUNTRIES</a>
          </p>

        </div>
      </section>
      <section class="mt-10">
        <h2 class="text-2xl font-bold leading-6">Exercise 2</h2>
        <div class="mt-5">
          <button v-on:click="lauchToast" class="animate-pulse px-4 pb-1 my-5 block w-64 mx-auto font-black text-xl border text-white rounded-full bg-gradient-to-r from-red-500 from-10% via-ping-500 via-30% to-orange-500 to-90%" >
           Global Toast
          </button>
          <p>
            A simple global toast/notify component which can be used from anywhere in the app.
          </p>

        </div>
        <div class="mt-5">
          <a
            class="text-blue-600 cursor-pointer hover:text-blue-800"
            v-on:click="showNextExercise('third')"
            >{{
              showExercise.third
                ? 'Hide the next exercise'
                : 'Show the next exercise'
            }}</a
          >
        </div>
      </section>
      <section v-if="showExercise.third" class="mt-10">
        <h2 class="text-2xl font-bold leading-6">Exercise 3</h2>
        <div class="mt-5">
          <p>
            Please integrate a testing library in the current app:: Vitest integrated and tested
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ShowExercises } from '../types/exercise'
import useToast from '../composables/useToast'

const { showToastMessage, toastTitle, toastMessage, toastType, toastTimeout } = useToast()

function lauchToast() {
  toastTitle.value = 'Global Toast'
  toastMessage.value = 'A global tost/notify directly from composable without staate manager like vuex o pinia.' 
  toastType.value = 'info'
  toastTimeout.value = 3000
  showToastMessage()
}

const showExercise = reactive<ShowExercises>({
  second: false,
  third: false,
})

const showNextExercise = (exercise: keyof ShowExercises) => {
  showExercise[exercise] = !showExercise[exercise]
}
</script>
