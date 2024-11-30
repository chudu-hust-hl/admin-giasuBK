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
              v-model="parentEdit.NameParent"
            ></v-text-field>
            <v-text-field
              label="Liên hệ Phụ huynh"
              v-model="parentEdit.PhoneEmail"
            ></v-text-field>
            <v-text-field
              label="Tỉnh/TP"
              v-model="parentEdit.City"
            ></v-text-field>
            <v-text-field
              label="Quận/huyện"
              v-model="parentEdit.District"
            ></v-text-field>
            <v-text-field
              label="Địa chỉ"
              v-model="parentEdit.AddressParent"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <h6 class="text-h6 mb-4">Thông tin gia sư</h6>

            <!-- Dropdown for selecting students -->
            <v-select
              v-model="parentEdit.selectedStudent"
              :items="studentList"
              item-title="StudentID"
              item-value="StudentID"
              label="Chọn gia sư"
            >
            
            </v-select>

            <!-- Student fields -->
            <v-text-field
              label="Gia sư"
              :model-value="selectedStudentDetails.name"
              readonly
            ></v-text-field>
            <v-text-field
              label="Liên hệ Gia sư"
              :model-value="selectedStudentDetails.phone"
              readonly
            ></v-text-field>
            <v-text-field
              label="Địa chỉ"
              :model-value="selectedStudentDetails.address"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <h6 class="text-h6 mb-4">Thông tin lớp học</h6>
            <v-text-field
              label="TG tạo"
              v-model="parentEdit.TimeCreate"
            ></v-text-field>
            <v-select
              v-model="parentEdit.Status"
              :items="statusLst"
              label="Trạng thái"
              item-title="text"
              item-value="value"
              style="width: 100% !important"
            ></v-select>
            <v-text-field
              label="Lớp"
              v-model="parentEdit.ValueClass"
            ></v-text-field>
            <v-text-field
              label="Môn"
              v-model="parentEdit.Subjects"
            ></v-text-field>
            <v-text-field
              v-model="parentEdit.Money"
              label="Học phí"
              type="number"
            ></v-text-field>
            <v-select
              v-model="parentEdit.PaymentSta"
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
        <v-btn @click="updateData"> Lưu thông tin </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { UpdateParentInfo } from "@/api/parent";
  import { GetStudentLst, GSAddStudentByParentID } from "@/api/student";
  import {
    GetCity,
    GetDistrictByCity,
    GetCommuneByCityAndDistrict,
  } from "@/api/default";
  
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
            text: "Treo",
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
        studentList: [],
        selectedStudent: null,
        currentStudent: null,
        isLoading: false,
        parentEdit: {},
        cityLst: [],
        districtLst: [],
        communeLst: [],
        menu: false,
      };
    },
    emits: ["btClose"],
    watch: {
      'parentEdit.City'() {
        this.getDistrictByCity();
      },
      'parentEdit.District'() {
        this.getCommuneByCityAndDistrict();
      },
      "parentInfo.ReqParentID"() {
        this.parentEdit = this.parentInfo;
      },
      "studentInfo.ReqParentID"() {
        this.studentEdit = this.studentInfo;
      },
      "studentEdit.City"() {
        this.getDistrictByCity();
      },
      "studentEdit.District"() {
        this.getCommuneByCityAndDistrict();
      },
      'parentEdit.selectedStudent'(newVal) {
        if (newVal) {
          // Find the selected student from studentList
          this.currentStudent = this.studentList.find(
            student => student.StudentID === newVal
          );
          console.log('Selected student details:', this.currentStudent); // Debug log
        } else {
          this.currentStudent = null;
        }
      }
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
          this.cityLst = res.Data;
        });
      },
      getDistrictByCity() {
        GetDistrictByCity({
          City: this.parentEdit.City,
        }).then((res) => {
          this.districtLst = res.Data;
        });
      },
      getCommuneByCityAndDistrict() {
        GetCommuneByCityAndDistrict({
          City: this.parentEdit.City,
          District: this.parentEdit.District,
        }).then((res) => {
          this.communeLst = res.Data;
        });
      },

      getStudentLst() {
        this.isLoading = true; // Show loading state
        GetStudentLst({
          PageNumber: 1, // Start from page 1
          RowspPage: 1000, // Number of records to fetch
          Search: "", // Empty search term to get all students
        })
        .then((res) => {
          if (res.RespCode === 0) {
            this.studentList = res.Data.map(student => ({
              StudentID: student.StudentID,
              StudentName: student.StudentName,
              Phone: student.Phone,
              SexStudent: student.SexStudent,
              Address: student.Address,
            }));
          } else {
            console.error('Error loading students:', res);
            this.studentList = [];
          }
        })
        .catch((error) => {
          console.error('Error fetching students:', error);
          this.studentList = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
      },

      addStudentByParentID() {

        console.log('Adding student. Parent ID:', this.parentEdit.ReqParentID);
        console.log('Selected student ID:', this.parentEdit.selectedStudent);
        // Check if both parent and student are selected
        if (this.parentEdit.selectedStudent && this.parentEdit.ReqParentID) {
          const params = {
            ReqParentID: this.parentEdit.ReqParentID,
            StudentID: this.parentEdit.selectedStudent,  // Since v-select returns the value directly
            Status: this.parentEdit.Status || 0, // Default to 1 if not set
            Money: this.parentEdit.Money || 0,  // Add tuition fee if needed
            PaymentSta: this.parentEdit.PaymentSta || 0 // Add payment status if needed
          };

          console.log('Adding student to parent with params:', params); // Debug log

          GSAddStudentByParentID(params)
            .then((res) => {
              if (res.RespCode === 0) {
                this.$notify({
                  type: "success",
                  title: "Thành công",
                  text: "Thêm gia sư cho phụ huynh thành công",
                });
              } else {
                this.$notify({
                  type: "error",
                  title: "Lỗi",
                  text: res.RespMsg || "Không thể thêm gia sư cho phụ huynh",
                });
              }
            })
            .catch((error) => {
              console.error('Error adding student to parent:', error);
              this.$notify({
                type: "error",
                title: "Lỗi",
                text: "Đã xảy ra lỗi khi thêm gia sư cho phụ huynh",
              });
            });
        } else {
          this.$notify({
            type: "warning",
            title: "Cảnh báo",
            text: "Vui lòng chọn gia sư trước khi cập nhật",
          });
        }
      },
      

      updateData() {
        // Check if a student is selected
        if (!this.parentEdit.selectedStudent) {
          this.$notify({
            type: "warning",
            title: "Cảnh báo",
            text: "Vui lòng chọn gia sư trước khi cập nhật",
          });
          return;
        }

        // Update parent data
        const updatedParentInfo = {
          ...this.parentEdit,
          StudentID: this.parentEdit.selectedStudent // Make sure to include the selected student
        };

        UpdateParentInfo({
          ReqParentID: this.parentEdit.ReqParentID,
          ParentInfo: updatedParentInfo,
        })
        .then((res) => {
          if (res.RespCode === 0) {
            // Get the ParentID from the response if it's returned
            if (res.Data && res.Data.ReqParentID) {
              this.parentEdit.ReqParentID = res.Data.ReqParentID;
            }
            console.log('Parent updated, ParentID:', this.parentEdit.ReqParentID); // Debug log
            
            // Only proceed with adding student if we have a ParentID
            if (this.parentEdit.ReqParentID) {
              return this.addStudentByParentID();
            } else {
              throw new Error('ParentID not available after update');
            }
          } else {
            throw new Error(res.RespMsg || "Không thể cập nhật thông tin phụ huynh");
          }
        })
        .then(() => {
          this.$notify({
            type: "success",
            title: "Thành công",
            text: "Cập nhật thông tin thành công",
          });
          this.btClose();
        })
        .catch((error) => {
          console.error('Error in update process:', error);
          this.$notify({
            type: "error",
            title: "Lỗi",
            text: error.message || "Đã xảy ra lỗi trong quá trình cập nhật",
          });
        });
        this.btClose();
      },
      btClose() {
        this.$emit("btClose");
      },
    },
    created() {
      this.parentEdit = this.parentInfo;
      this.getStudentLst();
      if (this.parentEdit.StudentID) {
        this.parentEdit.selectedStudent = this.parentEdit.StudentID;
        this.currentStudent = this.studentList.find(student => student.StudentID === this.parentEdit.StudentID);
      }
      this.getCity();
      // If there's an existing student, set it
    },
  };
  </script>
  
  <style></style>  