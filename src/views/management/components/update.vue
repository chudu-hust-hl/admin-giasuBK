<template>
    <v-card>
      <v-card-title>
        <h6 class="text-h6 px-3 py-2">Thông tin lớp</h6>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <h6 class="text-h6 mb-4">Thông tin phụ huynh</h6>
            <v-text-field
              label="Phụ huynh"
              v-model="classEdit.NameParent"
            ></v-text-field>
            <v-text-field
              label="Liên hệ Phụ huynh"
              v-model="classEdit.PhoneParent"
            ></v-text-field>
            <v-text-field
              label="Tỉnh/TP"
              v-model="classEdit.City"
            ></v-text-field>
            <v-text-field
              label="Quận/huyện"
              v-model="classEdit.District"
            ></v-text-field>
            <v-text-field
              label="Địa chỉ"
              v-model="classEdit.AddressParent"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <h6 class="text-h6 mb-4">Thông tin gia sư</h6>

            <!-- Student fields -->
            <v-text-field
              label="Mã số sinh viên Gia sư"
              v-model="classEdit.StudentID"
            ></v-text-field>

            <v-text-field
              label="Tên Gia sư"
              :model-value="classEdit.StudentName"
              readonly
            ></v-text-field>
            <v-text-field
              label="Liên hệ Gia sư"
              :model-value="classEdit.PhoneStudent"
              readonly
            ></v-text-field>
            <v-text-field
              label="Danh sách sinh viên ứng tuyển"
              :model-value="classEdit.Apply"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <h6 class="text-h6 mb-4">Thông tin lớp học</h6>
            <v-text-field
              label="TG tạo"
              v-model="classEdit.TimeCreate"
            ></v-text-field>
            <v-select
              v-model="classEdit.Status"
              :items="statusLst"
              label="Trạng thái"
              item-title="text"
              item-value="value"
            ></v-select>
            <v-text-field
              label="Lớp"
              v-model="classEdit.ValueClass"
            ></v-text-field>
            <v-text-field
              label="Môn"
              v-model="classEdit.Subjects"
            ></v-text-field>
            <v-text-field
              v-model="classEdit.Money"
              label="Học phí"
              type="number"
            ></v-text-field>
            <v-select
              v-model="classEdit.PaymentSta"
              label="Tình trạng học phí"
              :items="tuitionLst"
              item-title="text"
              item-value="value"
              style="width: 100% !important"
            ></v-select>          
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="btClose">
          Đóng
        </v-btn>
        <v-btn @click="updateClassInfo"> Lưu thông tin </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { UpdateClassInfo } from "@/api/class";
  import {
    GetCity,
    GetDistrictByCity,
    GetCommuneByCityAndDistrict,
  } from "@/api/location";
  
  export default {
    props: {
      classInfo: Object,
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
        tuitionLst: [
          {
            value:  0,
            text: "Chưa thanh toán",
          },
          {
            value: 1,
            text: "Đã thanh toán",
          },
        ],
        classEdit: {},
        cityLst: [],
        districtLst: [],
        communeLst: [],
      };
    },
    emits: ["btClose"],
    watch: {
      "classInfo.ClassID"() {
        this.classEdit = this.classInfo;
      },
      'classEdit.City'() {
        this.getCity();
      },
      'classEdit.District'() {
        this.getDistrictByCity();
      },
      'classEdit.Ward'() {
        this.getCommuneByCityAndDistrict();
      },
    },

    computed: {
      selectedStudentDetails() {
        return {
          name: this.currentStudent?.StudentName || '',
          phone: this.currentStudent?.Phone || '',
          address: this.currentStudent?.Address || ''
        };
      }
    },

    methods: {
      getCity() {
        GetCity({}).then((res) => {
          this.cityLst = res.LocationLst;
        });
      },
      getDistrictByCity() {
        GetDistrictByCity({
          City: this.classEdit.City,
        }).then((res) => {
          this.districtLst = res.LocationLst;
        });
      },
      getCommuneByCityAndDistrict() {
        GetCommuneByCityAndDistrict({
          City: this.classEdit.City,
          District: this.classEdit.District,
        }).then((res) => {
          this.communeLst = res.LocationLst;
        });
      },

      updateClassInfo() {
        UpdateClassInfo({
          ClassID: this.classEdit.ClassID,
          ClassInfo: this.classEdit,
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
      this.classEdit = this.classInfo;
      this.getCity();
      // If there's an existing student, set it
    },
  };
  </script>
  
  <style></style>  