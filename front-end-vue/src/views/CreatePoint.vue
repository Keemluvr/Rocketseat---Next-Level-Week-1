<template>
  <div id="page-create-point">
    <header>
      <img src="../assets/logo.svg" alt="Ecoleta"/>

      <router-link :to="{ name: 'home'}">
        <arrow-left-icon size="1.5x" class="custom-class"></arrow-left-icon>
        Voltar para home
      </router-link>

            </header>

            <form>
                <h1>Cadastro do <br/>ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div class="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name"/>
                    </div>
                    <div class="field-group">
                        <div class="field">
                            <label htmlFor="name">Email</label>
                            <input type="email" name="email" id="email"/>
                        </div>
                        <div class="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp"/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <l-map
                      v-if="showMap"
                      :zoom="zoom"
                      :center="center"
                      :options="mapOptions"
                      @update:center="centerUpdate"
                      @update:zoom="zoomUpdate"
                    >
                      <l-tile-layer
                        :url="url"
                        :attribution="attribution"
                      />
                      <l-marker :lat-lng="withPopup">
                      </l-marker>
                    </l-map>

                    <div class="field-group">
                        <div class="field">
                            <label for="uf">Estado (uf)</label>
                            <select name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                            </select>
                        </div>
                        <div class="field">
                            <label for="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul class="items-grid">
                        <li v-for="{ id, image_url, name } in items" :key="id">
                            <img :src="image_url" :alt="name"/>
                            <span>{{ name }}</span>
                        </li>
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
</template>

<script>
import { ArrowLeftIcon } from 'vue-feather-icons'
import L from 'leaflet'
import { latLng } from "leaflet"
import { LMap, LTileLayer, LMarker } from "vue2-leaflet"
import Items from '../services/item'

export default {
  name: 'CreatePoint',
  data() {
    return {
      zoom: 13,
      center: latLng(47.41322, -1.219482),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(47.41322, -1.219482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      items: null
    };
  },
  components: {
    ArrowLeftIcon,
    LMap,
    LTileLayer,
    LMarker
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom
    },
    centerUpdate(center) {
      this.currentCenter = center
    },
    innerClick() {
      alert("Click!")
    }
  },
  mounted() {
    delete L.Icon.Default.prototype._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    })

    Items.listar()
      .then(res => {
        this.items = res.data
        console.log(this.items)
      }).catch(e => {
        console.log(e)
      })
  },
}
</script>

<style>
  @import "https://unpkg.com/leaflet@1.6.0/dist/leaflet.css";

  #page-create-point {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }

  #page-create-point header {
    margin-top: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #page-create-point header a {
    color: var(--title-color);
    font-weight: bold;
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  #page-create-point header a svg {
    margin-right: 16px;
    color: var(--primary-color);
  }

  #page-create-point form {
    margin: 80px auto;
    padding: 64px;
    max-width: 730px;
    background: #fff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  #page-create-point form h1 {
    font-size: 36px;
  }

  #page-create-point form fieldset {
    margin-top: 64px;
    min-inline-size: auto;
    border: 0;
  }

  #page-create-point form legend {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  #page-create-point form legend h2 {
    font-size: 24px;
  }

  #page-create-point form legend span {
    font-size: 14px;
    font-weight: normal;
    color: var(--text-color);
  }

  #page-create-point form .field-group {
    flex: 1;
    display: flex;
  }

  #page-create-point form .field {
    flex: 1;

    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
  }

  #page-create-point form .field input[type="text"],
  #page-create-point form .field input[type="email"],
  #page-create-point form .field input[type="number"] {
    flex: 1;
    background: #f0f0f5;
    border-radius: 8px;
    border: 0;
    padding: 16px 24px;
    font-size: 16px;
    color: #6c6c80;
  }

  #page-create-point form .field select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    flex: 1;
    background: #f0f0f5;
    border-radius: 8px;
    border: 0;
    padding: 16px 24px;
    font-size: 16px;
    color: #6c6c80;
  }

  #page-create-point form .field input::placeholder {
    color: #a0a0b2;
  }

  #page-create-point form .field label {
    font-size: 14px;
    margin-bottom: 8px;
  }

  #page-create-point form .field :disabled {
    cursor: not-allowed;
  }

  #page-create-point form .field-group .field + .field {
    margin-left: 24px;
  }

  #page-create-point form .field-group input + input {
    margin-left: 24px;
  }

  #page-create-point form .field-check {
    flex-direction: row;
    align-items: center;
  }

  #page-create-point form .field-check input[type="checkbox"] {
    background: #f0f0f5;
  }

  #page-create-point form .field-check label {
    margin: 0 0 0 8px;
  }

  #page-create-point form .leaflet-container {
    width: 100%;
    height: 350px;
    border-radius: 8px;
    margin-bottom: 24px;
  }

  #page-create-point form button {
    width: 260px;
    height: 56px;
    background: var(--primary-color);
    border-radius: 8px;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    border: 0;
    align-self: flex-end;
    margin-top: 40px;
    transition: background-color 0.2s;
    cursor: pointer;
  }

  #page-create-point form button:hover {
    background: #2fb86e;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    list-style: none;
  }

  .items-grid li {
    background: #f5f5f5;
    border: 2px solid #f5f5f5;
    height: 180px;
    border-radius: 8px;
    padding: 32px 24px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }

  .items-grid li span {
    flex: 1;
    margin-top: 12px;
    display: flex;
    align-items: center;
    color: var(--title-color);
  }

  .items-grid li.selected {
    background: #e1faec;
    border: 2px solid #34cb79;
  }
</style>