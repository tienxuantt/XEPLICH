// Lớp dùng cho layout chung các màn hình
class Layout{
    constructor(){
        // Khởi tạo các sự kiện
        this.initEvent();
        this.bindingFullName();
    }

    // Hiển thị tên người dùng đăng nhập
    bindingFullName(){
        let fullName = localStorage.getItem("FullName");

        if(fullName){
            $(".fullName-user").text(fullName);
        }
    }

    // Khởi tạo các sự kiện
    initEvent(){
        // Khi click vào thu gọn menu
        $(".header-left").click(this.showMenuBar);

        // Khi bấm đăng xuất
        $(".logout").click(this.logout.bind(this));

        // Khi bấm vào menu
        $(".submenu-item").click(this.redirecPage);

        // Khi bấm vào đổi mật khẩu
        $("#menuChangePassword").click(this.changePassword);
    }

    // Hàm xử lý khi đăng xuất
    logout(){
        // Xóa thông tin đăng nhập
        localStorage.removeItem("Authorization");
        localStorage.removeItem("Role");
        // Chuyển tới trang đăng nhập
        window.location.replace(Constant.url["Login"]);
    }

    // Hàm xử lý khi bấm vào menu
    redirecPage(){
        let urlTarget = $(this).attr("key");

        if(urlTarget){
            window.location.replace(Constant.url[urlTarget]);
        }
    }

    // Hàm xử lý khi thay đổi mật khẩu
    changePassword(){
        changePasswordForm.show();
    }

    // Hiển thị và thu gọn menubar
    showMenuBar(){
        $(".body-left").toggleClass("display-none");
    }
}

// Khởi tạo một trang layout
var layout = new Layout();

