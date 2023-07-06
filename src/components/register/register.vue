<template>
  <div style="display: flex; justify-content: center; margin-top: 100px">
    <div style="width: 30rem">
      <a-card title="Register">
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
          <a-form-item
            label="First Name"
            name="firstname"
            :rules="[
              { required: true, message: 'Please input the first name' },
            ]"
          >
            <a-input v-model:value="formState.firstname" />
          </a-form-item>
          <a-form-item
            :rules="[{ required: true, message: 'Please input the last name' }]"
            label="Last Name"
            name="lastname"
          >
            <a-input v-model:value="formState.lastname" />
          </a-form-item>
          <a-form-item label="Username" name="username">
            <a-input v-model:value="formState.username" />
          </a-form-item>

          <a-form-item
            name="email"
            label="Email"
            :rules="[
              {
                type: 'email',
                required: true,
                message: 'Please input the email',
              },
            ]"
          >
            <a-input v-model:value="formState.email" />
          </a-form-item>

          <a-form-item label="Password" name="password">
            <a-input-password v-model:value="formState.password" />
          </a-form-item>

          <a-form-item label="Confirm Password" name="confirmPassword">
            <a-input-password v-model:value="formState.confirmPassword" />
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">Register</a-button>
          </a-form-item>
        </a-form>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <router-link to="/login">Have an account? Login.</router-link>
        </a-form-item>
      </a-card>
    </div>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import { useUserStore } from "../../Stores/user";

const userStore = useUserStore();

const formState = reactive({
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  email: "",
  confirmPassword: "",
});

const rules = {
  username: [{ required: true, validator: usernameValidator }],
  password: [{ required: true, validator: passValidator }],
  confirmPassword: [{ required: true, validator: confirmPasswordValidator }],
  email: [{ required: true, type: "email", message: "Please input the email" }],
};

async function confirmPasswordValidator(_rule, value) {
  if (!value) {
    return Promise.reject("Please input the confirm password");
  }
  if (value.length < 6) {
    return Promise.reject("Confirm password must at least six");
  }

  if (value !== formState.password) {
    return Promise.reject("Password must be same");
  }

  return Promise.resolve();
}

async function usernameValidator(_rule, value) {
  if (!value) {
    return Promise.reject("Please input the username");
  }
  if (value.length < 6) {
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
  userStore.register(values)
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
</script>
<style lang=""></style>
