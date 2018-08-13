<template>
    <q-transition
            appear
            enter="fadeInUpBig"
            leave="fadeOutDownBig"
    >
        <slot></slot>
    </q-transition>
</template>
<script>
    export default {
      name: 'transition'
    }
</script>