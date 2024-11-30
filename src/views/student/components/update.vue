<template>
  <v-card>
    <v-card-title>
      <h6 class="text-h6 px-3 py-2">Thông tin gia sư đăng ký</h6>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="4">
          <v-text-field
            label="Phụ huynh"
            v-model="studentEdit.StudentName"
          ></v-text-field>

          <v-select
            v-model="studentEdit.City"
            :items="cityLst"
            label="Tỉnh/TP"
            item-title="City"
            item-value="City"
            style="width: 100% !important"
          ></v-select>
          <v-text-field
            label="Địa chỉ"
            v-model="studentEdit.Address"
          ></v-text-field>
          <v-text-field
            label="Giới tính"
            v-model="studentEdit.SexStudent"
          ></v-text-field>
          <v-textarea
            v-model="studentEdit.NameSupports"
            label="Hỗ trợ"
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
          <v-textarea
            v-model="studentEdit.InfoMore"
            label="Thông tin thêm"
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="Liên hệ"
            v-model="studentEdit.Phone"
          ></v-text-field>

          <v-select
            v-model="studentEdit.District"
            :items="districtLst"
            label="Quận/huyện"
            item-title="District"
            item-value="District"
            style="width: 100% !important"
          ></v-select>
          <v-text-field
            label="Hình thức"
            v-model="studentEdit.FormTeach"
          ></v-text-field>
          <v-text-field
            label="TG dạy"
            v-model="studentEdit.TimeSupport"
          ></v-text-field>
          <v-textarea
            v-model="studentEdit.SkillSupport"
            label="Kỹ năng "
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
          <v-textarea
            v-model="studentEdit.Need"
            label="Yêu cầu thêm"
            row-height="20"
            rows="3"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="studentEdit.Status"
            :items="statusLst"
            label="Trạng thái"
            item-title="text"
            item-value="value"
            style="width: 100% !important"
          ></v-select>
          <v-select
            v-model="studentEdit.Ward"
            :items="communeLst"
            label="Phường/xã"
            item-title="Commune"
            item-value="Commune"
            style="width: 100% !important"
          ></v-select>
          <v-text-field label="Cấp" v-model="studentEdit.Level"></v-text-field>
          <v-text-field
            label="Bán kính"
            v-model="studentEdit.Radius"
          ></v-text-field>
          <v-text-field
            label="Môn"
            v-model="studentEdit.Subjects"
          ></v-text-field>
          <v-text-field
            label="MSSV"
            v-model="studentEdit.StudentID"
          ></v-text-field>
          <v-text-field
            label="TG tạo"
            v-model="studentEdit.TimeCreate"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="btClose">
        Đóng
      </v-btn>
      <v-btn @click="updateStudent"> Lưu thông tin </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { GSUpdateStudent } from "@/api/student";
import {
  GetCity,
  GetDistrictByCity,
  GetCommuneByCityAndDistrict,
} from "@/api/default";

export default {
  props: {
    studentInfo: Object,
  },
  data() {
    return {
      statusLst: [
        {
          value: 0,
          text: "Hủy",
        },
        {
          value: 1,
          text: "Mới tạo",
        },
        {
          value: 2,
          text: "Đã sửa",
        },
        {
          value: 3,
          text: "Đã duyệt",
        },
        {
          value: 4,
          text: "Đang dạy",
        },
      ],
      studentEdit: {},
      cityLst: [],
      districtLst: [],
      communeLst: [],
    };
  },
  emits: ["btClose"],
  watch: {
    "studentInfo.ReqParentID"() {
      this.studentEdit = this.studentInfo;
    },
    "studentEdit.City"() {
      this.getDistrictByCity();
    },
    "studentEdit.District"() {
      this.getCommuneByCityAndDistrict();
    },
  },
  methods: {
    getCity() {
      GetCity({}).then((res) => {
        this.cityLst = res.Data;
      });
    },
    getDistrictByCity() {
      GetDistrictByCity({
        City: "Thành phố Hà Nội",
      }).then((res) => {
        this.districtLst = res.Data;
      });
    },
    getCommuneByCityAndDistrict() {
      GetCommuneByCityAndDistrict({
        City: "Thành phố Hà Nội",
        District: this.studentEdit.District,
      }).then((res) => {
        this.communeLst = res.Data;
      });
    },
    updateStudent() {
      GSUpdateStudent({
        Data: this.studentEdit,
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
    this.studentEdit = this.studentInfo;
    this.getCity();
  },
};
</script>

<style></style>
