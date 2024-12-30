<template>
    <v-card>
      <v-card-title>
        <div class="d-flex" style="justify-content: space-between">
          <h6 class="text-h6 py-2">Danh sách quản lý lớp học</h6>
        </div>
      </v-card-title>
      <v-data-table-server
        no-data-text="Không có dữ liệu"
        :headers="headers"
        :items="desserts"
        items-per-page-text=""
        sort-asc-icon="mdi-menu-up"
        sort-desc-icon="mdi-menu-down"
        :items-length="dataLength"
        @update:itemsPerPage="btRow"
        @update:page="btPage"
        height="calc(100vh - 210px)"
        :loading="loadding"
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
          { value: 10000, title: 'All' },
        ]"
      >
        <template v-slot:top>
          <div class="d-flex flex-wrap gap-2">

            <span>
              <v-text-field
                v-model="search"
                label="Tìm phụ huynh"
                style="width: 200px !important"
                hide-details
              ></v-text-field>
            </span>
  
            <v-btn
              color="info"
              variant="tonal"
              icon="mdi-magnify"
              style="height: 42px"
              @click="getClassList"
            ></v-btn>
          </div>
        </template>
        <template v-slot:item.Key="{ item }">
          {{ item.raw.Key }}
          <v-icon
            color="secondary"
            size="small"
            class="me-2"
            @click="btShowInfo(item.raw)"
            >mdi-pencil
          </v-icon>
        </template>
  
        <template v-slot:item.Status="{ item }">
          <v-chip :color="getStatus(item.raw.Status).color">
            {{ getStatus(item.raw.Status).text }}</v-chip
          >
        </template>

        <template v-slot:item.MoneySta="{ item }">
          <v-chip :color="getMoneySta(item.raw.MoneySta).color">
            {{ getMoneySta(item.raw.MoneySta).text }}</v-chip
          >
        </template>
      </v-data-table-server>
    </v-card>
  
    <v-dialog v-model="isShowInfo" persistent width="1000"
      ><Update :classInfo="classInfo" @btClose="btClose" />
    </v-dialog>
  
    <notifications />
  </template>

<script>
import { GetClassList } from "@/api/class";


import { formatDateDisplay, formatDateUpload } from "@/helpers/getTime";
import Update from "./components/update.vue";
import { exportExcel } from "./function";

export default {
  components: {
    Update,
  },
  data() {
    return {
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 50 },
        { title: "Trạng thái", key: "Status", sortable: false },
        { title: "Phụ huynh", key: "NameParent", sortable: false },
        { title: "SĐT Phụ huynh", key: "PhoneParent", sortable: false, align: "center"},
        { title: "Lớp", key: "ValueClass", sortable: false, align: "center" },
        { title: "Môn", key: "Subjects", sortable: false, align: "center" },
        { title: "Gia sư", key: "StudentName", sortable: false},
        { title: "SĐT Gia sư", key: "PhoneStudent", sortable: false},
        { title: "Thời gian ĐK", key: "TimeCreate", sortable: false},
        { title: "Học phí", key: "Money", sortable: false},
        { title: "Thanh toán", key: "MoneySta", sortable: false}, 
      ],
      isShowInfo: false,
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      search: "",
      studentInfo: {},
      classInfo: {},
      dataLength: 0,
    };
  },
  watch: {
    pageNumber() {
      this.getClassList();
    },
    rowspPage() {
      this.getClassList();
    },
  },
  methods: {
    btClose() {
      this.isShowInfo = false;
    },
    btShowInfo(data) {
      this.isShowInfo = true;
      this.classInfo = data;
    },
    getStatus(status) {
      if(status==0){
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Đang tìm", color: "more" };
      }
      if (status == 2) {
        return { text: "Đang dạy", color: "success" };
      }
      if (status == 3 || status == 4) {
        return { text: "Xong", color: "success" };
      }
      return {text: "Undefined", color: "blue"};
    },
    getMoneySta(status){
      if(status==0){
        return { text: "Chưa trả", color: "error" };
      }
      if (status == 1) {
        return { text: "Đã trả", color: "success" };
      }
      if (status == 2) {
        return { text: "Đã trả cọc", color: "more" };
      }
      return {text: "Undefined", color: "blue"};
    },
    getClassList() {
      GetClassList({
        PageNumber: this.pageNumber,
        RowsPage: this.rowspPage,
        Search: this.search,
      }).then((res) => {
        console.log("API Response:", res);
        if (res.RespCode == 0) {
          this.desserts = res.ClassList.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          this.dataLength = res.TotalRows;
        }
      });
    },
    btClose() {
      this.isShowInfo = false;
    },
    btPage(data) {
      this.pageNumber = data;
    },
    btRow(data) {
      this.rowspPage = data;
    },
  },
  created() {
    this.getClassList();
  },
};
</script>

<style></style>
