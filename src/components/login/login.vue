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
            <a-input
              @input="clearError('username')"
              v-model:value="formState.username"
            />
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :help="formErrors.password"
            :validateStatus="formErrors.password ? 'error' : ''"
          >
            <a-input-password
              @input="clearError('password')"
              v-model:value="formState.password"
            />
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
import { reactive, ref } from "vue";
import { useUserStore } from "../../Stores/user";
import { useRouter } from "vue-router";

const router = useRouter();
const errorMessage = ref(null);

const userStore = useUserStore();

const formErrors = reactive({
  password: "",
});

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
  userStore
    .login(values)
    .then(() => router.push("/"))
    .catch(() => (formErrors.password = "Wrong username or password"));
};
const clearError = (fieldName) => {
  formErrors[fieldName] = "";
};
const onFinishFailed = (errorInfo) => {
  errorInfo.errorFields.map((err) => {
    formErrors[err.name[0]] = err.errors[0];
  });
  console.log("Failed:", errorInfo);
};
</script>
<style lang=""></style>
