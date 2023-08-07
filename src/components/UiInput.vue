<template>
  <input :class="{ 'empty-input': isEmptyInput }" type="text">
  <span v-if="isEmptyInput" class="error-message">Ошибка</span>
</template>


<script>
export default {
  setup() {
    const isEmptyInput = (value) => {
      return typeof value === 'string' && value.trim() === ''
    }
    return {
      isEmptyInput
    }
  }
}
</script>
<style>
.empty-input {
  border-bottom: 2px solid red;
}
.error-message {
  margin-top: 4px;
  display: flex;
  color: red;
  font-size: 14px;
}
</style>
