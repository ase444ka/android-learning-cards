<template>
<SshPre :language="props.lang" dark>
    {{localCode}}
</SshPre>
</template>

<script setup>
import SshPre from 'simple-syntax-highlighter'
import 'simple-syntax-highlighter/dist/sshpre.css'
import { ref,  onMounted } from 'vue'
const props = defineProps(['lang', 'code'])
const localCode = ref(null)

onMounted(() => {
    localCode.value = props.code
    console.log(localCode.value);
})


</script>