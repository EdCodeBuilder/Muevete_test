<template>
  <v-snackbar v-model="snackWithButtons" :timeout="-1" bottom left>
    Nueva Versión Disponible
    <template #action="{ attrs }">
      <v-btn
        aria-label="Recargar"
        dark
        text
        color="info"
        v-bind="attrs"
        @click.native="refreshApp"
      >
        Recargar
      </v-btn>
      <v-btn aria-label="Cerrar" icon @click="snackWithButtons = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'NewUpdateAvailable',
  data: () => ({
    snackWithButtons: false,
  }),
  async mounted() {
    const workbox = await window.$workbox
    if (workbox) {
      workbox.addEventListener('installed', (event) => {
        // If we don't do this we'll be displaying the notification after the initial installation, which isn't perferred.
        if (event.isUpdate) {
          this.snackWithButtons = true
        }
      })
    }
  },
  methods: {
    refreshApp() {
      window.location.reload()
    },
  },
}
</script>
