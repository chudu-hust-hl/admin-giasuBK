<template>
  <v-card>
    <v-card-title>
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h6 py-2">Danh sách gia sư</h6>
        <div>
          <!-- <v-btn
            color="success"
            variant="tonal"
            icon="mdi-microsoft-excel"
            style="height: 42px"
            class="mr-1"
            @click="btExportExcel"
          ></v-btn> -->

          <!-- <span>
            <v-menu
              v-model="isMenuCare"
              activator="parent"
              transition="slide-y-transition"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="error"
                  variant="tonal"
                  icon="mdi-face-agent"
                  style="height: 42px"
                  v-bind="props"
                ></v-btn>
              </template>
              <v-card width="300" style="padding-top: 20px !important">
                <v-card-text>
                  <v-text-field
                    v-model="searchCustomer"
                    label="Nhân viên chăm sóc"
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    color="error"
                  />

                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="error"
                    block
                    @click="btSearchCustomerCare"
                  >
                    Tìm kiếm</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-menu>
          </span> -->
        </div>
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
            <v-select
              v-model="districtName"
              :items="districtLst"
              label="Quận/huyện"
              item-title="District"
              item-value="District"
              class="ml-1"
              style="width: 200px !important"
              hide-details
            ></v-select>
          </span>
          <span>
            <v-select
              v-model="communeName"
              :items="communeLst"
              label="Phường/xã"
              item-title="Commune"
              item-value="Commune"
              style="width: 200px !important"
              hide-details
            ></v-select>
          </span>
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
    ><Update :studentInfo="studentInfo" @btClose="btClose" />
  </v-dialog>

  <notifications />
</template>

<script>
import { GetStudentLst } from "@/api/student";
import Update from "./components/update.vue";
import { GetDistrictByCity, GetCommuneByCityAndDistrict } from "@/api/default";

export default {
  components: {
    Update,
  },
  data() {
    return {
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 50 },
        { title: "Trạng thái", key: "Status", sortable: false },
        { title: "Sinh viên", key: "StudentName", sortable: false },
        {
          title: "Liên hệ",
          key: "Phone",
          sortable: false,
          align: "center",
        },
        { title: "Địa chỉ", key: "Address", sortable: false },
        { title: "Cấp", key: "Level", sortable: false, align: "center" },
        { title: "Môn", key: "Subjects", sortable: false, align: "center" },

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
      desserts: [],
      pageNumber: 1,
      rowspPage: 10,
      search: "",
      dataLength: 0,
      districtLst: [],
      districtName: "",
      communeLst: [],
      communeName: "",
      isShowInfo: false,
      studentInfo: {},
    };
  },
  watch: {
    districtName() {
      this.getCommuneByCityAndDistrict();
    },
    pageNumber() {
      this.getStudentLst();
    },
    rowspPage() {
      this.getStudentLst();
    },
  },
  methods: {
    btShowInfo(data) {
      this.isShowInfo = true;
      this.studentInfo = data;
    },
    getDistrictByCity() {
      GetDistrictByCity({
        City: "Thành phố Hà Nội",
      }).then((res) => {
        if (res.RespCode == 0) {
          this.districtLst = res.Data;
        }
      });
    },
    getCommuneByCityAndDistrict() {
      GetCommuneByCityAndDistrict({
        City: "Thành phố Hà Nội",
        District: this.districtName,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.communeLst = res.Data;
        }
      });
    },
    getStudentLst() {
      GetStudentLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: this.search,
        District: this.districtName,
        Ward: this.communeName,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.desserts = res.Data.map((item, index) => {
          var row = (this.pageNumber - 1)* this.rowspPage
            return {
              ...item,
              Key: index + 1 + row,
            };
          });
          this.dataLength = res.TotalRows;
        }
      });
    },
    getStatus(status) {
      if (status == 0) {
        return { text: "Hủy", color: "error" };
      }
      if (status == 1) {
        return { text: "Mới tạo", color: "more" };
      }
      if (status == 2) {
        return { text: "Đã sửa", color: "blue" };
      }
      if (status == 3) {
        return { text: "Đã duyệt", color: "success" };
      }
      if (status == 4) {
        return { text: "Đang dạy", color: "success" };
      }
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
    this.getStudentLst();
    this.getDistrictByCity();
  },
};
</script>

<style></style>
