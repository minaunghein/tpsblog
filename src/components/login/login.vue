<template>
  <div style="display: flex; justify-content: center; margin-top: 100px">
    <div style="width: 30rem">
      <a-card title="Login">
        <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          :rules="rules"
        >
          <a-form-item label="Username" name="username">
            <a-input v-model:value="formState.username" />
          </a-form-item>

          <a-form-item label="Password" name="password">
            <a-input-password v-model:value="formState.password" />
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">Login</a-button>
          </a-form-item>
        </a-form>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <router-link to="/register">Haven't account? Register.</router-link>
        </a-form-item>
      </a-card>
    </div>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import { useUserStore } from "../../Stores/user";
import {useRouter} from 'vue-router'

const router = useRouter();

const userStore = useUserStore();

const formState = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [{ required: true, validator: usernameValidator }],
  password: [{ required: true, validator: passValidator }],
};

async function usernameValidator(_rule, value) {
  if (!value) {
    return Promise.reject("Please input the username");
  }
  if (value.length < 1) {
    return Promise.reject("Username must at least six");
  }
  return Promise.resolve();
}

async function passValidator(_rule, value) {
  if (!value) {
    return Promise.reject("Please input the password");
  }
  if ((value + "").length < 6) {
    return Promise.reject("Password must be at least six");
  }
  return Promise.resolve();
}

const onFinish = (values) => {
  console.log("Success:", values);
  userStore.login(values).then(() => router.push('/'));
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>
<style lang=""></style>
