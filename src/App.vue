<template>
  <router-view></router-view>
</template>
<script setup>
import { notification } from "ant-design-vue";
import { onMounted, onUnmounted } from "vue";
import { toast } from "./utils/toast";

let subscribe;

onMounted(() => {
  toast.subscribe((val) => {
    notification[val.type]({ ...val });
    setTimeout(() => {
      notification.close(val.key);
    }, 3000);
  });
});

onUnmounted(() => {
  subscribe.unsubscribe();
});
</script>
<style>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgb(255, 255, 255);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>
