// Trang login
class Login {

    // Hàm khởi tạo
    constructor() {
        // Div hiển thị thông báo lỗi
        this.error = $(".message-error");
        // Ô input nhập tên đăng nhập
        this.usernameField = $("input[FieldName='UserName']");
        // Bao quanh của ô input đăng nhập
        this.wrapUserNameField = $("#wrapUserNameField");

        // Ô input nhập mật khẩu
        this.passwordField = $("input[FieldName='PassWord']");
        // Bao quanh ô input nhập mật khẩu
        this.wrapPassWordField = $("#wrapPassWordField");
        // Khởi tạo các sự kiện
        this.initEvent();
    }

    // Hàm khởi tạo các sự kiện
    initEvent() {
        // Sự kiện khi blur ra ngoài ô input
        $("input").blur(this.inputBlur);
        // Sự kiện khi nhấn phím ô input
        $("input").keyup(this.inputKeyUp);
        // Khi focus vào ô input thì bôi đen chữ
        $("input").focus(this.inputFocus);
        // Xử lý khi bấm đăng nhập
        $(".btn-submit").click(this.login.bind(this));
    }

    // Hàm login
    login() {
        // Kiểm tra hợp lệ thì cho đăng nhập
        let valid = this.validateInput();

        if (valid) {
            let username = this.usernameField.val(),
                password = this.passwordField.val(),
                param = {
                    Username: username,
                    Password: password
                };

            login.submitData(param);
        };
    }
    
    // Hàm lấy giá trị validate các ô input
    validateInput() {
        let valid = true;
        let sumInvalid = 0;
        let typeError, value;

        // Kiểm tra từng ô input xem có hợp lệ không
        $("input").each(function () {
            value = $(this).val();
            if (value.trim() == "") {
                sumInvalid++;
                valid = false;
                typeError = parseInt($(this).attr("TypeError"));
            }
        });

        // Kiểm tra xem có phải tất cả input đều chưa nhập
        if (sumInvalid == 2) {
            this.setMessageError(Enum.TypeError.RequireAll);
        } else if (!valid) {
            this.setMessageError(typeError);
        }

        return valid;
    }

    // Gửi dữ liệu lên server
    submitData(param) {
        let me = this;

        CommonFn.LoginAjax(param,function(response) {
            if(response.status == Enum.StatusResponse.Success){
                localStorage.setItem("Authorization", response.data.Token);
                localStorage.setItem("UserName", param.Username);
                localStorage.setItem("Password", param.Password);
                localStorage.setItem("FullName", parseJwt(response.data.Token).fullName);
                localStorage.setItem("Role", parseJwt(response.data.Token).role);
                
                window.location.replace(Constant.url["SemesterManager"]);
            }else{
                me.setMessageError(Enum.TypeError.LoginInvalid);
            }
        });
    }

    // Khi nhấn phím của ô input
    inputKeyUp() {
        let value = $(this).val();
        let typeError = parseInt($(this).attr("TypeError"));
        if (value.trim() != "") {
            login.error.hide();
            $(this).parent().removeClass("border-red");
        } else {
            login.setMessageError(typeError);
        }
    }

    // Xử lý sự kiện khi nhấn phím ô input
    inputBlur() {
        let typeError = parseInt($(this).attr("TypeError"));
        let value = $(this).val();
        if (value.trim() == "") {
            login.setMessageError(typeError);
        }
    }

    // Reset các ô input
    resetInput() {
        $("input").val("");
    }

    // Khi focus vào ô input thì bôi đen chữ
    inputFocus() {
        $(this).select();
    }

    // Hiển thị các thông báo lỗi khi đăng nhập không thành công
    setMessageError(typeError) {
        this.error.show();
        this.error.text(Enum.TypeErrorMessage[typeError]);
        this.wrapUserNameField.removeClass("border-red");
        this.wrapPassWordField.removeClass("border-red");
        switch (typeError) {
            case Enum.TypeError.RequireUserName:
                this.wrapUserNameField.addClass("border-red");
                this.usernameField.focus();
                break;
            case Enum.TypeError.RequirePassWord:
                this.wrapPassWordField.addClass("border-red");
                this.passwordField.focus();
                break;
            case Enum.TypeError.LoginInvalid:
                this.wrapUserNameField.addClass("border-red");
                this.wrapPassWordField.addClass("border-red");
                this.usernameField.focus();
                break;
            default:
                this.wrapUserNameField.addClass("border-red");
                this.wrapPassWordField.addClass("border-red");
                this.usernameField.focus();
                this.error.html(Enum.TypeErrorMessage[Enum.TypeError.RequireUserName] + "<br>" + Enum.TypeErrorMessage[Enum.TypeError.RequirePassWord]);
        }
    }
}

// Khởi tạo một form login
var login = new Login();
