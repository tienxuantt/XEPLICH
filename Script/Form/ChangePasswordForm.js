// Form thay đổi mật khẩu
class ChangePasswordForm extends BaseForm {

    // Hàm khởi tạo
    constructor(jsCaller, idForm, width, height, title){
        super(jsCaller, idForm, width, height, title);
    }

    //overrride: Cất dữ liệu
    save(){
        let me = this,
            isValid = me.validateForm();

        if(isValid){
            let data = me.submitData();

            me.saveChangePassword(data);
            me.close();
        }
    }

    // Thực hiện đổi mật khẩu
    saveChangePassword(data){
        let me = this;

        CommonFn.PostPutAjax("POST", mappingApi.Master.urlChangePassword, data, function(response) {
            if(response.status == Enum.StatusResponse.Success){
                localStorage.setItem("Password", data.PasswordNew);
                me.showMessageSuccess("Đổi mật khẩu thành công!");
            }
        });
    }

    // Validate từng phần tử
    validateItem(value, setField){
        let me = this;

        switch(setField){
            case "Password": // Mật khẩu hiện tại
                return me.validateCurrentPassword(value);
            case "PasswordConfirm": // Mật khẩu xác nhận
                return me.validateConfirmPassWord(value);
            default:
                return {isValid: true};
        }
    }

    // Validate mật khẩu hiện tại phải đúng
    validateCurrentPassword(value){
        let result = {},
            passWord = localStorage.getItem("Password");

        if(value != passWord){
            result.isValid = false;
            result.tooltip = "Mật khẩu hiện tại không chính xác. Vui lòng nhập lại!";
        }else{
            result.isValid = true;
        }

        return result;
    }

    // Validate mật khẩu mới phải khớp nhau
    validateConfirmPassWord(value){
        let result = {},
            newPassword = $("input[SetField='PasswordNew']").val();

        if(value != newPassword){
            result.isValid = false;
            result.tooltip = "Mật khẩu mới và mật khẩu xác nhận không khớp nhau!";
        }else{
            result.isValid = true;
        }

        return result;
    }

    // Hàm hiển thị form
    show(){
        this.form.parent().show();
        this.resetFormData();
    }
}





