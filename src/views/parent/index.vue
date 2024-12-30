<template>
  <v-card>
    <v-card-title>
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h6 py-2">Danh sách phụ huynh tìm gia sư</h6>
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
              label="Tìm kiếm"
              style="width: 200px !important"
              hide-details
            ></v-text-field>
          </span>

          <v-btn
            color="info"
            variant="tonal"
            icon="mdi-magnify"
            style="height: 42px"
            @click="getParentLst"
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
    </v-data-table-server>
  </v-card>

  <v-dialog v-model="isShowInfo" persistent width="1000"
    ><Update :parentInfo="parentInfo" @btClose="btClose" />
  </v-dialog>

  <notifications />
</template>

<script>
import { GetParentLst } from "@/api/parent";
import Update from "./components/update.vue";
import { exportExcel } from "./function";
import { getUserName, getToken } from "@/utils/auth";

export default {
  components: {
    Update,
  },
  data() {
    return {
      isShowInfo: false,
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      search: "",
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 50 },
        /*{ title: "Trạng thái", key: "Status", sortable: false },*/
        { title: "Phụ huynh", key: "NameParent", sortable: false },
        { title: "SĐT", key: "PhoneParent", sortable: false , align: "center"},
        { title: "Địa chỉ", key: "AddressParent", sortable: false },
        { title: "Cấp", key: "Level", sortable: false, align: "center" },
        { title: "Lớp", key: "ValueClass", sortable: false, align: "center" },
        { title: "Môn", key: "Subjects", sortable: false, align: "center" },
        {
          title: "TG dạy",
          key: "TimeSupport",
          sortable: false,
          align: "center",
        },
        /*{
          title: "SL sv",
          key: "QuantityStudent",
          sortable: false,
          align: "center",
        },*/
        {
          title: "Hỗ trợ",
          key: "NameSupports",
          sortable: false,
          align: "center",
        },
        {
          title: "TG ĐK",
          key: "TimeCreate",
          sortable: false,
          align: "center",
        },
      ],
      parentInfo: {},
    };
  },
  watch: {
    pageNumber() {
      this.getParentLst();
    },
    rowspPage() {
      this.getParentLst();
    },
  },
  methods: {
    btShowInfo(data) {
      this.isShowInfo = true;
      this.parentInfo = data;
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "more" };
      }
      if (status == 2) {
        return { text: "Đang dạy", color: "blue" };
      }
      if (status == 3 || status == 4) {
        return { text: "Xong", color: "success" };
      }
    },
    getParentLst() {
      GetParentLst({
        PageNumber: this.pageNumber,
        RowsPage: this.rowspPage,
        Search: this.search,
      }).then((res) => {
        console.log("API Response:", res);
        if (res.RespCode == 0) {
          this.desserts = res.ParentList.map((item, index) => {
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
    this.getParentLst();
  },
};
</script>

<style></style>
