<template>
  <v-card>
    <v-card-title>
      <div class="d-flex" style="justify-content: space-between">
        <h6 class="text-h6 py-2">Danh sách phụ huynh tìm gia sư</h6>
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
              v-model="isMenuSearch"
              activator="parent"
              transition="slide-y-transition"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  variant="tonal"
                  icon="mdi-account-search"
                  style="height: 42px"
                  class="mr-1"
                  v-bind="props"
                ></v-btn>
              </template>
              <v-card width="300" style="padding-top: 20px !important">
                <v-card-text>
                  <v-text-field
                    v-model="dataSearchPhone"
                    label="Số điện thoại / Mã tổ chức"
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    color="primary"
                  />

                  <v-btn
                    class="mt-2"
                    variant="tonal"
                    color="primary"
                    block
                    :loading="loadding"
                    @click="searchHistoryUser"
                  >
                    Tìm kiếm</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-menu>
          </span> -->
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
    ><Update :parentInfo="parentInfo" @btClose="btClose" />
  </v-dialog>

  <notifications />
</template>

<script>
import { GetParentLst } from "@/api/parent";

import { GetDistrictByCity, GetCommuneByCityAndDistrict } from "@/api/default";

import { formatDateDisplay, formatDateUpload } from "@/helpers/getTime";
import Update from "./components/update.vue";
import { exportExcel } from "./function";

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
      districtLst: [],
      districtName: "",
      communeLst: [],
      communeName: "",
      headers: [
        { title: "STT", sortable: false, key: "Key", width: 50 },
        { title: "Trạng thái", key: "Status", sortable: false },
        { title: "Phụ huynh", key: "NameParent", sortable: false },
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
        {
          title: "SL sv",
          key: "QuantityStudent",
          sortable: false,
          align: "center",
        },
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
    districtName() {
      this.getCommuneByCityAndDistrict();
    },
    pageNumber() {
      this.getParentLst();
    },
    rowspPage() {
      this.getParentLst();
    },
  },
  methods: {
    btClose() {
      this.isShowInfo = false;
    },
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
        return { text: "Treo", color: "blue" };
      }
      if (status == 3 || status == 4) {
        return { text: "Xong", color: "success" };
      }
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
    getParentLst() {
      GetParentLst({
        PageNumber: this.pageNumber,
        RowspPage: this.rowspPage,
        Search: this.search,
      }).then((res) => {
        if (res.RespCode == 0) {
          this.desserts = res.ParentLst.map((item, index) => {
            return {
              ...item,
              Key: index + 1,
            };
          });
          this.dataLength = res.TotalRows;
        }
      });
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
    this.getDistrictByCity();
  },
};
</script>

<style></style>
