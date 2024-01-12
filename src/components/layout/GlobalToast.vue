<template>
	<transition name="fade">
    <div v-if="showToast" class="absolute w-full bottom-10">

			<button v-on:click="showToast=false" class="max-w-xl mx-auto">
				<div v-bind:class="toastClass" role="alert">
					<div class="flex text-left">
						<div class="py-1"><svg class="w-6 h-6 mr-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
						<div>
							<p class="font-bold">{{ toastTitle }} </p>
							<p class="text-sm"> {{ toastMessage }} </p>
						</div>
					</div>
				</div>
			</button>

		</div>
	</transition>
</template>

<script setup lang="ts">
import useToast from '../../composables/useToast';

const { showToast, toastMessage, toastTitle, toastType, toastClass } = useToast();


</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>