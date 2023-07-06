<template>
  <a-layout>
    <a-layout-header :style="{ background: '#fff', padding: 0 }">
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys1"
        theme="white"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <router-link to="/">Social</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider
        collapsed-width="0"
        breakpoint="lg"
        width="200"
        style="background: #fff"
      >
        <a-menu
          v-model:selectedKeys="selectedKeys2"
          v-model:openKeys="openKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="1"> Home </a-menu-item>
          <a-menu-item key="2" v-if="userStore.user" @click="handleLogout">
            Logout
          </a-menu-item>
          <a-menu-item key="3" v-else>
            <router-link to="/login">Login</router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            marginTop: '10px',
            minHeight: '85vh',
          }"
        >
          <a-button
            type="primary"
            style="margin-bottom: 10px"
            @click="showModal"
            v-if="userStore.user"
          >
            <template #icon><PlusOutlined /></template>
            Create new post</a-button
          >
          <a-modal
            v-model:visible="modalVisable"
            title="Create new post"
            ok-text="Create Post"
            @ok="handleCreate"
          >
            <a-textarea
              v-model:value="createPostValues.desc"
              placeholder="Description......."
              auto-size
            />
            <a-upload
              v-model:file-list="createPostValues.file"
              name="avatar"
              list-type="picture-card"
              :before-upload="handleChange"
              @preview="handlePreview"
              :max-count="1"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" />

              <div v-else>
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">Upload</div>
              </div>
              <a-modal
                :visible="previewVisible"
                :title="previewTitle"
                :footer="null"
                @cancel="handleCancel"
                :confirm-loading="confirmLoading"
              >
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-upload>
          </a-modal>
          <a-card
            v-for="post in posts"
            :title="post.userid?.firstname + ' ' + post.userid?.lastname"
            style="width: 400px"
          >
            <div>
              <div style="display: flex; justify-content: space-between">
                <p>{{ post.desc }}</p>
                <a-dropdown-button
                  v-if="post?.userid?._id === userStore?.user?.id"
                >
                  <template #overlay>
                    <a-menu @click="handleMenuClick">
                      <a-menu-item :key="{ key: 1, post: post }">
                        <DeleteOutlined />
                        Delete
                      </a-menu-item>
                      <a-menu-item :key="{ key: 2, post: post }">
                        <EditOutlined />
                        Edit
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown-button>
              </div>
              <a-image :width="300" :src="post.imageurl" />
            </div>
          </a-card>
          <a-button
            v-if="postStore.total > postStore.posts.length"
            @click="handleFetchData"
          >
            <template #icon><PlusOutlined /></template>
            Show More
          </a-button>
          <a-modal
            v-model:visible="editModalVisable"
            title="Edit Post"
            ok-text="Edit"
            @ok="handleEdit"
          >
            <div style="display: flex; flex-direction: column; gap: 10px">
              <a-textarea
                v-model:value="editPostValues.desc"
                placeholder="Description......."
                auto-size
              />
              <div v-if="editPostValues.imageurl">
                <div style="margin-bottom: 10px">
                  <a-button @click="handleRemovePhoto" danger>Remove</a-button>
                </div>
                <a-image
                  :width="100"
                  :src="editPostValues.imageurl"
                  alt="avatar"
                />
              </div>
              <a-upload
                v-else
                v-model:file-list="editPostValues.file"
                name="avatar"
                list-type="picture-card"
                :before-upload="handleChange"
                @preview="handlePreview"
                :max-count="1"
              >
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" />

                <div v-else>
                  <loading-outlined v-if="loading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">Upload</div>
                </div>
                <a-modal
                  :visible="previewVisible"
                  :title="previewTitle"
                  :footer="null"
                  @cancel="handleCancel"
                  :confirm-loading="confirmLoading"
                >
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-upload>
            </div>
          </a-modal>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup>
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { reactive, ref, onMounted, createVNode } from "vue";
import { usePostStore } from "../../Stores/post";
import { useUserStore } from "../../Stores/user";
import { storeToRefs } from "pinia";
import { Modal } from "ant-design-vue";

const postStore = usePostStore();
const userStore = useUserStore();

const { posts } = storeToRefs(postStore);
// const { user } = storeToRefs(useUserStore);

const selectedKeys1 = ref(["2"]);
const selectedKeys2 = ref(["/"]);
const openKeys = ref([1]);
const page = ref(1);

const createPostValues = reactive({ desc: "", file: null });
const editPostValues = ref({});

const modalVisable = ref(false);
const editModalVisable = ref(false);
const loading = ref(false);
const imageUrl = ref(null);
const previewVisible = ref(false);
const previewTitle = ref(false);
const previewImage = ref(null);
const confirmLoading = ref(false);

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    userStore.setToken(token);
    console.log(userStore.user);
    loadData();
  }
});

const handleFetchData = () => {
  page.value++;
  loadData();
};

const loadData = () => {
  postStore.getPosts({ page: page.value, pagesize: 25 });
};

const showModal = () => {
  modalVisable.value = true;
  imageUrl.value = null;
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

const handleChange = (info) => {
  previewImage.value = getBase64(file);
};

const handleCreate = () => {
  console.log("creating", createPostValues);
  confirmLoading.false = true;
  const uploadData = { desc: createPostValues.desc };
  if (createPostValues.file && createPostValues.file) {
    uploadData.file = createPostValues.file[0].originFileObj;
  }
  postStore
    .createPost(uploadData)
    .then(() => {
      confirmLoading.value = false;
      modalVisable.value = false;
      (createPostValues.desc = ""), (createPostValues.file = null);
    })
    .catch((err) => {
      console.log({ err });
      confirmLoading.value = false;
    });
};

const handleMenuClick = (e) => {
  const key = e.key;
  if (key.key === 1) {
    Modal.confirm({
      title: "Confirm",
      icon: createVNode(ExclamationCircleOutlined),
      content: "Are you sure want to delete?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk() {
        postStore.deletePost(key.post._id);
      },
    });
  } else {
    editModalVisable.value = true;
    editPostValues.value = JSON.parse(JSON.stringify(key.post));
  }
};

const handleLogout = () => {
  Modal.confirm({
    title: "Confirm",
    icon: createVNode(ExclamationCircleOutlined),
    content: "Are you sure want to logout?",
    okText: "Logout",
    cancelText: "Cancel",
    onOk() {
      userStore.logout();
      // router.push("/login");
    },
  });
};

const handleRemovePhoto = () => {
  editPostValues.value.imageurl = "";
};

const handleEdit = () => {
  const updateObj = JSON.parse(JSON.stringify(editPostValues.value));
  if (editPostValues.value.file && editPostValues.value.file.length) {
    console.log(editPostValues.value.file);
    updateObj.file = editPostValues.value.file[0].originFileObj;
  }
  console.log({ updateObj });
  postStore.updatePost(updateObj).then((res) => {
  editPostValues.value = {};
  editModalVisable.value = false;
  });
};
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

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
