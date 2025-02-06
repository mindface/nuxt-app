<script setup lang="ts">
import BaseHeader from "../components/BaseHeader.vue";
const router = useRouter();

onMounted(() => {
	// const loginId = localStorage.getItem('id') ?? ''
	// const loginPass = localStorage.getItem('password') ?? ''
	// if(loginId === 'pass' && loginPass === 'word' ) {
	//   router.push('/')
	// }else {
	//   router.push('/login')
	// }
});

// watch(() => route.path , () => {
//   navigateTo({path: '/'})
//   console.log(route)
// })
</script>

<template>
  <div class="wrapper">
    <BaseHeader />
    <main class="p-2">
      <slot />
    </main>
  </div>
</template>
