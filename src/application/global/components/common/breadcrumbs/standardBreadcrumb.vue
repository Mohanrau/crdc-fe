<template>
    <div class="col-auto">
        <!--v-if="$can($apply(route.meta.permission))"-->
        <q-breadcrumbs color="pink" active-color="grey-6" separator="/">
            <q-breadcrumbs-el v-for="(route, index) in $route.matched" :key="`breadcrumb-$index`"
                              :label="route.name === 'default' ? 'Dashboard' : route.name"
                              :to="route.name === 'default' ? route.redirect : route.path" exact/>
        </q-breadcrumbs>
    </div>
</template>
<script>
  export default {
    name: 'standard-breadcrumb'
  }
</script>