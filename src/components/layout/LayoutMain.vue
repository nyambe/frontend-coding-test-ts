<template>
  <nav class="text-white bg-gray-800">
    <div class="px-8 mx-auto">
      <div class="relative flex items-center justify-between h-16">
        <div
          class="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start"
        >
          <div class="flex items-center flex-shrink-0">
            <img class="w-14 h-14" src="../../assets/logo.svg" />
            <img class="ml-3" src="../../assets/logotype.svg" />
          </div>
          <div class="flex items-center ml-10 align-middle">
            <div class="flex space-x-4">
              <router-link
                to="/"
                class="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
                exact-active-class="text-white bg-gray-900"
                >Home</router-link
              >
              <router-link
                to="/countries"
                class="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
                exact-active-class="text-white bg-gray-900"
                >Countries</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <main class="flex justify-center">
    <router-view />
  </main>
</template>
