<template>
  <v-card flat>
    <v-toolbar fixed tile extended flat dark color="primary">
      <v-btn icon dark @click="onCancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title v-text="$t('addressDialog.title')" />
      <v-spacer></v-spacer>
      <v-btn
        :aria-label="$t('buttons.Save')"
        class="hidden-md-and-up"
        dark
        icon
        @click="onSave"
      >
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn :aria-label="$t('buttons.Save')" dark text @click="onSave">
          <v-icon left>mdi-content-save</v-icon>
          {{ $t('buttons.Save') }}
        </v-btn>
      </v-toolbar-items>
      <template #extension>
        <v-col cols="12" sm="12" class="mx-auto">
          <v-text-field
            v-model="address"
            readonly
            prepend-icon="mdi-dots-horizontal"
            :label="$t('addressDialog.input')"
            append-outer-icon="mdi-backspace"
            @click:append-outer="onDelete"
          />
        </v-col>
      </template>
    </v-toolbar>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <small>{{ $t('addressDialog.helpText') }}</small>
          <div class="hidden-md-and-up">
            <br />
            <span>
              <v-icon>mdi-help-circle-outline</v-icon>
              {{ $t('addressDialog.help') }}
            </span>
            <br />
            <small>
              {{ $t('addressDialog.toEnd') }}
              <v-icon right>mdi-content-save</v-icon>
            </small>
            <br />
            <small>
              {{ $t('addressDialog.toDelete') }}
              <v-icon right>mdi-backspace</v-icon>
            </small>
            <br />
            <small>
              {{ $t('addressDialog.toDeleteAll') }}
              <v-icon right>mdi-close</v-icon>
            </small>
            <br />
            <small>{{ $t('addressDialog.toComplement') }}</small>
          </div>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn class="hidden-sm-and-down" icon v-on="on">
                <v-icon>mdi-help-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('addressDialog.help') }}
            </span>
            <br />
            <small>
              {{ $t('addressDialog.toEnd') }}
              <v-icon dark right>mdi-content-save</v-icon>
            </small>
            <br />
            <small>
              {{ $t('addressDialog.toDelete') }}
              <v-icon dark right>mdi-backspace</v-icon>
            </small>
            <br />
            <small>
              {{ $t('addressDialog.toDeleteAll') }}
              <v-icon dark right>mdi-close</v-icon>
            </small>
            <br />
            <small>{{ $t('addressDialog.toComplement') }}</small>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <h2 class="title mb-2">
            {{ $t('addressDialog.frequentNom') }}
            <v-btn small text outlined @click="all_types = !all_types">
              {{ $t(`buttons.${all_types ? 'ViewLess' : 'ViewMore'}`) }}
            </v-btn>
          </h2>
          <v-btn
            v-for="(frequent, index) in frequents"
            :key="`NF-${index}`"
            class="ma-2"
            small
            outlined
            :value="frequent.id"
            @click="onPress(frequent.id)"
            v-text="frequent.name"
          />
          <v-divider />
          <v-slide-y-transition appear>
            <div v-if="all_types">
              <h2 class="title mb-2">
                {{ $t('addressDialog.Noms') }}
              </h2>
              <v-text-field
                v-model="search"
                clearable
                prepend-icon="mdi-dots-horizontal"
                :label="$t('addressDialog.filterNoms')"
              />
              <v-btn
                v-for="(type, index) in addresses_types"
                :key="`N-${index}`"
                class="ma-2"
                small
                outlined
                :value="type.id"
                @click="onPress(type.id)"
                v-text="type.name"
              />
            </div>
          </v-slide-y-transition>
          <h2 class="title mb-2">{{ $t('addressDialog.Numbers') }}</h2>
          <v-btn
            v-for="(val, index) in numbers"
            :key="`#-${index}`"
            class="ma-2"
            small
            rounded
            outlined
            :value="val"
            @click="onPress(val, true)"
            v-text="val"
          />
          <v-divider></v-divider>
          <h2 class="title mb-2">{{ $t('addressDialog.Letters') }}</h2>
          <v-btn
            v-for="(letter, index) in letters"
            :key="`L-${index}`"
            class="ma-2"
            small
            rounded
            outlined
            :value="letter.id"
            @click="onPress(letter.id)"
            v-text="letter.name"
          />
          <v-divider></v-divider>
          <h2 class="title mb-2">{{ $t('addressDialog.Quadrant') }}</h2>
          <v-btn
            v-for="(quadrant, index) in quadrants"
            :key="`C-${index}`"
            class="ma-2"
            small
            outlined
            :value="quadrant.id"
            @click="onPress(quadrant.id)"
            v-text="quadrant.name"
          />
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" lg="12" sm="12">
          <h2 class="title mb-2">{{ $t('addressDialog.Complement') }}</h2>
          <v-text-field
            v-model="complement"
            clearable
            :disabled="!address || address.length <= 0"
            prepend-icon="mdi-dots-horizontal"
            :label="$t('addressDialog.AddComplement')"
          >
            <template #append-outer>
              <v-btn
                small
                color="primary"
                :disabled="!address || address.length <= 0"
                @click="onPress(complement)"
                v-text="$t('addressDialog.AddComplement')"
              />
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <slot />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'VAddressField',
  data: () => ({
    address: '',
    dialog: false,
    tooltip: false,
    all_types: false,
    search: null,
    types: [
      { id: 'AD', name: 'ADMINISTRACION' },
      { id: 'AG', name: 'AGENCIA' },
      { id: 'AGP', name: 'AGRUPACION' },
      { id: 'AK', name: 'AVENIDA CARRERA' },
      { id: 'AL', name: 'ALTILLO' },
      { id: 'ALM', name: 'ALMACEN' },
      { id: 'AP', name: 'APARTAMENTO' },
      { id: 'APTDO', name: 'APARTADO' },
      { id: 'AUT', name: 'AUTOPISTA' },
      { id: 'AV', name: 'AVENIDA' },
      { id: 'BG', name: 'BODEGA' },
      { id: 'BL', name: 'BLOQUE' },
      { id: 'BLV', name: 'BOULEVAR' },
      { id: 'BRR', name: 'BARRIO' },
      { id: 'CA', name: 'CASA' },
      { id: 'CC', name: 'CENTRO COMERCIAL' },
      { id: 'CD', name: 'CIUDADELA' },
      { id: 'CEL', name: 'CELULA' },
      { id: 'CIR', name: 'CIRCULAR' },
      { id: 'CL', name: 'CALLE' },
      { id: 'CN', name: 'CAMINO' },
      { id: 'CON', name: 'CONJUNTO RESIDENCIAL' },
      { id: 'CONJ', name: 'CONJUNTO' },
      { id: 'CR', name: 'CARRERA' },
      { id: 'CRR', name: 'CORREGIMIENTO' },
      { id: 'CRT', name: 'CARRETERA' },
      { id: 'CRV', name: 'CIRCUNVALAR' },
      { id: 'CS', name: 'CONSULTORIO' },
      { id: 'DG', name: 'DIAGONAL' },
      { id: 'DP', name: 'DEPOSITO' },
      { id: 'DPTO', name: 'DEPARTAMENTO' },
      { id: 'DS', name: 'DEPOSITO SOTANO' },
      { id: 'ED', name: 'EDIFICIO' },
      { id: 'EN', name: 'ENTRADA' },
      { id: 'ESQ', name: 'ESQUINA' },
      { id: 'ESTE', name: 'ESTE' },
      { id: 'ET', name: 'ETAPA' },
      { id: 'EX', name: 'EXTERIOR' },
      { id: 'FCA', name: 'FINCA' },
      { id: 'GJ', name: 'GARAJE' },
      { id: 'GS', name: 'GARAJE SOTANO' },
      { id: 'HC', name: 'HACIENDA' },
      { id: 'IN', name: 'INTERIOR' },
      { id: 'KM', name: 'KILOMETRO' },
      { id: 'LC', name: 'LOCAL' },
      { id: 'LM', name: 'LOCAL MEZZANINE' },
      { id: 'LT', name: 'LOTE' },
      { id: 'MCP', name: 'MUNICIPIO' },
      { id: 'MD', name: 'MODULO' },
      { id: 'MN', name: 'MEZZANINE' },
      { id: 'MZ', name: 'MANZANA' },
      { id: 'NORTE', name: 'NORTE' },
      { id: 'O', name: 'ORIENTE' },
      { id: 'OCC', name: 'OCCIDENTE' },
      { id: 'OESTE', name: 'OESTE' },
      { id: 'OF', name: 'OFICINA' },
      { id: 'P', name: 'PISO' },
      { id: 'PA', name: 'PARCELA' },
      { id: 'PD', name: 'PREDIO' },
      { id: 'PH', name: 'PENTHOUSE' },
      { id: 'PI', name: 'PARQUE INDUSTRIAL' },
      { id: 'PJ', name: 'PASAJE' },
      { id: 'PL', name: 'PLANTA' },
      { id: 'PN', name: 'PUENTE' },
      { id: 'POR', name: 'PORTERIA' },
      { id: 'PQ', name: 'PARQUEADERO' },
      { id: 'PS', name: 'PASEO' },
      { id: 'PT', name: 'PUESTO' },
      { id: 'SA', name: 'SALON' },
      { id: 'SC', name: 'SALON COMUNAL' },
      { id: 'SEC', name: 'SECTOR' },
      { id: 'SL', name: 'SOLAR' },
      { id: 'SM', name: 'SUPERMANZANA' },
      { id: 'SS', name: 'SEMISOTANO' },
      { id: 'ST', name: 'SOTANO' },
      { id: 'SU', name: 'SUITE' },
      { id: 'SUR', name: 'SUR' },
      { id: 'TER', name: 'TERMINAL' },
      { id: 'TO', name: 'TORRE' },
      { id: 'TV', name: 'TRANSVERSAL' },
      { id: 'TZ', name: 'TERRAZA' },
      { id: 'UN', name: 'UNIDAD' },
      { id: 'UR', name: 'UNIDAD RESIDENCIAL' },
      { id: 'URB', name: 'URBANIZACION' },
      { id: 'VDA', name: 'VEREDA' },
      { id: 'VTE', name: 'VARIANTE' },
      { id: 'ZF', name: 'ZONA FRANCA' },
      { id: 'ZN', name: 'ZONA' },
      { id: 'OTRA', name: 'OTRA NOMENCLATURA' },
      { id: 'ADL', name: 'ADLANTE' },
      { id: 'ALD', name: 'AL LADO' },
      { id: 'ATR', name: 'ATRAS' },
      { id: 'CAS', name: 'CASERIO' },
      { id: 'CEN', name: 'CENTRO' },
      { id: 'CS', name: 'COSULTORIO' },
      { id: 'CRR', name: 'CORREGIMIENTO' },
      { id: 'ESC', name: 'ESCALERA' },
      { id: 'HG', name: 'HANGAR' },
      { id: 'IP', name: 'INSPECCION DE POLICIA' },
      { id: 'IPD', name: 'INSPECCION DEPARTAMENTAL' },
      { id: 'IPM', name: 'INSPECCION MUNICIPAL' },
      { id: 'MJ', name: 'MOJON' },
      { id: 'MLL', name: 'MUELLE' },
      { id: 'PRJ', name: 'PARAJE' },
      { id: 'PW', name: 'PARK WAY' },
      { id: 'PAR', name: 'PARQUE' },
      { id: 'POS', name: 'POSTE' },
      { id: 'RP', name: 'ROUND POINT' },
      { id: 'SA', name: 'SALON' },
      { id: 'SC', name: 'SALON COMUNAL' },
      { id: 'VIA', name: 'VIA' },
    ],
    quadrants: [
      { id: 'NORTE', name: 'NORTE' },
      { id: 'SUR', name: 'SUR' },
      { id: 'ESTE', name: 'ESTE' },
      { id: 'SURESTE', name: 'SURESTE' },
      { id: 'NORESTE', name: 'NORESTE' },
      { id: 'OESTE', name: 'OESTE' },
      { id: 'SUROESTE', name: 'SUROESTE' },
      { id: 'NOROESTE', name: 'NOROESTE' },
      { id: 'ORIENTE', name: 'ORIENTE' },
      { id: 'SURORIENTE', name: 'SURORIENTE' },
      { id: 'NORORIENTE', name: 'NORORIENTE' },
      { id: 'OCCIDENTE', name: 'OCCIDENTE' },
      { id: 'SUROCCIDENTE', name: 'SUROCCIDENTE' },
      { id: 'NOROCCIDENTE', name: 'NOROCCIDENTE' },
    ],
    frequents: [
      { id: 'AK', name: 'AVENIDA CARRERA' },
      { id: 'AUT', name: 'AUTOPISTA' },
      { id: 'AV', name: 'AVENIDA' },
      { id: 'CL', name: 'CALLE' },
      { id: 'CR', name: 'CARRERA' },
      { id: 'CRV', name: 'CIRCUNVALAR' },
      { id: 'DG', name: 'DIAGONAL' },
      { id: 'TV', name: 'TRANSVERSAL' },
      { id: 'VTE', name: 'VARIANTE' },
      { id: 'PAR', name: 'PARQUE' },
      { id: 'VIA', name: 'VIA' },
      { id: 'URB', name: 'URBANIZACION' },
      { id: 'CON', name: 'CONJUNTO RESIDENCIAL' },
      { id: 'AP', name: 'APARTAMENTO' },
      { id: 'CA', name: 'CASA' },
      { id: 'IN', name: 'INTERIOR' },
      { id: 'BL', name: 'BLOQUE' },
      { id: 'MZ', name: 'MANZANA' },
    ],
    letters: [
      { id: '#', name: "NUMERAL '#'" },
      { id: '-', name: "GUION '-'" },
      { id: 'A', name: 'A' },
      { id: 'B', name: 'B' },
      { id: 'C', name: 'C' },
      { id: 'D', name: 'D' },
      { id: 'E', name: 'E' },
      { id: 'F', name: 'F' },
      { id: 'G', name: 'G' },
      { id: 'H', name: 'H' },
      { id: 'I', name: 'I' },
      { id: 'J', name: 'J' },
      { id: 'K', name: 'K' },
      { id: 'L', name: 'L' },
      { id: 'M', name: 'M' },
      { id: 'N', name: 'N' },
      { id: 'Ñ', name: 'Ñ' },
      { id: 'O', name: 'O' },
      { id: 'P', name: 'P' },
      { id: 'Q', name: 'Q' },
      { id: 'R', name: 'R' },
      { id: 'S', name: 'S' },
      { id: 'T', name: 'T' },
      { id: 'U', name: 'U' },
      { id: 'V', name: 'V' },
      { id: 'W', name: 'W' },
      { id: 'X', name: 'X' },
      { id: 'Y', name: 'Y' },
      { id: 'Z', name: 'Z' },
    ],
    numbers: [...Array(10).keys()],
    complement: '',
    filtered_types: [],
  }),
  computed: {
    addresses_types() {
      return this.filtered_types
    },
  },
  watch: {
    search(value) {
      if (!value) {
        this.filtered_types = this.types
      } else {
        this.filterAddress(value)
      }
    },
  },
  mounted() {
    this.filtered_types = this.types
  },
  methods: {
    onCancel() {
      // this.$emit('input', null)
      this.$emit('close', false)
    },
    onSave() {
      this.$emit('input', this.address)
      this.$emit('save', true)
    },
    onPress(way, isNumber = false) {
      if (
        isNumber &&
        !isNaN(parseInt(this.address.substring(this.address.length - 1)))
      ) {
        this.address = `${this.address}${way}`.trim().toUpperCase()
      } else {
        this.address = `${this.address} ${way}`.trim().toUpperCase()
      }
      this.complement = ''
      this.$emit('input', this.address)
    },
    onDelete() {
      this.address = this.address.substring(0, this.address.length - 1)
      this.$emit('input', this.address)
    },
    filterAddress(text) {
      this.filtered_types = this.types.filter((type) => {
        const regex = new RegExp(text, 'gi')
        return type.name.match(regex)
      })
    },
  },
}
</script>
