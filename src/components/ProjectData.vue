<template>
  <main class="main-container">
    <h2> Проектные данные </h2>
    <div class="button-group">
      <button class="basic-btn" style="margin-right: 5px"> Основное </button>
      <button class="btn-disabled" style="cursor: not-allowed" data-tooltip="эта подсказка длиннее, чем элемент"> Перечень ПСД </button>
    </div>
    <div class="form-container">
      <div class="form-block">
        <form ref="formData">
          <div class="form-column">
            <h4> Наименование и шифр</h4>
            <hr>
            <label for="name">Наименование</label>
            <input type="text" v-model="projectName" id="name">

            <label for="code">Шифр</label>
            <input type="text" v-model="projectCode" id="code">
          </div>
          <div class="form-column">
            <h4> Местонахождение проекта</h4>
            <hr>
            <template v-for="field in fields" :key="field.id">
              <label :for="field.id">{{ field.label }}</label>
              <input @input="fetchDataFrom" v-model="field.value" :id="field.id" @focus="showDropdown(field.listId)">
              <ul v-if="showList(field.listId)" class="dropdown-list">
                <li v-for="information in responseData" :key="information.id" @click="selectOption(field, information[field.apiProperty])">
                  {{ information[field.apiProperty] }}
                </li>
              </ul>
            </template>

            <div class="address-column">
              <div>
                <label for="house">Дом</label>
                <input type="text" v-model="projectHouse" id="house">
              </div>
              <div>
                <label for="housing">Корпус</label>
                <input type="text" v-model="projectHousing" id="housing">
              </div>
            </div>

            <label for="index">Почтовый индекс</label>
            <input class="postcode" type="number" v-model="projectPostcode" id="index">
          </div>
        </form>
      </div>
    </div>
    <hr>
    <div class="bottom-bnt">
      <button :class="isDisabled || emptyFields || !hasChanges ? 'btn-disabled' : 'save-btn'" :disabled="isDisabled || !hasChanges" type="submit" @click="saveChanges">Сохранить</button>
      <button :disabled="!hasChanges" class="reset-btn" type="reset" @click="cancelChanges">Отменить</button>
      <!--      не активна должна быть есть поля пустые-->
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import { onMounted, ref, computed, watch } from 'vue'

export default {
  setup() {
    const projectName = ref('')
    const projectCode = ref('')
    const projectHouse = ref('')
    const projectHousing = ref('')
    const projectPostcode = ref('')
    const activeList = ref(null)
    const isDisabled = ref(true)
    const responseData = ref([])
    const showError = ref(false)

    const fields = ref([
      { id: 'allCountries', label: 'Страна', apiProperty: 'country', listId: 'countries', value: '' },
      { id: 'region', label: 'Область/Край', apiProperty: 'region_with_type', listId: 'regions', value: '' },
      { id: 'locality', label: 'Населенный пункт', apiProperty: 'settlement', listId: 'settlement', value: '' },
      { id: 'street', label: 'Улица/Проспект', apiProperty: 'street', listId: 'streets', value: '' },
    ])

    const fetchDataFrom = () => {
      axios
          .post(
          'https://dadata.ru/api/v2/suggest/address',
          {
            query: "value",
            count: 20
          },
          {
            headers: {
              Authorization: 'Token 50535c6ad48bfcc31f62b5b76743ce0169a05d88',
            },
          }
      ).then(res => {
        responseData.value = res.data.suggestions.map(suggestion => suggestion.data)
      })
          .catch(error => {
            console.error(error)
          })
    }

    const hasChanges = computed(() => {
      return (
          projectName.value !== localStorage.getItem('Name') ||
          projectCode.value !== localStorage.getItem('Code') ||
          projectHouse.value !== localStorage.getItem('House') ||
          projectHousing.value !== localStorage.getItem('Housing') ||
          projectPostcode.value !== localStorage.getItem('Index') ||
          fields.value.some((field) => field.value !== localStorage.getItem(field.id))
      )
    })
    const emptyFields = computed(() => {
      return (
          projectName.value.trim() === '' ||
          projectCode.value.trim() === '' ||
          projectHouse.value.trim() === '' ||
          projectHousing.value.trim() === '' ||
          fields.value.some((field) => field.value.trim() === '')
      )
    })
    const saveChanges = () => {
      if (fields.value && projectName.value && projectCode.value && projectHouse.value && projectHousing.value && projectPostcode.value != '') {
        localStorage.setItem('Name', projectName.value)
        localStorage.setItem('Code', projectCode.value)
        localStorage.setItem('House', projectHouse.value)
        localStorage.setItem('Housing', projectHousing.value)
        localStorage.setItem('Index', projectPostcode.value)
        for (const field of fields.value) {
          localStorage.setItem(field.id, field.value)
        }
        isDisabled.value = false
        alert("Данные сохранены")
      } else {
        isDisabled.value = true
        alert("Заполните все поля")
      }
    }

    const showDropdown = (listId) => {
      activeList.value = listId;
    };

    const showList = (listId) => {
      return activeList.value === listId && responseData.value.length > 0;
    };

    const selectOption = (field, value) => {
      field.value = value;
      activeList.value = null;
    };

    watch(responseData, (newValue) => {
      if (newValue.length === 0) {
        activeList.value = null;
      }
    });
    const cancelChanges = () => {
      projectName.value = '' || localStorage.getItem('Name')
      projectCode.value = '' || localStorage.getItem('Code')
      projectHouse.value = '' || localStorage.getItem('House')
      projectHousing.value = '' || localStorage.getItem('Housing')
      projectPostcode.value = '' || localStorage.getItem('Index')
      for (const field of fields.value) {
        field.value = '' || localStorage.getItem(field.id)
      }
    }
    watch([projectName, projectCode, projectHouse, projectHousing, fields], () => {
      isDisabled.value = emptyFields.value
    })
    onMounted(() => {
      projectName.value = localStorage.getItem('Name') || ''
      projectCode.value = localStorage.getItem('Code') || ''
      projectHouse.value = localStorage.getItem('House') || ''
      projectHousing.value = localStorage.getItem('Housing') || ''
      projectPostcode.value = localStorage.getItem('Index') || ''
      for (const field of fields.value) {
        field.value = localStorage.getItem(field.id)
      }
    })
    return {
      showDropdown,
      showList,
      selectOption,
      saveChanges,
      projectCode,
      projectName,
      projectHouse,
      projectHousing,
      projectPostcode,
      isDisabled,
      responseData,
      fetchDataFrom,
      fields,
      cancelChanges,
      showError,
      emptyFields,
      hasChanges
    }
  }
}
</script>
