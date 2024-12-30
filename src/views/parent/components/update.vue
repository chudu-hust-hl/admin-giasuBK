<template>
  <v-card>
    <v-card-title>
      <h6 class="text-h6 px-3 py-2">Thông tin phụ huynh đăng ký</h6>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="4">
          <v-text-field
            label="Phụ huynh"
            v-model="parentEdit.NameParent"
          ></v-text-field>

          <v-text-field
            label="Tỉnh/TP"
            v-model="parentEdit.City"
          ></v-text-field>
          <v-text-field
            label="Địa chỉ"
            v-model="parentEdit.AddressParent"
          ></v-text-field>
          <v-text-field
            label="Giới tính yêu cầu"
            v-model="parentEdit.SexTeacher"
          ></v-text-field>
          <v-textarea
            v-model="parentEdit.NameSupports"
            label="Hỗ trợ"
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
          <v-textarea
            v-model="parentEdit.InfoMore"
            label="Thông tin thêm"
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="Liên hệ"
            v-model="parentEdit.PhoneParent"
          ></v-text-field>

          <v-select
            v-model="parentEdit.District"
            :items="districtLst"
            label="Quận/huyện"
            item-title="District"
            item-value="District"
            style="width: 100% !important"
          ></v-select>

          <v-text-field
            label="Hình thức"
            v-model="parentEdit.FormTeach"
          ></v-text-field>
          <v-text-field
            label="TG dạy"
            v-model="parentEdit.TimeSupport"
          ></v-text-field>
          <v-textarea
            v-model="parentEdit.SkillSupport"
            label="Kỹ năng "
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
          <v-textarea
            v-model="parentEdit.NeedMore"
            label="Yêu cầu thêm"
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="parentEdit.Status"
            :items="statusLst"
            label="Trạng thái"
            item-title="text"
            item-value="value"
            style="width: 100% !important"
          ></v-select>

          <v-select
            v-model="parentEdit.Ward"
            :items="communeLst"
            label="Phường/xã"
            item-title="Commune"
            item-value="Commune"
            style="width: 100% !important"
          ></v-select>

          <v-text-field label="Cấp" v-model="parentEdit.Level"></v-text-field>
          <v-text-field
            label="Lớp"
            v-model="parentEdit.ValueClass"
          ></v-text-field>
          <v-text-field
            label="Môn"
            v-model="parentEdit.Subjects"
          ></v-text-field>
          <v-text-field
            label="Số sinh viên"
            v-model="parentEdit.QuantityStudent"
          ></v-text-field>
          <v-text-field
            label="TG tạo"
            v-model="parentEdit.TimeCreate"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="btClose">
        Đóng
      </v-btn>
      <v-btn @click="updateParentInfo"> Lưu thông tin </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { UpdateParentInfo } from "@/api/parent";
import {
  GetCity,
  GetDistrictByCity,
  GetCommuneByCityAndDistrict,
} from "@/api/location";
export default {
  props: {
    parentInfo: Object,
  },
  data() {
    return {
      statusLst: [
        {
          value: 0,
          text: "Xóa",
        },
        {
          value: 1,
          text: "Mới tạo",
        },
        {
          value: 2,
          text: "Đang dạy",
        },
        {
          value: 3,
          text: "Xong",
        },
      ],
      parentEdit: {},
      cityLst: [],
      districtLst: [],
      communeLst: [],
    };
  },
  emits: ["btClose"],
  watch: {
    "parentInfo.ReqParentID"() {
      this.parentEdit = this.parentInfo;
    },
    "parentEdit.City"() {
      this.getCity();
    },
    "parentEdit.District"() {
      this.getDistrictByCity();
    },
    "parentEdit.Ward"() {
      this.getCommuneByCityAndDistrict();
    },
  },
  methods: {
    getCity() {
      GetCity({
      }).then((res) => {
        this.cityLst = res.LocationLst;
      });
    },
    getDistrictByCity() {
      GetDistrictByCity({
        City: this.parentEdit.City,
      }).then((res) => {
        this.districtLst = res.LocationLst;
      });
    },
    getCommuneByCityAndDistrict() {
      GetCommuneByCityAndDistrict({
        City: this.parentEdit.City,
        District: this.parentEdit.District,
      }).then((res) => {
        this.communeLst = res.LocationLst;
      });
    },
    updateParentInfo() {
      UpdateParentInfo({
        ReqParentID: this.parentEdit.ReqParentID,
        ParentInfo: this.parentEdit,
      }).then((res) => {
        if (res.RespCode == 0) {
          notify({
            type: "success",
            title: "Thành công",
            text: "Cập nhật yêu cầu tìm gia sư thành công",
          });
          this.btClose();
        }
      });
    },
    btClose() {
      this.$emit("btClose");
    },
  },
  created() {
    this.parentEdit = this.parentInfo; 
    this.getDistrictByCity();
  },
};
</script>

<style></style>
