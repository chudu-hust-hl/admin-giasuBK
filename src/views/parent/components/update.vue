<template>
  <v-card>
    <v-card-title>
      <h6 class="text-h6 px-3 py-2">Thông tin yêu cầu phụ huynh</h6>
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
            v-model="parentEdit.PhoneEmail"
          ></v-text-field>
          <v-text-field
            label="Quận/huyện"
            v-model="parentEdit.District"
          ></v-text-field>

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
          <v-text-field
            label="Phường/xã"
            v-model="parentEdit.Ward"
          ></v-text-field>
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
      parentEdit: {},
    };
  },
  emits: ["btClose"],
  watch: {
    "parentInfo.ReqParentID"() {
      this.parentEdit = this.parentInfo;
    },
  },
  methods: {
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
  },
};
</script>

<style></style>
